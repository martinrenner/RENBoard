from typing import List, Optional
from sqlmodel import Field, Relationship, SQLModel, BIGINT, VARCHAR, asc
from sqlalchemy import TEXT, Column, Integer
from datetime import date


class Member(SQLModel, table=True):
    __tablename__ = "member"

    id: int = Field(sa_column=Column(BIGINT, primary_key=True, autoincrement=True))
    date_started: Optional[date] = None
    accepted: bool                                                                           #representing status: 0: pending, 1: active

    user_id: int = Field(foreign_key="user.id")
    project_id: int = Field(foreign_key="project.id")

    user: "User" = Relationship(back_populates="members")
    project: "Project" = Relationship(back_populates="teams")


class Task(SQLModel, table=True):
    __tablename__ = "task"

    id: int = Field(sa_column=Column(BIGINT, primary_key=True, autoincrement=True))
    name: str 
    description: str = Field(sa_column=Column(TEXT))
    date_created: date
    date_finished: Optional[date] = None
    
    sprint_id: int = Field(foreign_key="sprint.id", nullable=True)
    status_id: int = Field(foreign_key="status.id", nullable=True)
    priority_id: int = Field(foreign_key="priority.id")
    project_id: int = Field(foreign_key="project.id")
    
    sprint: "Sprint" = Relationship(back_populates="tasks")
    status: "Status" = Relationship(back_populates="tasks")
    priority: "Priority" = Relationship(back_populates="tasks")
    project: "Project" = Relationship(back_populates="tasks")


class Status(SQLModel, table=True):
    __tablename__ = "status"

    id: int = Field(sa_column=Column(BIGINT, primary_key=True, autoincrement=True))
    name: str

    sprint_id: int = Field(foreign_key="sprint.id")

    sprint: "Sprint" = Relationship(back_populates="statuses")
    tasks: List["Task"] = Relationship(back_populates="status", sa_relationship_kwargs={"cascade": "all, delete-orphan", "order_by": asc(Task.id)})


class Sprint(SQLModel, table=True):
    __tablename__ = "sprint"

    id: int = Field(sa_column=Column(BIGINT, primary_key=True, autoincrement=True))
    name: str
    description: str
    date_started: date
    date_finished: date

    project_id: int = Field(foreign_key="project.id")

    project: "Project" = Relationship(back_populates="sprints")
    tasks: List["Task"] = Relationship(back_populates="sprint", sa_relationship_kwargs={"cascade": "all, delete-orphan", "order_by": asc(Task.id)})
    statuses: List["Status"] = Relationship(back_populates="sprint", sa_relationship_kwargs={"cascade": "all, delete-orphan", "order_by": asc(Status.id)})


class Tag(SQLModel, table=True):
    __tablename__ = "tag"

    id: int = Field(sa_column=Column(BIGINT, primary_key=True, autoincrement=True))
    name: str = Field(sa_column=Column(VARCHAR, unique=True))

    projects: List["Project"] = Relationship(back_populates="tag", sa_relationship_kwargs={"cascade": "all, delete-orphan", "order_by": asc(Task.id)})


class Project(SQLModel, table=True):
    __tablename__ = "project"

    id: int = Field(sa_column=Column(BIGINT, primary_key=True, autoincrement=True))
    name: str
    description: str
    customer: Optional[str] = None
    created_at: date = Field(default_factory=date.today)

    user_id: int = Field(foreign_key="user.id")
    tag_id: int = Field(foreign_key="tag.id")

    user: "User" = Relationship(back_populates="projects")
    tag: "Tag" = Relationship(back_populates="projects")
    teams: List["Member"] = Relationship(back_populates="project", sa_relationship_kwargs={"cascade": "all, delete-orphan", "order_by": asc(Member.id)})
    sprints: List["Sprint"] = Relationship(back_populates="project", sa_relationship_kwargs={"cascade": "all, delete-orphan", "order_by": asc(Sprint.id)})
    tasks: List["Task"] = Relationship(back_populates="project", sa_relationship_kwargs={"cascade": "all, delete-orphan", "order_by": asc(Task.id)})


class User(SQLModel, table=True):
    __tablename__ = "user"

    id: int = Field(sa_column=Column(BIGINT, primary_key=True, autoincrement=True))
    name: str
    surname: str
    username: str = Field(sa_column=Column(VARCHAR, unique=True))
    email: str = Field(sa_column=Column(VARCHAR, unique=True))
    hashed_password: str

    projects: List["Project"] = Relationship(back_populates="user", sa_relationship_kwargs={"cascade": "all, delete-orphan", "order_by": asc(Project.id)})
    members: List["Member"] = Relationship(back_populates="user", sa_relationship_kwargs={"cascade": "all, delete-orphan", "order_by": asc(Member.id)})


class Priority(SQLModel, table=True):
    __tablename__ = "priority"

    id: int = Field(sa_column=Column(BIGINT, primary_key=True, autoincrement=True))
    name: str = Field(sa_column=Column(VARCHAR, unique=True))
    points: int = Field(sa_column=Column(Integer), ge=1)
    color: str = Field(sa_column=Column(VARCHAR, unique=True))

    tasks: List["Task"] = Relationship(back_populates="priority", sa_relationship_kwargs={"cascade": "all, delete-orphan", "order_by": asc(Task.id)})