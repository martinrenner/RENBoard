from typing import Annotated
from fastapi import APIRouter, Depends
from schemas.project import ProjectRead
from schemas.user import UserRead
from schemas.default import DefaultBase
from tokens.access_token import AccessToken
from services.project_service import ProjectService
from database import get_session
from sqlmodel import Session

project_management_router = APIRouter(prefix="/project-management", tags=["Project Management"])

db_dependency = Annotated[Session, Depends(get_session)]
user_dependency = Annotated[dict, Depends(AccessToken.verify_token)]

project_service = ProjectService()


@project_management_router.post("/{project_id}/add-member", response_model=DefaultBase)
def add_member_to_project(project_id: int, member: str, user: user_dependency, session: db_dependency):
    """
    Add a member to a project. (**project owner endpoint only!!!**)

    - **project_id (int)**: The ID of the project.
    - **member (str)**: The username of the member to be added.

    Returns:
    - `message`: A message indicating the success of the operation.
    """
    project_service.add_member_to_project_db(project_id, member, user.id, session)
    return DefaultBase.from_default("User successfully added to the project.")

@project_management_router.post("/{project_id}/remove-member", response_model=DefaultBase)
def remove_member_from_project(project_id: int, member: str, user: user_dependency, session: db_dependency):
    """
    Remove a member from a project. (**project owner endpoint only!!!**)

    - **project_id (int)**: The ID of the project.
    - **member (str)**: The username of the member to be removed.

    Returns:
    - `message`: A message indicating the success of the operation.
    """
    project_service.remove_member_from_project_db(project_id, member, user.id, session)
    return DefaultBase.from_default(message="User successfully removed from the project.")

@project_management_router.get("/{project_id}/members", response_model=list[UserRead])
def get_project_members(project_id: int, user: user_dependency, session: db_dependency):
    """
    Retrieve all members of a project.

    - **project_id (int)**: The ID of the project.

    Returns:
    - `members`: A list of User objects.
    """
    members = project_service.get_project_members_db(project_id, user.id, session)
    return [UserRead.from_user(member) for member in members]


@project_management_router.post("/{project_id}/decision", response_model=DefaultBase)
def decision_member(project_id: int, decision: bool, user: user_dependency, session: db_dependency):
    """
    Endpoint for making a decision on a project membership request.

    - **project_id (int)**: The ID of the project.
    - **decision (bool)**: The decision on the membership request (True for acceptance, False for decline).

    Returns:
    - `message`: A message indicating the success of the operation.
    """
    project_service.decision_member_db(project_id, decision, user.id, session)
    if decision:
        return DefaultBase.from_default(message="User successfully accepted to the project.")
    return DefaultBase.from_default(message="User successfully declined from the project.")

@project_management_router.post("/{project_id}/leave", response_model=DefaultBase)
def leave_project(project_id: int, user: user_dependency, session: db_dependency):
    """
    Endpoint for a user to leave a project.

    - **project_id (int)**: The ID of the project to leave.

    Returns:
    - `message`: A message indicating the success of the operation.
    """
    project_service.leave_project_db(project_id, user.id, session)
    DefaultBase.from_default(message="User successfully left the project.")

@project_management_router.get("/", response_model=list[ProjectRead])
def read_all_current_projects(user: user_dependency, session: db_dependency):
    """
    Retrieve all projects that the user is a member of.

    Returns:
    - `projects`: A list of Project objects.
    """
    projects = project_service.select_all_projects_member_db(user.id, session)
    return [ProjectRead.from_project(project) for project in projects]