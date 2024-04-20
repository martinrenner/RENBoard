from datetime import date
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from schemas.status import StatusCreate, StatusRead
from models import Sprint


class SprintBase(BaseModel):
    model_config = ConfigDict(extra="forbid")


class SprintCreate(SprintBase):
    name: str = Field(..., examples=["Sprint name"], min_length=3, max_length=100)
    description: str = Field(..., examples=["Sprint description"], min_length=3, max_length=1000)
    date_started: date = Field(..., examples=["2021-05-01"])
    date_finished: date = Field(..., examples=["2021-06-01"])
    task_ids: list[int] = Field(..., examples=[[1, 2]], min_items=0)
    statuses: list[StatusCreate] = Field(..., min_items=2)
    

class SprintUpdate(SprintBase):
    name: Optional[str] = Field(None, examples=["Sprint name"], min_length=3, max_length=100)
    description: Optional[str] = Field(None, examples=["Sprint description"], min_length=3, max_length=1000)
    date_started: Optional[date] = Field(None, examples=["3.5.2021"])
    date_finished: Optional[date] = Field(None, examples=["3.6.2021"])


class SprintAssignTaskCreate(SprintBase):
    task_ids: list[int] = Field(..., examples=[[1, 2]], min_items=1)


class SprintRead(SprintBase):
    id: int
    name: str
    description: str
    date_started: date
    date_finished: Optional[date] = None
    statuses: list[StatusRead]

    @classmethod
    def from_sprint(cls, sprint: Sprint):
        return cls(
            id=sprint.id,
            name=sprint.name,
            description=sprint.description,
            date_started=sprint.date_started,
            date_finished=sprint.date_finished if sprint.date_finished is not None else None,
            statuses=[StatusRead.from_status(status) for status in sprint.statuses]
        )