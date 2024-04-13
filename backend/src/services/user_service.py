from sqlmodel import Session
from schemas.user import UserCreate
from models import User
from database import commit_and_handle_exception, refresh_and_handle_exception
from services.auth_service import bcrypt_context


class UserService:
    def insert_user_db(self, user_create: UserCreate, session: Session):
        new_user = User(
            name=user_create.name.strip(),
            surname=user_create.surname.strip(),
            username=user_create.username.strip(),
            email=user_create.email.strip(),
            hashed_password=bcrypt_context.hash(user_create.password.strip()),
        )
        session.add(new_user)
        commit_and_handle_exception(session)
        refresh_and_handle_exception(session, new_user)
        return new_user
