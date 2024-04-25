from typing import Optional
from pydantic import BaseModel, ConfigDict
from models import Task
import datetime


class ProgressBase(BaseModel):
    model_config = ConfigDict(extra="forbid")


class ProgressRead(ProgressBase):
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