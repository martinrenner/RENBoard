from typing import Annotated
from fastapi import APIRouter, Depends
from schemas.default import DefaultBase
from tokens.access_token import AccessToken
from services.project_service import ProjectService
from schemas.project import ProjectRead, ProjectCreate, ProjectReadChart, ProjectUpdate
from database import get_session
from sqlmodel import Session

project_router = APIRouter(prefix="/project", tags=["Project"])

db_dependency = Annotated[Session, Depends(get_session)]
user_dependency = Annotated[dict, Depends(AccessToken.verify_token)]

project_service = ProjectService()


@project_router.post("/", response_model=ProjectRead)
def create_project(project_create: ProjectCreate, user: user_dependency, session: db_dependency):
    """
    ## Create a new project

    This endpoint will create a new project in the database.

    - **project_create**: Project object

    Returns:
    - `project`: Project object
    """
    new_project = project_service.insert_project_db(project_create, user.id, session)
    return ProjectRead.from_project(new_project)


@project_router.get("/{project_id}", response_model=ProjectRead)
def read_project(project_id: int, user: user_dependency, session: db_dependency):
    """
    ## Retrieve a project from the database

    This endpoint will return a project based on the ID passed on provided project_id.

    - **project_id**: ID of the project to retrieve

    Returns:
    - `project`: Project object
    """
    project = project_service.select_project_by_id_db(project_id, user.id, session)
    return ProjectRead.from_project(project)


@project_router.get("/", response_model=list[ProjectRead])
def read_all_projects(user: user_dependency, session: db_dependency):
    """
    ## Retrieve all projects from the database

    This endpoint will return all projects in the database.

    Returns:
    - `projects`: List of project objects
    """
    projects = project_service.select_all_projects_db(user.id, session)
    return [ProjectRead.from_project(project) for project in projects]


@project_router.patch("/{project_id}/update", response_model=ProjectRead)
def update_project(project_id: int, project_update: ProjectUpdate, user: user_dependency, session: db_dependency):
    """
    ## Update a project

    This endpoint will update a project in the database.

    - **project_id**: ID of the project to update
    - **project_update**: Project object

    Returns:
    - `project`: Project object
    """
    updated_project = project_service.update_project_by_id_db(project_id, project_update, user.id, session)
    return ProjectRead.from_project(updated_project)


@project_router.get("/{project_id}/chart/", response_model=ProjectReadChart)
def read_project_chart(project_id: int, user: user_dependency, session: db_dependency):
    """
    ## Retrieve a project chart

    This endpoint will return a project sprints chart based on project_id.

    - **project_id**: ID of the project to retrieve

    Returns:
    - `project`: Project chart object
    """
    project = project_service.select_project_by_id_db(project_id, user.id, session)
    return ProjectReadChart.from_project(project)


@project_router.delete("/{project_id}/delete", response_model=DefaultBase)
def delete_project(project_id: int, user: user_dependency, session: db_dependency):
    """
    ## Delete a project

    This endpoint will delete a project from the database.

    - **project_id**: ID of the project to delete

    Returns:
    - `message`: Message indicating that the project was deleted
    """
    project_service.delete_project_by_id_db(project_id, user.id, session)
    return DefaultBase.from_default("Project deleted")