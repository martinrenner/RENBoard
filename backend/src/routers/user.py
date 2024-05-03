from typing import Annotated
from fastapi import APIRouter, Depends
from services.user_service import UserService
from schemas.user import UserCreate, UserRead
from database import get_session
from sqlmodel import Session

user_router = APIRouter(prefix="/user", tags=["User"])

db_dependency = Annotated[Session, Depends(get_session)]

user_service = UserService()


@user_router.post("/", response_model=UserRead)
def create_user(user_create: UserCreate, session: db_dependency):
    """
    ## Create a new user (**register**)

    This endpoint will create a new user in the database.

    - **user_create**: User object

    Returns:
    - `user`: User object
    """
    user = user_service.insert_user_db(user_create, session)
    return UserRead.from_user(user)
