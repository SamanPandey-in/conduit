from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Values must match the web app's Better Auth JWT plugin config.

    This verifies human sessions from the Conduit web app only. Agent (machine)
    clients get their own client-credentials tokens, built separately.
    """

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_title: str = "Conduit API"
    # Where the Next.js app publishes its public keys (Better Auth JWT plugin).
    auth_jwks_url: str = "http://localhost:3001/api/auth/jwks"
    # `iss` the web app stamps on tokens (its BETTER_AUTH_URL).
    auth_issuer: str = "http://localhost:3001"
    # `aud` the web app stamps on tokens meant for this API.
    auth_audience: str = "conduit-api"
    # Claim carrying the workspace id. Conduit calls it a tenant.
    workspace_claim: str = "tenant"
    # Allowed browser origins (the web app). Comma-separated.
    cors_origins: str = "http://localhost:3001"


@lru_cache
def get_settings() -> Settings:
    return Settings()
