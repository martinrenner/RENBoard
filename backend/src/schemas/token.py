from pydantic import BaseModel, ConfigDict
from tokens.refresh_token import RefreshToken
from tokens.access_token import AccessToken
import os

ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", 10))
REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("JWT_REFRESH_TOKEN_EXPIRE_DAYS", 7))


class TokenBase(BaseModel):
    model_config = ConfigDict(extra="forbid")


class TokenRead(TokenBase):
    access_token: str
    expires_in: int
    refresh_expires_in: int
    refresh_token: str
    token_type: str

    @classmethod
    def from_auth(cls, access_token: AccessToken, refresh_token: RefreshToken):
        return cls(
            access_token=access_token,
            expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            refresh_expires_in=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
            refresh_token=refresh_token,
            token_type="Bearer",
        )
