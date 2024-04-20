from datetime import datetime, timedelta
import os
from typing import Annotated
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from tokens.token import Token
from models import User

SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "ULTRA_SECRET_KEY")
ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", 10))

oaouth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/token")


class AccessToken(Token):
    @staticmethod
    def create_token(user: User):
        token_payload = {
            "sub": user.email,
            "id": user.id,
            "iat": datetime.utcnow(),
            "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
            "typ": "Access",
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
                raise HTTPException(status_code=401, detail="Access token expired")

            if username is None or user_id is None or typ != "Access":
                raise HTTPException(status_code=401, detail="Invalid access token")
            return User(username=username, id=user_id)
        except jwt.JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")
