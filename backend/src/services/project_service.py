from fastapi import HTTPException
from models import Project
from sqlmodel import Session, select
from schemas.project import ProjectCreate, ProjectUpdate
from database import commit_and_handle_exception, refresh_and_handle_exception
from helpers import update_object_attributes


class ProjectService:
    def select_all_projects_db(self, user_id: int, session: Session):
        statement = select(Project).where(Project.user_id == user_id)
        projects = session.exec(statement).all()
        return projects

    def select_project_by_id_db(self, project_id: int, user_id: int, session: Session):
        project = self._get_project_by_id(project_id, session)
        self._check_project_access(project, user_id)
        return project

    def insert_project_db(self, project_create: ProjectCreate, user_id: int, session: Session):
        new_project = Project(
            name=project_create.name.strip(), description=project_create.description.strip(), customer=project_create.customer.strip(), user_id=user_id
        )
        session.add(new_project)
        commit_and_handle_exception(session)
        refresh_and_handle_exception(session, new_project)
        return new_project

    def delete_project_by_id_db(self, project_id: int, user_id: int, session: Session):
        project = self._get_project_by_id(project_id, session)
        self._check_project_access(project, user_id)
        session.delete(project)
        commit_and_handle_exception(session)

    def update_project_by_id_db(self, project_id: int, project_update: ProjectUpdate, user_id: int, session: Session):
        project = self._get_project_by_id(project_id, session)
        self._check_project_access(project, user_id)
        update_object_attributes(project, list(Project.model_json_schema()["properties"].keys()), project_update)
        commit_and_handle_exception(session)
        refresh_and_handle_exception(session, project)
        return project

    def _get_project_by_id(self, project_id: int, session: Session):
        project = session.get(Project, project_id)
        if project is None:
            raise HTTPException(status_code=404, detail="Project not found")
        return project

    def _check_project_access(self, project: Project, user_id: int):
        if project.user_id != user_id:
            raise HTTPException(status_code=403, detail="Forbidden")
