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
def create_task(project_id: int, run_id: int, task_create: TaskCreate, user: user_dependency, session: db_dependency):
    """
    ## Create a new task

    Create a new task for a specific project and run.

    - **project_id (int)**: The ID of the project.
    - **run_id (int)**: The ID of the run.
    - **task_create (TaskCreate)**: The data for creating the task.

    Returns:
    - `TaskRead`: The created task.
    """
    task = task_service.insert_task_db(project_id, run_id, task_create, user.id, session)
    return TaskRead.from_task(task)

@task_router.get("/{project_id}/run/{run_id}/task/{task_id}", response_model=TaskRead)
def read_task(project_id: int, run_id: int, task_id: int, user: user_dependency, session: db_dependency):
    """
    ## Read a task

    Retrieve a task by its project ID, run ID, and task ID.

    - **project_id (int)**: The ID of the project.
    - **run_id (int)**: The ID of the run.
    - **task_id (int)**: The ID of the task.

    Returns:
    - `TaskRead`: The task read model.
    """
    task = task_service.select_task_by_id_db(project_id, run_id, task_id, user.id, session)
    return TaskRead.from_task(task)

@task_router.get("/{project_id}/run/{run_id}/task/", response_model=list[TaskRead])
def read_all_task(project_id: int, run_id: int, user: user_dependency, session: db_dependency):
    """
    ## Read all tasks

    Retrieve all tasks for a specific project and run.

    - **project_id (int)**: The ID of the project.
    - **run_id (int)**: The ID of the run.

    Returns:
    - `list[TaskRead]`: A list of TaskRead objects representing the tasks.
    """
    tasks = task_service.select_all_tasks_db(project_id, run_id, user.id, session)
    return [TaskRead.from_task(task) for task in tasks]

@task_router.patch("/{project_id}/run/{run_id}/task/{task_id}/update", response_model=TaskRead)
def update_task(project_id: int, run_id: int, task_id: int, task_update: TaskUpdate, user: user_dependency, session: db_dependency):
    """
    ## Update a task

    Update a task in the database.

    - **project_id (int)**: The ID of the project.
    - **run_id (int)**: The ID of the run.
    - **task_id (int)**: The ID of the task.
    - **task_update (TaskUpdate)**: The updated task data.

    Returns:
    - `TaskRead`: The updated task.
    """
    task = task_service.update_task_db(project_id, run_id, task_id, task_update, user.id, session)
    return TaskRead.from_task(task)

@task_router.delete("/{project_id}/run/{run_id}/task/{task_id}/delete", response_model=DefaultBase)
def delete_task(project_id: int, run_id: int, task_id: int, user: user_dependency, session: db_dependency):
    """
    ## Delete a task

    Delete a task from the specified project, run, and task ID.

    - **project_id (int)**: The ID of the project.
    - **run_id (int)**: The ID of the run.
    - **task_id (int)**: The ID of the task.

    Returns:
    - `DefaultBase`: The response indicating the task was deleted successfully.
    """
    task_service.delete_task_db(project_id, run_id, task_id, user.id, session)
    return DefaultBase.from_default("Task deleted successfully.")