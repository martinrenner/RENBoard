from datetime import datetime
from fastapi import HTTPException
from sqlmodel import Session, and_, select
from helpers import update_object_attributes
from database import commit_and_handle_exception, refresh_and_handle_exception
from models import Member, Priority, Status, Task
from schemas.task import TaskCreate, TaskUpdate


class TaskService:
    def insert_task_db(self, project_id: int, task_create: TaskCreate, user_id: int, session: Session):
        self._check_permission(project_id, user_id, session)
        self._check_priority(task_create.priority_id, session)
        task = Task(
            name=task_create.name,
            description=task_create.description,
            date_created=datetime.today().date(),
            project_id=project_id,
            priority_id=task_create.priority_id
        )   
        session.add(task)
        commit_and_handle_exception(session)
        return task
    
    def select_task_by_id_db(self, task_id: int, user_id: int, session: Session):
        task = self._select_task_by_id(task_id, session)
        self._check_task(task)
        self._check_permission(task.project_id, user_id, session)
        return task
    
    def select_all_tasks_db(self, project_id: int, user_id: int, session: Session):
        self._check_permission(project_id, user_id, session)
        statement = select(Task).where(and_(Task.project_id == project_id, Task.sprint_id.is_(None))).order_by(Task.id)
        tasks = session.exec(statement).all()
        return tasks

    def update_task_db(self, task_id: int, task_update: TaskUpdate, user_id: int, session: Session):
        task = self._select_task_by_id(task_id, session)
        self._check_task(task)
        self._check_permission(task.project_id, user_id, session)
        if task_update.priority_id:
            self._check_priority(task_update.priority_id, session)
        update_object_attributes(task, list(Task.model_json_schema()["properties"].keys()), task_update)
        commit_and_handle_exception(session)
        refresh_and_handle_exception(session, task)
        return task
    
    def delete_task_db(self, task_id: int, user_id: int, session: Session):
        task = self._select_task_by_id(task_id, session)
        self._check_task(task)
        self._check_permission(task.project_id, user_id, session)
        session.delete(task)
        commit_and_handle_exception(session)

    def assign_task_to_sprint_db(self, task_id: int, status_id: int, user_id: int, session: Session):
        task = self._select_task_by_id(task_id, session)
        self._check_task(task)
        self._check_permission(task.project_id, user_id, session)

        status = session.exec(select(Status).where(Status.id == status_id)).first()
        if status is None:
            raise HTTPException(status_code=404, detail="Status not found")
        if status.sprint.project_id != task.project_id:
            raise HTTPException(status_code=404, detail="Status not found in the same project as the task")
        if task.sprint_id is None:
            raise HTTPException(status_code=400, detail="Task not assigned to a sprint")
        if status_id not in [status.id for status in task.sprint.statuses]:
            raise HTTPException(status_code=404, detail="Status not found in the sprint of the task")

        if abs(task.status_id - status_id) > 1:
            raise HTTPException(status_code=404, detail="Cannot move task more than one status at a time")

        task.sprint_id = status.sprint_id
        task.status_id = status_id
        task.timestamp = datetime.now()

        if task.status_id == status.sprint.statuses[-1].id:
            task.date_finished = datetime.today().date()
        else:
            task.date_finished = None

        session.add(task)
        commit_and_handle_exception(session)
        return task
    
    def deassign_task_from_sprint_db(self, task_id: int, user_id: int, session: Session):
        task = self._select_task_by_id(task_id, session)
        self._check_task(task)
        self._check_permission(task.project_id, user_id, session)
        
        task.sprint_id = None
        task.status_id = None
        task.timestamp = None
        task.date_finished = None
        session.add(task)
        
        commit_and_handle_exception(session)
        return task

    def assign_task_to_sprint(self, task_id: int, status_id: int, session: Session):
        task = self._select_task_by_id(task_id, session)
        self._check_task(task)

        status = session.exec(select(Status).where(Status.id == status_id)).first()
        if status.sprint.project_id != task.project_id:
            raise HTTPException(status_code=404, detail="Status not found in the same project as the task")
        
        if task.sprint_id:
            raise HTTPException(status_code=400, detail="Task already assigned to a sprint")

        task.sprint_id = status.sprint_id
        task.status_id = status_id
        task.timestamp = datetime.now()
        session.add(task)
        return task

    def _select_task_by_id(self, task_id: int, session: Session):
        statement = select(Task).where(Task.id == task_id)
        return session.exec(statement).first()

    def _check_task(self, task):
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")


    def _check_permission(self, project_id: int, user_id: int, session: Session):
        statement = select(Member).where(and_(Member.project_id == project_id, Member.user_id == user_id, Member.accepted))
        member = session.exec(statement).first()
        if not member:
            raise HTTPException(status_code=403, detail="Forbidden - Not Member")

        
    def _check_priority(self, priority_id: int, session: Session):
        statement = select(Priority).where(Priority.id == priority_id)
        priority = session.exec(statement).first()

        if not priority:
            raise HTTPException(status_code=404, detail="Priority not found")