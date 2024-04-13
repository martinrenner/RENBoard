from datetime import datetime
from fastapi import HTTPException
from services.user_service import UserService
from models import Member, Project
from sqlmodel import Session, and_, select
from schemas.project import ProjectCreate, ProjectUpdate
from database import commit_and_handle_exception, flush_and_handle_exception, refresh_and_handle_exception
from helpers import update_object_attributes


user_service = UserService()


class ProjectService:
    def select_all_projects_db(self, user_id: int, session: Session):
        statement = select(Project).where(Project.user_id == user_id)
        projects = session.exec(statement).all()
        return projects
    
    def select_all_projects_member_db(self, user_id: int, session: Session):
        statement = select(Member).where(and_(Member.user_id == user_id, Member.accepted.is_(True)))
        members = session.exec(statement).all()
        return [member.project for member in members]

    def select_project_by_id_db(self, project_id: int, user_id: int, session: Session):
        project = self._get_project_by_id(project_id, session)
        self._check_project_access(project, user_id)
        return project

    def insert_project_db(self, project_create: ProjectCreate, user_id: int, session: Session):
        new_project = Project(
            name=project_create.name.strip(), 
            description=project_create.description.strip(), 
            user_id=user_id
        )
        if project_create.customer is not None:
            new_project.customer = project_create.customer.strip()
        session.add(new_project)
        flush_and_handle_exception(session)

        new_member = Member(
            user_id=user_id, project_id=new_project.id, accepted=True, date_started=datetime.utcnow()
        )
        
        session.add(new_member)

        commit_and_handle_exception(session)
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
    
    def add_member_to_project_db(self, project_id: int, member: str, user_id: int, session: Session):
        project = self._get_project_by_id(project_id, session)
        self._check_project_access(project, user_id)
        user = user_service.select_user_by_email_or_username_db(member, session)

        statement = select(Member).where(Member.user_id == user.id, Member.project_id == project_id)
        member = session.exec(statement).first()

        if member is not None:
            raise HTTPException(status_code=400, detail="User is already a member or has invite to this project")

        new_member = Member(
            user_id=user.id, project_id=project_id, accepted=False
        )
        session.add(new_member)
        commit_and_handle_exception(session)

    def remove_member_from_project_db(self, project_id: int, member: str, user_id: int, session: Session):
        project = self._get_project_by_id(project_id, session)
        self._check_project_access(project, user_id)
        user = user_service.select_user_by_email_or_username_db(member, session)

        statement = select(Member).where(Member.user_id == user.id, Member.project_id == project_id)
        member = session.exec(statement).first()
        
        if member is None:
            raise HTTPException(status_code=404, detail="User is not member of this project")
        
        session.delete(member)
        commit_and_handle_exception(session)

    def get_project_members_db(self, project_id: int, user_id: int, session: Session):
        project = self._get_project_by_id(project_id, session)
        self._check_project_access(project, user_id)
        return [member.user for member in project.teams]

    def decision_member_db(self, project_id: int, decision: bool, user_id: int, session: Session):
        print(user_id)
        self._get_project_by_id(project_id, session)
        statement = select(Member).where(and_(Member.user_id == user_id, Member.project_id == project_id, Member.accepted.is_(False)))
        member = session.exec(statement).first()
        
        if member is None:
            raise HTTPException(status_code=404, detail="User has no active invite to this project")
        
        if decision:
            member.accepted = True
            member.date_started = datetime.utcnow()
        else:
            session.delete(member)
        commit_and_handle_exception(session)

    def leave_project_db(self, project_id: int, user_id: int, session: Session):
        self._get_project_by_id(project_id, session)
        statement = select(Member).where(and_(Member.user_id == user_id, Member.project_id == project_id, Member.accepted.is_(True)))
        member = session.exec(statement).first()
        
        if member is None:
            raise HTTPException(status_code=404, detail="User is not member of this project")
        
        session.delete(member)
        commit_and_handle_exception(session)

    def _get_project_by_id(self, project_id: int, session: Session):
        project = session.get(Project, project_id)
        if project is None:
            raise HTTPException(status_code=404, detail="Project not found")
        return project

    def _check_project_access(self, project: Project, user_id: int):
        if project.user_id != user_id:
            raise HTTPException(status_code=403, detail="Forbidden")
