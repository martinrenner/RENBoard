from fastapi import HTTPException
from sqlmodel import Session, and_, select
from helpers import update_object_attributes
from database import commit_and_handle_exception, refresh_and_handle_exception
from models import Member, Run, Status
from schemas.status import StatusCreate, StatusUpdate


class StatusService:
    def insert_status_db(self, project_id: int, run_id: int, status_create: StatusCreate, user_id: int, session: Session):
        self._check_permission(project_id, run_id, user_id, session)

        run = session.get(Run, run_id)
        if len(run.tasks) > 0:
            raise HTTPException(status_code=400, detail="Cannot create new status for run with tasks.")

        status = Status(
            name=status_create.name,
            run_id=run_id
        )
        session.add(status)
        commit_and_handle_exception(session)
        return status
    
    def select_status_by_id_db(self, project_id: int, run_id: int, status_id: int, user_id: int, session: Session):
        self._check_permission(project_id, run_id, user_id, session)
        statement = select(Status).where(Status.id == status_id, Status.run_id == run_id)
        status = session.exec(statement).first()
        self._check_status(status)
        return status
    
    def select_all_status_db(self, project_id: int, run_id: int, user_id: int, session: Session):
        self._check_permission(project_id, run_id, user_id, session)
        statement = select(Status).where(Status.run_id == run_id)
        statuses = session.exec(statement).all()
        return statuses
    
    def update_status_db(self, project_id: int, run_id: int, status_id: int, status_update: StatusUpdate, user_id: int, session: Session):
        self._check_permission(project_id, run_id, user_id, session)
        status = self.select_status_by_id_db(project_id, run_id, status_id, user_id, session)
        self._check_status(status)
        update_object_attributes(status, list(Status.model_json_schema()["properties"].keys()), status_update)
        commit_and_handle_exception(session)
        refresh_and_handle_exception(session, status)
        return status
    
    def delete_status_db(self, project_id: int, run_id: int, status_id: int, user_id: int, session: Session):
        self._check_permission(project_id, run_id, user_id, session)
        statement = select(Status).where(Status.id == status_id)
        status = session.exec(statement).first()
        self._check_status(status)
        session.delete(status)
        commit_and_handle_exception(session)

    def _check_permission(self, project_id: int, run_id: int, user_id: int, session: Session):
        statement = select(Member).where(and_(Member.project_id == project_id, Member.user_id == user_id, Member.accepted))
        member = session.exec(statement).first()
        if not member:
            raise HTTPException(status_code=403, detail="Forbidden - Not Member")
        
        statement = select(Run).where(and_(Run.id == run_id, Run.project_id == project_id))
        run = session.exec(statement).first()
        if not run:
            raise HTTPException(status_code=404, detail="Project with this run not found")
        
    def _check_status(self, status):
        if not status:
            raise HTTPException(status_code=404, detail="Status not found")