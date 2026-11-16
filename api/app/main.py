from typing import Annotated

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth import Principal, current_principal
from app.config import get_settings

settings = get_settings()

app = FastAPI(title=settings.app_title, version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_origins.split(",") if o.strip()],
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/me")
def me(principal: Annotated[Principal, Depends(current_principal)]) -> dict[str, str | None]:
    return {
        "sub": principal.sub,
        settings.workspace_claim: principal.workspace,
        "role": principal.role,
    }
