from fastapi import HTTPException
from sqlmodel import Session, and_, select
from services.task_service import TaskService
from services.status_service import StatusService
from helpers import update_object_attributes
from database import commit_and_handle_exception, refresh_and_handle_exception
from models import Member, Sprint
from schemas.sprint import SprintCreate, SprintUpdate

status_service = StatusService()
task_service = TaskService()

class SprintService:
    def insert_sprint_db(self, project_id: int, sprint_create: SprintCreate, user_id: int, session: Session):
        self._check_permission(project_id, user_id, session)
        self._check_dates(sprint_create.date_started, sprint_create.date_finished)
        sprint = Sprint(
            name=sprint_create.name,
            description=sprint_create.description,
            date_started=sprint_create.date_started,
            date_finished=sprint_create.date_finished,
            project_id=project_id
        )
        session.add(sprint)
        session.flush()

        for status in sprint_create.statuses:
            status_service.insert_status_db(sprint.id, status, user_id, session)
        session.flush()

        if len(sprint_create.task_ids) > 0:
            for task_id in sprint_create.task_ids:
                task_service.assign_task_to_sprint(task_id, sprint.statuses[0].id, session)

        commit_and_handle_exception(session)
        return sprint
    
    def assign_task_to_sprint_db(self, task_id: int, sprint_id: int, user_id: int, session: Session):
        sprint = self._select_sprint_by_id(sprint_id, session)
        self._check_sprint(sprint)
        self._check_permission(sprint.project_id, user_id, session)
        task = task_service.assign_task_to_sprint(task_id, sprint.statuses[0].id, session)
        commit_and_handle_exception(session)
        return task

    def select_sprint_by_id_db(self, sprint_id: int, user_id: int, session: Session):
        sprint = self._select_sprint_by_id(sprint_id, session)
        self._check_sprint(sprint)
        self._check_permission(sprint.project_id, user_id, session)
        return sprint
    
    def select_all_sprints_db(self, project_id: int, user_id: int, session: Session):
        self._check_permission(project_id, user_id, session)
        statement = select(Sprint).where(Sprint.project_id == project_id)
        sprints = session.exec(statement).all()
        return sprints
    
    def update_sprint_db(self, sprint_id: int, sprint_update: SprintUpdate, user_id: int, session: Session):
        sprint = self._select_sprint_by_id(sprint_id, session)
        self._check_sprint(sprint)
        self._check_permission(sprint.project_id, user_id, session)        
        update_object_attributes(sprint, list(Sprint.model_json_schema()["properties"].keys()), sprint_update)
        self._check_dates(sprint.date_started, sprint.date_finished)
        commit_and_handle_exception(session)
        refresh_and_handle_exception(session, sprint)
        return sprint
    
    def delete_sprint_db(self, sprint_id: int, user_id: int, session: Session):
        sprint = self._select_sprint_by_id(sprint_id, session)
        self._check_sprint(sprint)
        self._check_permission(sprint.project_id, user_id, session)
        session.delete(sprint)
        commit_and_handle_exception(session)

    def _select_sprint_by_id(self, sprint_id: int, session: Session):
        statement = select(Sprint).where(Sprint.id == sprint_id)
        return session.exec(statement).first()

    def _check_sprint(self, sprint):
        if not sprint:
            raise HTTPException(status_code=404, detail="Sprint not found")

    def _check_dates(self, date_started, date_finished):
        if date_started and date_finished and date_started > date_finished:
            raise HTTPException(status_code=400, detail="Date finished must be after date started")

    def _check_permission(self, project_id: int, user_id: int, session: Session):
        statement = select(Member).where(and_(Member.project_id == project_id, Member.user_id == user_id, Member.accepted))
        member = session.exec(statement).first()

        if not member:
            raise HTTPException(status_code=403, detail="Forbidden - Not Member")