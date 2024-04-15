from datetime import datetime
from fastapi import HTTPException
from sqlmodel import Session, and_, select
from helpers import update_object_attributes
from database import commit_and_handle_exception, refresh_and_handle_exception
from models import Member, Priority, Run, Status, Task
from schemas.task import TaskCreate, TaskUpdate


class TaskService:
    def insert_task_db(self, project_id: int, run_id: int, task_create: TaskCreate, user_id: int, session: Session):
        self._check_permission(project_id, run_id, user_id, session)
        self._check_status(project_id, run_id, task_create.status_id, session)
        self._check_priority(task_create.priority_id, session)
        self._check_run(run_id, session)
        task = Task(
            name=task_create.name,
            description=task_create.description,
            date_created=datetime.today().date(),
            run_id=run_id,
            status_id=task_create.status_id,
            priority_id=task_create.priority_id
        )

        run = session.get(Run, run_id)
        if task.status_id == run.statuses[-1].id:
            task.date_finished = datetime.today()
            
        session.add(task)
        commit_and_handle_exception(session)
        return task
    
    def select_task_by_id_db(self, project_id: int, run_id: int, task_id: int, user_id: int, session: Session):
        self._check_permission(project_id, run_id, user_id, session)
        task = self._select_task_by_id(project_id, run_id, task_id, session)
        self._check_task(task)
        return task
    
    def select_all_tasks_db(self, project_id: int, run_id: int, user_id: int, session: Session):
        self._check_permission(project_id, run_id, user_id, session)
        statement = select(Task).where(Task.run_id == run_id)
        tasks = session.exec(statement).all()
        return tasks

    def update_task_db(self, project_id: int, run_id: int, task_id: int, task_update: TaskUpdate, user_id: int, session: Session):
        self._check_permission(project_id, run_id, user_id, session)
        if task_update.status_id:
            self._check_status(project_id, run_id, task_update.status_id, session)
        if task_update.priority_id:
            self._check_priority(task_update.priority_id, session)
        task = self._select_task_by_id(project_id, run_id, task_id, session)
        self._check_task(task)
        update_object_attributes(task, list(Task.model_json_schema()["properties"].keys()), task_update)

        run = session.get(Run, run_id)
        if task.status_id == run.statuses[-1].id:
            task.date_finished = datetime.today()

        commit_and_handle_exception(session)
        refresh_and_handle_exception(session, task)
        return task
    
    def delete_task_db(self, project_id: int, run_id: int, task_id: int, user_id: int, session: Session):
        self._check_permission(project_id, run_id, user_id, session)
        task = self._select_task_by_id(project_id, run_id, task_id, session)
        self._check_task(task)
        session.delete(task)
        commit_and_handle_exception(session)

    def _select_task_by_id(self, project_id: int, run_id: int, task_id: int, session: Session):
        statement = select(Task).join(Run, Run.id == Task.run_id).where(and_(Task.id == task_id, Task.run_id == run_id, Run.project_id == project_id))
        return session.exec(statement).first()

    def _check_task(self, task):
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")

    def _check_permission(self, project_id: int, run_id, user_id: int, session: Session):
        statement = select(Member).where(and_(Member.project_id == project_id, Member.user_id == user_id, Member.accepted))
        member = session.exec(statement).first()
        if not member:
            raise HTTPException(status_code=403, detail="Forbidden - Not Member")
        
        statement = select(Run).where(and_(Run.id == run_id, Run.project_id == project_id))
        run = session.exec(statement).first()
        if not run:
            raise HTTPException(status_code=404, detail="Project with this run not found")

        
    def _check_priority(self, priority_id: int, session: Session):
        statement = select(Priority).where(Priority.id == priority_id)
        priority = session.exec(statement).first()

        if not priority:
            raise HTTPException(status_code=404, detail="Priority not found")
        
    def _check_status(self, project_id: int, run_id: int, status_id: int, session: Session):
        statement = select(Status).where(and_(Status.id == status_id))
        status = session.exec(statement).first()

        if not status:
            raise HTTPException(status_code=404, detail="Status not found")
        if status.run.id != run_id or status.run.project_id != project_id:
            raise HTTPException(status_code=404, detail="Status is not part of this project")
        
    def _check_run(self, run_id: int, session: Session):
        statement = select(Run).where(Run.id == run_id)
        run = session.exec(statement).first()

        if not run:
            raise HTTPException(status_code=404, detail="Run not found")