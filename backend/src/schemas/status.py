from operator import attrgetter
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
    tasks: list[TaskRead]

    @classmethod
    def from_status(cls, status: Status):
        sorted_tasks = sorted(status.tasks, key=attrgetter('timestamp'))

        return cls(
            id=status.id,
            name=status.name,
            tasks=[TaskRead.from_task(task) for task in sorted_tasks]
        )
