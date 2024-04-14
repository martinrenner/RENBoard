from fastapi import HTTPException
from sqlmodel import Session, and_, select
from helpers import update_object_attributes
from database import commit_and_handle_exception, refresh_and_handle_exception
from models import Member, Run
from schemas.run import RunCreate, RunUpdate


class RunService:
    def insert_run_db(self, project_id: int, run_create: RunCreate, user_id: int, session: Session):
        self._check_permission(project_id, user_id, session)
        self._check_dates(run_create.date_started, run_create.date_finished)
        run = Run(
            name=run_create.name,
            description=run_create.description,
            date_started=run_create.date_started,
            date_finished=run_create.date_finished if run_create.date_finished else None,
            project_id=project_id
        )
        session.add(run)
        session.commit()
        return run

    def select_run_by_id_db(self, project_id: int, run_id: int, user_id: int, session: Session):
        self._check_permission(project_id, user_id, session)
        run = self._select_run_by_id(project_id, run_id, session)
        self._check_run(run)
        return run
    
    def select_all_runs_db(self, project_id: int, user_id: int, session: Session):
        self._check_permission(project_id, user_id, session)
        statement = select(Run).where(Run.project_id == project_id)
        runs = session.exec(statement).all()
        return runs
    
    def update_run_db(self, project_id: int, run_id: int, run_update: RunUpdate, user_id: int, session: Session):
        self._check_permission(project_id, user_id, session)
        run = self._select_run_by_id(project_id, run_id, session)
        update_object_attributes(run, list(Run.model_json_schema()["properties"].keys()), run_update)
        self._check_dates(run.date_started, run.date_finished)
        commit_and_handle_exception(session)
        refresh_and_handle_exception(session, run)
        return run
    
    def delete_run_db(self, project_id: int, run_id: int, user_id: int, session: Session):
        self._check_permission(project_id, user_id, session)
        run = self._select_run_by_id(project_id, run_id, session)
        self._check_run(run)
        session.delete(run)
        commit_and_handle_exception(session)

    def _select_run_by_id(self, project_id: int, run_id: int, session: Session):
        statement = select(Run).where(and_(Run.id == run_id, Run.project_id == project_id))
        return session.exec(statement).first()

    def _check_run(self, run):
        if not run:
            raise HTTPException(status_code=404, detail="Run not found")

    def _check_dates(self, date_started, date_finished):
        if date_started and date_finished and date_started > date_finished:
            raise HTTPException(status_code=400, detail="Date finished must be after date started")

    def _check_permission(self, project_id: int, user_id: int, session: Session):
        statement = select(Member).where(and_(Member.project_id == project_id, Member.user_id == user_id, Member.accepted))
        member = session.exec(statement).first()

        if not member:
            raise HTTPException(status_code=403, detail="Forbidden - Not Member")