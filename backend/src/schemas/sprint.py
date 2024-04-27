from datetime import date, timedelta
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from schemas.progress import ProgressTaskRead
from schemas.status import StatusCreate, StatusRead
from models import Sprint


class SprintBase(BaseModel):
    model_config = ConfigDict(extra="forbid")


class SprintCreate(SprintBase):
    name: str = Field(..., examples=["Sprint name"], min_length=3, max_length=100)
    description: str = Field(..., examples=["Sprint description"], min_length=3, max_length=1000)
    date_started: date = Field(..., examples=["2024-04-21"])
    date_finished: date = Field(..., examples=["2024-04-23"])
    task_ids: list[int] = Field(..., examples=[[1, 2]], min_items=0)
    statuses: list[StatusCreate] = Field(..., min_items=2)
    

class SprintUpdate(SprintBase):
    name: Optional[str] = Field(None, examples=["Sprint name"], min_length=3, max_length=100)
    description: Optional[str] = Field(None, examples=["Sprint description"], min_length=3, max_length=1000)
    date_started: Optional[date] = Field(None, examples=["2024-04-21"])
    date_finished: Optional[date] = Field(None, examples=["2024-04-23"])


class SprintAssignTaskCreate(SprintBase):
    task_ids: list[int] = Field(..., examples=[[1, 2]], min_items=1)


class SprintRead(SprintBase):
    id: int
    name: str
    description: str
    date_started: date
    date_finished: date
    statuses: list[StatusRead]

    @classmethod
    def from_sprint(cls, sprint: Sprint):
        return cls(
            id=sprint.id,
            name=sprint.name,
            description=sprint.description,
            date_started=sprint.date_started,
            date_finished=sprint.date_finished,
            statuses=[StatusRead.from_status(status) for status in sprint.statuses]
        )
    
class SprintReadChart(SprintBase):
    id: int
    name: str
    date_started: date
    date_finished: date
    total_tasks_count: int
    total_tasks_finished_count: int
    total_tasks_unfinished_count: int
    daily_progress: list[ProgressTaskRead]

    @classmethod
    def from_sprint(cls, sprint: Sprint):
        total_tasks_count = len(sprint.tasks)
        total_tasks_finished_count = len([task for task in sprint.tasks if task.date_finished])
        total_tasks_unfinished_count = total_tasks_count - total_tasks_finished_count
        date_range = [sprint.date_started + timedelta(days=i) for i in range((sprint.date_finished - sprint.date_started).days + 1)]

        return cls(
            id=sprint.id,
            name=sprint.name,
            date_started=sprint.date_started,
            date_finished=sprint.date_finished,
            velocity=0,
            on_time=False,
            current_speed=1.33,
            total_tasks_count=total_tasks_count,
            total_tasks_finished_count=total_tasks_finished_count,
            total_tasks_unfinished_count=total_tasks_unfinished_count,
            daily_progress = [ProgressTaskRead.from_progress(date=date, tasks=sprint.tasks) for date in date_range]
        )
