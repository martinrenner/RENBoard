from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from models import Run


class RunBase(BaseModel):
    model_config = ConfigDict(extra="forbid")


class RunCreate(RunBase):
    name: str = Field(..., examples=["Project name"], min_length=3, max_length=100)
    description: str = Field(..., examples=["Project description"], min_length=3, max_length=1000)
    date_started: datetime = Field(..., examples=["3.5.2021 12:00:00"])
    date_finished: Optional[datetime] = Field(None, examples=["3.6.2021 12:00:00"])


class RunUpdate(RunBase):
    name: str = Field(..., examples=["Project name"], min_length=3, max_length=100)
    description: str = Field(..., examples=["Project description"], min_length=3, max_length=1000)
    date_started: datetime = Field(..., examples=["3.5.2021 12:00:00"])
    date_finished: Optional[datetime] = Field(None, examples=["3.6.2021 12:00:00"])


class RunRead(RunBase):
    id: int
    name: str
    description: str
    date_started: datetime
    date_finished: Optional[datetime] = None

    @classmethod
    def from_project(cls, run: Run):
        return cls(
            id=run.id,
            name=run.name,
            description=run.description,
            date_started=run.date_started,
            date_finished=run.date_finished if run.date_finished is not None else None
        )