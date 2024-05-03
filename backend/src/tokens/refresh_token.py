from datetime import datetime, timedelta
import os
from tokens.token import Token
from typing import Annotated
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from models import User
from schemas.user import UserLogin

SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "ULTRA_SECRET_KEY")
ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("JWT_REFRESH_TOKEN_EXPIRE_DAYS", 7))

oaouth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/token")


class RefreshToken(Token):
    @staticmethod
    def create_token(user: User):
        token_payload = {
            "sub": user.email,
            "id": user.id,
            "iat": datetime.utcnow(),
            "exp": datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
            "typ": "Refresh",
        }
        return jwt.encode(token_payload, SECRET_KEY, algorithm=ALGORITHM)

    @staticmethod
    def verify_token(token: Annotated[str, Depends(oaouth2_bearer)]):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username: str = payload.get("sub")
            user_id: int = payload.get("id")
            exp: int = payload.get("exp")
            typ: str = payload.get("typ")

            if exp is not None and exp < datetime.utcnow().timestamp():
                raise HTTPException(status_code=401, detail="Refresh token expired")

            if username is None or user_id is None or typ != "Refresh":
                raise HTTPException(status_code=401, detail="Invalid refresh token")
            return UserLogin(username=username)
        except jwt.JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")
