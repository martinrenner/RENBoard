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
def create_status(project_id: int, run_id: int, status_create: StatusCreate, user: user_dependency, session: db_dependency):
    """
    ## Create a new status

    Create a new status for a specific project and run.

    - **project_id (int)**: The ID of the project.
    - **run_id (int)**: The ID of the run.
    - **status_create (StatusCreate)**: The status data to be created.

    Returns:
    - `StatusRead`: The created status.
    """
    status = status_service.insert_status_db(project_id, run_id, status_create, user.id, session)
    return StatusRead.from_status(status)

@status_router.get("/{project_id}/run/{run_id}/status/{status_id}", response_model=StatusRead)
def read_status(project_id: int, run_id: int, status_id: int, user: user_dependency, session: db_dependency):
    """
    ## Read a status

    Retrieve the status information for a specific status ID.

    - **project_id (int)**: The ID of the project.
    - **run_id (int)**: The ID of the run.
    - **status_id (int)**: The ID of the status.

    Returns:
    - `StatusRead`: The status information for the specified status ID.
    """
    status = status_service.select_status_by_id_db(project_id, run_id, status_id, user.id, session)
    return StatusRead.from_status(status)

@status_router.get("/{project_id}/run/{run_id}/status/", response_model=list[StatusRead])
def read_all_status(project_id: int, run_id: int, user: user_dependency, session: db_dependency):
    """
    ## Read all statuses

    Retrieve all status entries for a specific project and run.

    - **project_id (int)**: The ID of the project.
    - **run_id (int)**: The ID of the run.

    Returns:
    - `list[StatusRead]`: A list of status entries.
    """
    statuses = status_service.select_all_status_db(project_id, run_id, user.id, session)
    return [StatusRead.from_status(status) for status in statuses]

@status_router.patch("/{project_id}/run/{run_id}/status/{status_id}/update", response_model=StatusRead)
def update_status(project_id: int, run_id: int, status_id: int, status_update: StatusUpdate, user: user_dependency, session: db_dependency):
    """
    ## Update a status

    Update the status of a project run.

    - **project_id (int)**: The ID of the project.
    - **run_id (int)**: The ID of the run.
    - **status_id (int)**: The ID of the status.
    - **status_update (StatusUpdate)**: The updated status information.

    Returns:
    - `StatusRead`: The updated status information.

    """
    status = status_service.update_status_db(project_id, run_id, status_id, status_update, user.id, session)
    return StatusRead.from_status(status)

@status_router.delete("/{project_id}/run/{run_id}/status/{status_id}/delete", response_model=DefaultBase)
def delete_status(project_id: int, run_id: int, status_id: int, user: user_dependency, session: db_dependency):
    """
    ## Delete a status
    
    Delete a status from the specified project, run, and status ID.

    - **project_id (int)**: The ID of the project.
    - **run_id (int)**: The ID of the run.
    - **status_id (int)**: The ID of the status.

    Returns:
    - `DefaultBase`: The response model indicating the status has been deleted.
    """
    status_service.delete_status_db(project_id, run_id, status_id, user.id, session)
    return DefaultBase.from_default("Status deleted")