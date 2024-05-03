from typing import Annotated
from fastapi import APIRouter, Depends
from sqlmodel import Session
from services.priority_service import PriorityService
from schemas.priority import PriorityRead
from tokens.access_token import AccessToken
from database import get_session


priority_router = APIRouter(prefix="/priority", tags=["Priority"])

db_dependency = Annotated[Session, Depends(get_session)]
user_dependency = Annotated[dict, Depends(AccessToken.verify_token)]

priority_service = PriorityService()


@priority_router.get("/", response_model=list[PriorityRead])
def read_all_priorities(user: user_dependency, session: db_dependency):
    """
    ## Read All Priorities

    Retrieve all priorities for tasks.

    Returns:
    - `List[PriorityRead]`: A list of PriorityRead objects representing the retrieved priorities.
    """
    priorities = priority_service.select_all_prorities_db(session)
    return [PriorityRead.from_priority(priority) for priority in priorities]
