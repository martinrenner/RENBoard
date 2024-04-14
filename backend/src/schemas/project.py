from datetime import date
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from schemas.run import RunRead
from models import Project


class ProjectBase(BaseModel):
    model_config = ConfigDict(extra="forbid")


class ProjectCreate(ProjectBase):
    name: str = Field(..., examples=["Project name"], min_length=3, max_length=100)
    description: str = Field(..., examples=["Project description"], min_length=3, max_length=1000)
    customer: Optional[str] = Field(None, examples=["Customer name"], min_length=3, max_length=100)


class ProjectUpdate(ProjectBase):
    name: Optional[str] = Field(None, examples=["Project name"], min_length=3, max_length=100)
    description: Optional[str] = Field(None, examples=["Project description"], min_length=3, max_length=1000)
    customer: Optional[str] = Field(None, examples=["Customer name"], min_length=3, max_length=100)


class ProjectRead(ProjectBase):
    id: int
    name: str
    description: str
    customer: str
    owner_id: int
    created_at: date
    runs: list[RunRead]

    @classmethod
    def from_project(cls, project: Project):
        return cls(
            id=project.id, 
            name=project.name, 
            description=project.description, 
            owner_id=project.user_id,
            customer=project.customer if project.customer is not None else "",
            created_at=project.created_at,
            runs=[RunRead.from_run(run) for run in project.runs]
        )
