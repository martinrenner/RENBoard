from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from models import Status


class StatusBase(BaseModel):
    model_config = ConfigDict(extra="forbid")


class StatusCreate(StatusBase):
    name: str = Field(..., examples=["Status name"], min_length=3, max_length=100)
    order: int = Field(..., examples=[1], ge=1)


class StatusUpdate(StatusBase):
    name: Optional[str] = Field(None, examples=["Status name"], min_length=3, max_length=100)
    order: Optional[int] = Field(None, examples=[1], ge=1)


class StatusRead(StatusBase):
    id: int
    name: str
    order: int

    @classmethod
    def from_status(cls, status: Status):
        return cls(
            id=status.id,
            name=status.name,
            order=status.order
        )
