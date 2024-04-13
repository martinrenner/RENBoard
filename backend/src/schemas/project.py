from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from models import Project


class ProjectBase(BaseModel):
    model_config = ConfigDict(extra="forbid")


class ProjectCreate(ProjectBase):
    name: str = Field(..., examples=["Project name"], min_length=3, max_length=100)
    description: str = Field(..., examples=["Project description"], min_length=3, max_length=1000)
    customer: Optional[str] = Field(None, examples=["Customer name"], min_length=3, max_length=100)


class ProjectUpdate(ProjectBase):
    name: str = Field(..., examples=["Project name"], min_length=3, max_length=100)
    description: str = Field(..., examples=["Project description"], min_length=3, max_length=1000)
    customer: Optional[str] = Field(..., examples=["Customer name"], min_length=3, max_length=100)


class ProjectRead(ProjectBase):
    id: int
    name: str
    description: str
    customer: str
    created_at: datetime

    @classmethod
    def from_project(cls, project: Project):
        return cls(
            id=project.id, 
            name=project.name, 
            description=project.description, 
            customer=project.customer if project.customer is not None else "",
            created_at=project.created_at)
