from typing import Annotated
from fastapi import APIRouter, Depends
from sqlmodel import Session
from services.run_service import RunService
from schemas.default import DefaultBase
from schemas.run import RunCreate, RunRead, RunUpdate
from tokens.access_token import AccessToken
from database import get_session


run_router = APIRouter(prefix="/project", tags=["Run"])

db_dependency = Annotated[Session, Depends(get_session)]
user_dependency = Annotated[dict, Depends(AccessToken.verify_token)]

run_service = RunService()


@run_router.post("/{project_id}/run/", response_model=RunRead)
def create_run(project_id: int, run_create: RunCreate, user: user_dependency, session: db_dependency):
    pass

@run_router.get("/{project_id}/run/{run_id}/", response_model=RunRead)
def read_run(project_id: int, run_id: int, user: user_dependency, session: db_dependency):
    pass


@run_router.get("/{project_id}/run/", response_model=list[RunRead])
def read_all_runs(project_id: int, user: user_dependency, session: db_dependency):
    pass


@run_router.put("/{project_id}/run/{run_id}/update/", response_model=RunRead)
def update_run(project_id: int, run_id: int, run_update: RunUpdate, user: user_dependency, session: db_dependency):
    pass


@run_router.delete("/{project_id}/run/{run_id}/delete/", response_model=DefaultBase)
def delete_run(project_id: int, run_id: int, user: user_dependency, session: db_dependency):
    pass