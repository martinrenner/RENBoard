from typing import Annotated
from fastapi import APIRouter, Depends
from sqlmodel import Session
from services.tag_service import TagService
from tokens.access_token import AccessToken
from database import get_session
from schemas.tag import TagRead


tag_router = APIRouter(prefix="/tag", tags=["Tag"])


db_dependency = Annotated[Session, Depends(get_session)]
user_dependency = Annotated[dict, Depends(AccessToken.verify_token)]

tag_service = TagService()

@tag_router.get("/", response_model=list[TagRead])
def read_all_tags(user: user_dependency, session: db_dependency):
    """
    # Read all tags

    Retrieve all tags from the database.

    Returns:
    - `list[TagRead]`: A list of TagRead objects representing the tags.
    """
    tags = tag_service.select_all_status_db(session)
    return [TagRead.from_tag(tag) for tag in tags]
    