from datetime import date
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from schemas.progress import ProgressSprintRead
from schemas.task import TaskRead
from schemas.tag import TagRead
from schemas.sprint import SprintRead
from models import Member, Project


class ProjectBase(BaseModel):
    model_config = ConfigDict(extra="forbid")


class ProjectCreate(ProjectBase):
    name: str = Field(..., examples=["Project name"], min_length=3, max_length=100)
    description: str = Field(..., examples=["Project description"], min_length=3, max_length=1000)
    customer: Optional[str] = Field(None, examples=["Customer name"], min_length=3, max_length=100)
    tag_id: int = Field(..., examples=[1], ge=1)


class ProjectUpdate(ProjectBase):
    name: Optional[str] = Field(None, examples=["Project name"], min_length=3, max_length=100)
    description: Optional[str] = Field(None, examples=["Project description"], min_length=3, max_length=1000)
    customer: Optional[str] = Field(None, examples=["Customer name"], min_length=3, max_length=100)
    tag_id: Optional[int] = Field(None, examples=[1], ge=1)


class ProjectRead(ProjectBase):
    id: int
    name: str
    description: str
    customer: str
    tag: TagRead
    owner_id: int
    created_at: date
    sprints: list[SprintRead]
    tasks: list[TaskRead]

    @classmethod
    def from_project(cls, project: Project):
        return cls(
            id=project.id, 
            name=project.name, 
            description=project.description,
            tag=TagRead.from_tag(project.tag),
            owner_id=project.user_id,
            customer=project.customer if project.customer is not None else "",
            created_at=project.created_at,
            sprints=[SprintRead.from_sprint(sprint) for sprint in project.sprints],
            tasks=[TaskRead.from_task(task) for task in project.tasks if task.sprint_id is None]
        )


class ProjectMemberRead(ProjectBase):
    id: int
    name: str
    is_owner: bool
    is_accepted: bool

    @classmethod
    def from_member(cls, member: Member):
        return cls(
            id=member.project.id, 
            name=member.project.name,
            is_owner=member.project.user_id == member.user_id,
            is_accepted=member.accepted
        )

class ProjectReadChart(ProjectBase):
    id: int
    name: str
    total_sprints_count: int
    total_sprints_finished_count: int
    total_sprints_unfinished_count: int 
    sprints_progress: list[ProgressSprintRead]

    @classmethod
    def from_project(cls, project: Project):
        total_sprints_count = len(project.sprints)
        total_sprints_finished_count = len([sprint for sprint in project.sprints if sprint.date_finished < date.today()])
        total_sprints_unfinished_count = total_sprints_count - total_sprints_finished_count

        return cls(
            id=project.id,
            name=project.name,
            total_sprints_count=total_sprints_count,
            total_sprints_finished_count=total_sprints_finished_count,
            total_sprints_unfinished_count=total_sprints_unfinished_count,
            sprints_progress=[ProgressSprintRead.from_progress(sprint) for sprint in project.sprints]
        )
