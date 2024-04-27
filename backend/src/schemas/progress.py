from typing import Optional
from pydantic import BaseModel, ConfigDict
from models import Sprint, Task
import datetime


class ProgressBase(BaseModel):
    model_config = ConfigDict(extra="forbid")


class ProgressTaskRead(ProgressBase):
    date: datetime.date
    tasks_remaining: Optional[int] = None

    @classmethod
    def from_progress(cls, date: datetime.date, tasks: list[Task]):

        tasks_created = len([task for task in tasks if task.date_created <= date])
        tasks_finished = len([task for task in tasks if task.date_finished and task.date_finished <= date])

        return cls(
            date=date,
            tasks_remaining = (tasks_created - tasks_finished) if date <= datetime.date.today() else None
        )
    

class ProgressSprintRead(ProgressBase):
    id: int
    name: str
    is_finished: bool
    tasks_finished_count: int
    tasks_unfinished_count: int

    @classmethod
    def from_progress(cls, sprint: Sprint):
        tasks_finished_count = len([task for task in sprint.tasks if task.date_finished])
        tasks_unfinished_count = len([task for task in sprint.tasks if not task.date_finished])
        return cls(
            id=sprint.id,
            name=sprint.name,
            is_finished=sprint.date_finished < datetime.date.today(),
            tasks_finished_count=tasks_finished_count,
            tasks_unfinished_count=tasks_unfinished_count
        )