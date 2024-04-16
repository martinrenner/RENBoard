from fastapi import HTTPException
from sqlmodel import Session, select
from schemas.user import UserLogin
from tokens.refresh_token import RefreshToken
from models import User
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext


bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    def verify_user_and_password(self, user_data: OAuth2PasswordBearer, session: Session):
        user_data = UserLogin(username=user_data.username, password=user_data.password)
        user = self._verify_user(user_data, session)
        self._verify_password(user_data.password, user.hashed_password)
        return user

    def verify_token_and_user(self, token: str, session: Session):
        user_data = RefreshToken.verify_token(token)
        user = self._verify_user(user_data, session)
        return user

    def _verify_user(self, user_login: User, session: Session):
        query = select(User).where(User.username == user_login.username.strip() or User.email == user_login.username.strip())
        user = session.exec(query).first()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid user")
        return user

    def _verify_password(self, plain_password: str, hashed_password: str):
        if not bcrypt_context.verify(plain_password.strip(), hashed_password):
            raise HTTPException(status_code=401, detail="Invalid password")
