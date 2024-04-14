from typing import Annotated
from fastapi import APIRouter, Depends
from sqlmodel import Session
from services.task_service import TaskService
from schemas.default import DefaultBase
from schemas.task import TaskCreate, TaskRead, TaskUpdate
from tokens.access_token import AccessToken
from database import get_session


task_router = APIRouter(prefix="/project", tags=["Task"])

db_dependency = Annotated[Session, Depends(get_session)]
user_dependency = Annotated[dict, Depends(AccessToken.verify_token)]

task_service = TaskService()


@task_router.post("/{project_id}/run/{run_id}/task/", response_model=TaskRead)
def create_task(task_create: TaskCreate, user: user_dependency, session: db_dependency):
    pass

@task_router.get("/{project_id}/run/{run_id}/task/{task_id}", response_model=TaskRead)
def read_task(project_id: int, run_id: int, task_id: int, user: user_dependency, session: db_dependency):
    pass


@task_router.get("/{project_id}/run/{run_id}/task/", response_model=list[TaskRead])
def read_all_task(project_id: int, run_id: int, user: user_dependency, session: db_dependency):
    pass


@task_router.put("/{project_id}/run/{run_id}/task/{task_id}/update", response_model=TaskRead)
def update_task(project_id: int, run_id: int, task_id: int, task_update: TaskUpdate, user: user_dependency, session: db_dependency):
    pass


@task_router.delete("/{project_id}/run/{run_id}/task/{task_id}/delete", response_model=DefaultBase)
def delete_task(project_id: int, run_id: int, task_id: int, user: user_dependency, session: db_dependency):
    pass