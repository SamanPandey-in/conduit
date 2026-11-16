"""Verify JWTs minted by the web app (Better Auth JWT plugin) against its JWKS.

Only claims from a token whose signature, issuer, audience and expiry all check out
are trusted. Nothing from the request body or unverified headers is used for identity.
"""

from dataclasses import dataclass
from functools import lru_cache
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import Settings, get_settings

# Asymmetric algorithms only. Never accept HS* (key confusion) or "none".
ALLOWED_ALGORITHMS = ["EdDSA", "ES256", "RS256", "PS256"]
REQUIRED_CLAIMS = ["sub", "iss", "aud", "exp", "iat"]

bearer = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class Principal:
    sub: str
    role: str
    workspace: str | None


@lru_cache
def get_jwks_client() -> jwt.PyJWKClient:
    # PyJWKClient caches keys and refetches on an unknown `kid` (key rotation).
    return jwt.PyJWKClient(get_settings().auth_jwks_url, cache_keys=True, lifespan=300)


def _unauthorized(detail: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


def verify_token(token: str, settings: Settings, jwks: jwt.PyJWKClient) -> Principal:
    try:
        signing_key = jwks.get_signing_key_from_jwt(token)
        claims = jwt.decode(
            token,
            signing_key.key,
            algorithms=ALLOWED_ALGORITHMS,
            audience=settings.auth_audience,
            issuer=settings.auth_issuer,
            options={"require": REQUIRED_CLAIMS},
            leeway=10,
        )
    except jwt.PyJWKClientConnectionError as exc:
        # Can't reach the key set: a server problem, not the caller's fault.
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Key set unavailable") from exc
    except jwt.PyJWTError as exc:
        # Covers bad signature, expired, wrong iss/aud, unknown kid, malformed token.
        raise _unauthorized("Invalid token") from exc

    role = claims.get("role")
    if not isinstance(role, str):
        raise _unauthorized("Invalid token")
    workspace = claims.get(settings.workspace_claim)
    return Principal(
        sub=claims["sub"],
        role=role,
        workspace=workspace if isinstance(workspace, str) else None,
    )


def current_principal(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)],
    settings: Annotated[Settings, Depends(get_settings)],
    jwks: Annotated[jwt.PyJWKClient, Depends(get_jwks_client)],
) -> Principal:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise _unauthorized("Missing bearer token")
    return verify_token(credentials.credentials, settings, jwks)
