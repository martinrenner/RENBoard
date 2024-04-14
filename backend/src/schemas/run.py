from datetime import date
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from schemas.status import StatusRead
from schemas.task import TaskRead
from models import Run


class RunBase(BaseModel):
    model_config = ConfigDict(extra="forbid")


class RunCreate(RunBase):
    name: str = Field(..., examples=["Run name"], min_length=3, max_length=100)
    description: str = Field(..., examples=["Run description"], min_length=3, max_length=1000)
    date_started: date = Field(..., examples=["2021-05-01"])
    date_finished: Optional[date] = Field(None, examples=["2021-06-01"])

class RunUpdate(RunBase):
    name: Optional[str] = Field(None, examples=["Run name"], min_length=3, max_length=100)
    description: Optional[str] = Field(None, examples=["Run description"], min_length=3, max_length=1000)
    date_started: Optional[date] = Field(None, examples=["3.5.2021"])
    date_finished: Optional[date] = Field(None, examples=["3.6.2021"])

class RunRead(RunBase):
    id: int
    name: str
    description: str
    date_started: date
    date_finished: Optional[date] = None
    task: list[TaskRead]
    statuses: list[StatusRead]

    @classmethod
    def from_run(cls, run: Run):
        return cls(
            id=run.id,
            name=run.name,
            description=run.description,
            date_started=run.date_started,
            date_finished=run.date_finished if run.date_finished is not None else None,
            task=[TaskRead.from_task(task) for task in run.tasks],
            statuses=[StatusRead.from_status(status) for status in run.statuses]
        )