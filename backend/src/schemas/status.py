from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from models import Status


class StatusBase(BaseModel):
    model_config = ConfigDict(extra="forbid")


class StatusCreate(StatusBase):
    name: str = Field(..., examples=["Status name"], min_length=3, max_length=100)


class StatusUpdate(StatusBase):
    name: Optional[str] = Field(None, examples=["Status name"], min_length=3, max_length=100)


class StatusRead(StatusBase):
    id: int
    name: str

    @classmethod
    def from_status(cls, status: Status):
        return cls(
            id=status.id,
            name=status.name,
        )
