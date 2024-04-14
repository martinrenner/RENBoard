from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from schemas.priority import PriorityRead
from schemas.status import StatusRead
from models import Task


class TaskBase(BaseModel):
    model_config = ConfigDict(extra="forbid")


class TaskCreate(TaskBase):
    name: str = Field(..., examples=["Task name"], min_length=3, max_length=100)
    description: str = Field(..., examples=["Task description"], min_length=3, max_length=1000)
    expected_duration_hours: int = Field(..., examples=[1], ge=1)
    status_id: int = Field(..., examples=[1], ge=1)
    priority_id: int = Field(..., examples=[1], ge=1)


class TaskUpdate(TaskBase):
    name: Optional[str] = Field(None, examples=["Project name"], min_length=3, max_length=100)
    description: Optional[str] = Field(None, examples=["Project description"], min_length=3, max_length=1000)
    expected_duration_hours: Optional[int] = Field(None, examples=[1], ge=1)
    status_id: Optional[int] = Field(None, examples=[1], ge=1)
    priority_id: Optional[int] = Field(None, examples=[1], ge=1)


class TaskRead(TaskBase):
    id: int
    name: str
    description: str
    expected_duration_hours: int
    status: StatusRead
    priority: PriorityRead

    @classmethod
    def from_task(cls, task: Task):
        return cls(
            id=task.id,
            name=task.name,
            description=task.description,
            expected_duration_hours=task.expected_duration_hours,
            status=StatusRead.from_status(task.status),
            priority=PriorityRead.from_priority(task.priority)
        )
