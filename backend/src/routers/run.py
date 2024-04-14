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
    """
    ## Create a new run

    Create a new run for a project.

    - **project_id (int)**: The ID of the project.
    - **run_create (RunCreate)**: The data for creating the run.

    Returns:
    - `RunRead`: The created run.
    """
    run = run_service.insert_run_db(project_id, run_create, user.id, session)
    return RunRead.from_run(run)

@run_router.get("/{project_id}/run/{run_id}/", response_model=RunRead)
def read_run(project_id: int, run_id: int, user: user_dependency, session: db_dependency):
    """
    ## Read a run

    Retrieve information about a specific run.

    - **project_id (int)**: The ID of the project.
    - **run_id (int)**: The ID of the run.

    Returns:
    - `RunRead`: The details of the run.
    """
    run = run_service.select_run_by_id_db(project_id, run_id, user.id, session)
    return RunRead.from_run(run)

@run_router.get("/{project_id}/run/", response_model=list[RunRead])
def read_all_runs(project_id: int, user: user_dependency, session: db_dependency):
    """
    ## Read all runs
    
    Retrieve all runs for a specific project.

    - **project_id (int)**: The ID of the project.

    Returns:
    - `list[RunRead]`: A list of RunRead objects representing the runs.
    """
    runs = run_service.select_all_runs_db(project_id, user.id, session)
    return [RunRead.from_run(run) for run in runs]

@run_router.patch("/{project_id}/run/{run_id}/update/", response_model=RunRead)
def update_run(project_id: int, run_id: int, run_update: RunUpdate, user: user_dependency, session: db_dependency):
    """
    ## Update a run

    Update a run in the database.

    - **project_id (int)**: The ID of the project.
    - **run_id (int)**: The ID of the run.
    - **run_update (RunUpdate)**: The updated run data.

    Returns:
    - `RunRead`: The updated run data.
    """
    run = run_service.update_run_db(project_id, run_id, run_update, user.id, session)
    return RunRead.from_run(run)

@run_router.delete("/{project_id}/run/{run_id}/delete/", response_model=DefaultBase)
def delete_run(project_id: int, run_id: int, user: user_dependency, session: db_dependency):
    """
    ## Delete a run
    
    Delete a run from the specified project.

    - **project_id (int)**: The ID of the project.
    - **run_id (int)**: The ID of the run to be deleted.

    Returns:
    - `DefaultBase`: The response indicating the success of the deletion.
    """
    run_service.delete_run_db(project_id, run_id, user.id, session)
    return DefaultBase.from_default(message="Run deleted successfully.")