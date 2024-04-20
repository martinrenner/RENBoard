from pydantic import BaseModel, ConfigDict, Field
from schemas.task import TaskRead
from models import Status


class StatusBase(BaseModel):
    model_config = ConfigDict(extra="forbid")


class StatusCreate(StatusBase):
    name: str = Field(..., examples=["Status name"], min_length=3, max_length=100)


class StatusRead(StatusBase):
    id: int
    name: str
    task: list[TaskRead]

    @classmethod
    def from_status(cls, status: Status):
        return cls(
            id=status.id,
            name=status.name,
            task=[TaskRead.from_task(task) for task in status.tasks]
        )
