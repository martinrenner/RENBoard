from pydantic import BaseModel, ConfigDict, Field
from models import Status


class StatusBase(BaseModel):
    model_config = ConfigDict(extra="forbid")


class StatusCreate(StatusBase):
    name: str = Field(..., examples=["Project name"], min_length=3, max_length=100)


class StatusUpdate(StatusBase):
    name: str = Field(..., examples=["Project name"], min_length=3, max_length=100)


class StatusRead(StatusBase):
    id: int

    @classmethod
    def from_project(cls, status: Status):
        return cls(
            id=status.id
        )
