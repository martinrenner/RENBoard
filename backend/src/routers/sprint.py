from typing import Annotated
from fastapi import APIRouter, Depends
from sqlmodel import Session
from services.sprint_service import SprintService
from schemas.default import DefaultBase
from schemas.sprint import SprintCreate, SprintRead, SprintUpdate
from tokens.access_token import AccessToken
from database import get_session


sprint_router = APIRouter(prefix="/sprint", tags=["Sprint"])

db_dependency = Annotated[Session, Depends(get_session)]
user_dependency = Annotated[dict, Depends(AccessToken.verify_token)]

sprint_service = SprintService()


@sprint_router.post("/", response_model=SprintRead)
def create_sprint(project_id: int, sprint_create: SprintCreate, user: user_dependency, session: db_dependency):
    """
    ## Create a new sprint

    Create a new sprint for a project.

    - **project_id (int)**: The ID of the project.
    - **sprint_create (SprintCreate)**: The data for creating the sprint.

    Returns:
    - `SprintRead`: The created sprint.
    """
    sprint = sprint_service.insert_sprint_db(project_id, sprint_create, user.id, session)
    return SprintRead.from_sprint(sprint)

@sprint_router.get("/{sprint_id}/", response_model=SprintRead)
def read_sprint(sprint_id: int, user: user_dependency, session: db_dependency):
    """
    ## Read a sprint

    Retrieve information about a specific sprint.

    - **sprint_id (int)**: The ID of the sprint.

    Returns:
    - `SprintRead`: The details of the sprint.
    """
    sprint = sprint_service.select_sprint_by_id_db(sprint_id, user.id, session)
    return SprintRead.from_sprint(sprint)

@sprint_router.patch("/{sprint_id}/update/", response_model=SprintRead)
def update_sprint(sprint_id: int, sprint_update: SprintUpdate, user: user_dependency, session: db_dependency):
    """
    ## Update a sprint

    Update a sprint in the database.

    - **sprint_id (int)**: The ID of the sprint.
    - **sprint_update (SprintUpdate)**: The updated sprint data.

    Returns:
    - `SprintRead`: The updated sprint data.
    """
    sprint = sprint_service.update_sprint_db(sprint_id, sprint_update, user.id, session)
    return SprintRead.from_sprint(sprint)

@sprint_router.delete("/{sprint_id}/delete/", response_model=DefaultBase)
def delete_sprint(sprint_id: int, user: user_dependency, session: db_dependency):
    """
    ## Delete a sprint
    
    Delete a sprint from the specified project.

    - **project_id (int)**: The ID of the project.
    - **sprint_id (int)**: The ID of the sprint to be deleted.

    Returns:
    - `DefaultBase`: The response indicating the success of the deletion.
    """
    sprint_service.delete_sprint_db(sprint_id, user.id, session)
    return DefaultBase.from_default(message="Sprint deleted successfully.")