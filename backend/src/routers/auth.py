from typing import Annotated
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from tokens.access_token import AccessToken
from tokens.refresh_token import RefreshToken
from services.auth_service import AuthService
from schemas.token import TokenRead
from database import get_session
from sqlmodel import Session
import os

ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", 10))
REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("JWT_REFRESH_TOKEN_EXPIRE_DAYS", 7))

auth_router = APIRouter(prefix="/auth", tags=["Auth"])

db_dependency = Annotated[Session, Depends(get_session)]

auth_service = AuthService()


@auth_router.post("/token", response_model=TokenRead)
def token_user(user_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: db_dependency):
    user = auth_service.verify_user_and_password(user_data, session)
    return TokenRead.from_auth(AccessToken.create_token(user), RefreshToken.create_token(user))


@auth_router.post("/refresh", response_model=TokenRead)
def refresh_token_user(token: str, session: db_dependency):
    user = auth_service.verify_token_and_user(token, session)
    return TokenRead.from_auth(AccessToken.create_token(user), RefreshToken.create_token(user))
