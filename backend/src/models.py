from typing import List, Optional
from sqlmodel import Field, Relationship, SQLModel, BIGINT, VARCHAR
from sqlalchemy import TEXT, Column
from datetime import datetime


class Project(SQLModel, table=True):
    __tablename__ = "project"

    id: int = Field(sa_column=Column(BIGINT, primary_key=True, autoincrement=True))
    name: str
    description: str
    customer: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    user_id: int = Field(foreign_key="user.id")
    user: "User" = Relationship(back_populates="projects")

    teams: List["Member"] = Relationship(back_populates="project")
    runs: List["Run"] = Relationship(back_populates="project")


class User(SQLModel, table=True):
    __tablename__ = "user"

    id: int = Field(sa_column=Column(BIGINT, primary_key=True, autoincrement=True))
    name: str
    surname: str
    username: str = Field(sa_column=Column(VARCHAR, unique=True))
    email: str = Field(sa_column=Column(VARCHAR, unique=True))
    hashed_password: str

    projects: List["Project"] = Relationship(back_populates="user")
    members: List["Member"] = Relationship(back_populates="user")


class Member(SQLModel, table=True):
    __tablename__ = "member"

    id: int = Field(sa_column=Column(BIGINT, primary_key=True, autoincrement=True))
    date_started: Optional[datetime] = None
    date_finished: Optional[datetime] = None
    accepted: bool = False                                                                     #representing status: 0: pending, 1: active

    user_id: int = Field(foreign_key="user.id")
    project_id: int = Field(foreign_key="project.id")

    user: User = Relationship(back_populates="members")
    project: Project = Relationship(back_populates="teams")


class Run(SQLModel, table=True):
    __tablename__ = "run"

    id: int = Field(sa_column=Column(BIGINT, primary_key=True, autoincrement=True))
    name: str
    description: str
    date_started: datetime
    date_finished: Optional[datetime] = None

    project_id: int = Field(foreign_key="project.id")

    project: Project = Relationship(back_populates="runs")
    tasks: List["Task"] = Relationship(back_populates="run")
    statuses: List["Status"] = Relationship(back_populates="run")


class Status(SQLModel, table=True):
    __tablename__ = "status"

    id: int = Field(sa_column=Column(BIGINT, primary_key=True, autoincrement=True))
    name: str

    run_id: int = Field(foreign_key="run.id")

    run: Run = Relationship(back_populates="statuses")
    tasks: List["Task"] = Relationship(back_populates="status")


class Priority(SQLModel, table=True):
    __tablename__ = "priority"

    id: int = Field(sa_column=Column(BIGINT, primary_key=True, autoincrement=True))
    name: str
    color: str

    tasks: List["Task"] = Relationship(back_populates="priority")


class Task(SQLModel, table=True):
    __tablename__ = "task"

    id: int = Field(sa_column=Column(BIGINT, primary_key=True, autoincrement=True))
    name: str 
    description: str = Field(sa_column=Column(TEXT))
    expected_duration_hours: int
    
    run_id: int = Field(foreign_key="run.id")
    status_id: int = Field(foreign_key="status.id")
    priority_id: int = Field(foreign_key="priority.id")
    
    run: Run = Relationship(back_populates="tasks")
    status: Status = Relationship(back_populates="tasks")
    priority: Priority = Relationship(back_populates="tasks")