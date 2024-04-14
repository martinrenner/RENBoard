from typing import Annotated
from fastapi import APIRouter, Depends
from sqlmodel import Session
from schemas.default import DefaultBase
from services.status_service import StatusService
from schemas.status import StatusCreate, StatusRead, StatusUpdate
from tokens.access_token import AccessToken
from database import get_session


status_router = APIRouter(prefix="/project", tags=["Status"])

db_dependency = Annotated[Session, Depends(get_session)]
user_dependency = Annotated[dict, Depends(AccessToken.verify_token)]

status_service = StatusService()


@status_router.post("/{project_id}/run/{run_id}/status/", response_model=StatusRead)
def create_status(status_create: StatusCreate, user: user_dependency, session: db_dependency):
    pass

@status_router.get("/{project_id}/run/{run_id}/status/{status_id}", response_model=StatusRead)
def read_status(project_id: int, run_id: int, status_id: int, user: user_dependency, session: db_dependency):
    pass


@status_router.get("/{project_id}/run/{run_id}/status/", response_model=list[StatusRead])
def read_all_status(project_id: int, run_id: int, user: user_dependency, session: db_dependency):
    pass


@status_router.put("/{project_id}/run/{run_id}/status/{status_id}/update", response_model=StatusRead)
def update_status(project_id: int, run_id: int, status_id: int, status_update: StatusUpdate, user: user_dependency, session: db_dependency):
    pass


@status_router.delete("/{project_id}/run/{run_id}/status/{status_id}/delete", response_model=DefaultBase)
def delete_status(project_id: int, run_id: int, status_id: int, user: user_dependency, session: db_dependency):
    pass