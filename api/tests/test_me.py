"""Spike D1-01: a valid token returns 200 on /me, a tampered one returns 401.

Product-agnostic: issuer, audience and workspace claim come from app.config defaults.
"""

import time
from types import SimpleNamespace

import jwt
import pytest
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from fastapi.testclient import TestClient

from app.auth import get_jwks_client
from app.config import Settings, get_settings
from app.main import app

SETTINGS = Settings(auth_jwks_url="http://unused.invalid/jwks")
CLAIM = SETTINGS.workspace_claim
KEY = Ed25519PrivateKey.generate()
OTHER_KEY = Ed25519PrivateKey.generate()


class FakeJwks:
    """Stands in for PyJWKClient: always resolves to the trusted public key."""

    def get_signing_key_from_jwt(self, token: str) -> SimpleNamespace:
        return SimpleNamespace(key=KEY.public_key())


def make_token(key=KEY, **overrides) -> str:
    now = int(time.time())
    claims = {
        "sub": "user_123",
        "iss": SETTINGS.auth_issuer,
        "aud": SETTINGS.auth_audience,
        "iat": now,
        "exp": now + 900,
        "role": "user",
        CLAIM: "ws_1",
    }
    claims.update(overrides)
    claims = {k: v for k, v in claims.items() if v is not None}
    return jwt.encode(claims, key, algorithm="EdDSA", headers={"kid": "test"})


@pytest.fixture
def client():
    app.dependency_overrides[get_settings] = lambda: SETTINGS
    app.dependency_overrides[get_jwks_client] = FakeJwks
    yield TestClient(app)
    app.dependency_overrides.clear()


def get_me(client: TestClient, token: str | None):
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    return client.get("/me", headers=headers)


def test_valid_token_returns_principal(client):
    res = get_me(client, make_token())
    assert res.status_code == 200
    assert res.json() == {"sub": "user_123", CLAIM: "ws_1", "role": "user"}


def test_token_without_workspace(client):
    res = get_me(client, make_token(role="demo", **{CLAIM: None}))
    assert res.status_code == 200
    assert res.json()["role"] == "demo"
    assert res.json()[CLAIM] is None


def test_tampered_payload_is_rejected(client):
    header, _, signature = make_token().split(".")
    forged_payload = make_token(role="admin").split(".")[1]
    assert get_me(client, f"{header}.{forged_payload}.{signature}").status_code == 401
    assert get_me(client, f"{header}.{forged_payload[:-2]}AA.{signature}").status_code == 401


def test_token_signed_by_another_key_is_rejected(client):
    assert get_me(client, make_token(key=OTHER_KEY)).status_code == 401


@pytest.mark.parametrize(
    "overrides",
    [
        {"exp": int(time.time()) - 60},
        {"aud": "some-other-api"},
        {"iss": "https://evil.example"},
        {"role": None},
        {"exp": None},
    ],
    ids=["expired", "wrong-audience", "wrong-issuer", "missing-role", "missing-exp"],
)
def test_invalid_claims_are_rejected(client, overrides):
    assert get_me(client, make_token(**overrides)).status_code == 401


def test_unsigned_token_is_rejected(client):
    unsigned = jwt.encode(
        {"sub": "x", "iss": SETTINGS.auth_issuer, "aud": SETTINGS.auth_audience, "role": "admin"},
        key=None,
        algorithm="none",
    )
    assert get_me(client, unsigned).status_code == 401


def test_missing_or_garbage_header_is_rejected(client):
    assert get_me(client, None).status_code == 401
    assert get_me(client, "not-a-jwt").status_code == 401
