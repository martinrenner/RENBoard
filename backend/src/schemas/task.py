from pydantic import BaseModel, ConfigDict, Field
from models import Task


class TaskBase(BaseModel):
    model_config = ConfigDict(extra="forbid")


class TaskCreate(TaskBase):
    name: str = Field(..., examples=["Project name"], min_length=3, max_length=100)


class TaskUpdate(TaskBase):
    name: str = Field(..., examples=["Project name"], min_length=3, max_length=100)


class TaskRead(TaskBase):
    id: int

    @classmethod
    def from_project(cls, task: Task):
        return cls(
            id=task.id
        )
