from typing import Annotated
from fastapi import APIRouter, Depends
from sqlmodel import Session
from services.task_service import TaskService
from schemas.default import DefaultBase
from schemas.task import TaskCreate, TaskRead, TaskUpdate
from tokens.access_token import AccessToken
from database import get_session


task_router = APIRouter(prefix="/task", tags=["Task"])

db_dependency = Annotated[Session, Depends(get_session)]
user_dependency = Annotated[dict, Depends(AccessToken.verify_token)]

task_service = TaskService()


@task_router.post("/", response_model=TaskRead)
def create_task(project_id: int, task_create: TaskCreate, user: user_dependency, session: db_dependency):
    """
    ## Create a new task

    Create a new task for a specific project and sprint.

    - **project_id (int)**: The ID of the project.
    - **task_create (TaskCreate)**: The data for creating the task.

    Returns:
    - `TaskRead`: The created task.
    """
    task = task_service.insert_task_db(project_id, task_create, user.id, session)
    return TaskRead.from_task(task)

@task_router.get("/{task_id}", response_model=TaskRead)
def read_task(task_id: int, user: user_dependency, session: db_dependency):
    """
    ## Read a task

    Retrieve a task by its project ID, sprint ID, and task ID.

    - **task_id (int)**: The ID of the task.

    Returns:
    - `TaskRead`: The task read model.
    """
    task = task_service.select_task_by_id_db(task_id, user.id, session)
    return TaskRead.from_task(task)

@task_router.get("/", response_model=list[TaskRead])
def read_all_task(project_id: int, user: user_dependency, session: db_dependency):
    """
    ## Read all tasks

    Retrieve all tasks for a specific project and sprint.

    - **project_id (int)**: The ID of the project.

    Returns:
    - `list[TaskRead]`: A list of TaskRead objects representing the tasks.
    """
    tasks = task_service.select_all_tasks_db(project_id, user.id, session)
    return [TaskRead.from_task(task) for task in tasks]

@task_router.post("/{task_id}/assign")
def assign_task_to_status(task_id: int, status_id: int, user: user_dependency, session: db_dependency):
    """
    ## Assign a task to a sprint

    Assign a task to a sprint by updating the task's sprint ID

    - **task_id (int)**: The ID of the task.
    - **sprint_id (int)**: The ID of the sprint to assign the task to.
    """
    task = task_service.assign_task_to_sprint_db(task_id, status_id, user.id, session)
    return TaskRead.from_task(task)
    

@task_router.patch("/{task_id}/update", response_model=TaskRead)
def update_task(task_id: int, task_update: TaskUpdate, user: user_dependency, session: db_dependency):
    """
    ## Update a task

    Update a task in the database.

    - **task_id (int)**: The ID of the task.
    - **task_update (TaskUpdate)**: The updated task data.

    Returns:
    - `TaskRead`: The updated task.
    """
    task = task_service.update_task_db(task_id, task_update, user.id, session)
    return TaskRead.from_task(task)

@task_router.delete("/{task_id}/delete", response_model=DefaultBase)
def delete_task(task_id: int, user: user_dependency, session: db_dependency):
    """
    ## Delete a task

    Delete a task from the specified project, sprint, and task ID.

    - **task_id (int)**: The ID of the task.

    Returns:
    - `DefaultBase`: The response indicating the task was deleted successfully.
    """
    task_service.delete_task_db(task_id, user.id, session)
    return DefaultBase.from_default("Task deleted successfully.")