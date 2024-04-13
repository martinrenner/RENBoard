from database import commit_and_handle_exception, engine
from sqlmodel import SQLModel, Session
from models import Priority  # noqa: F401


def initialize_database():
    SQLModel.metadata.create_all(engine)
    _add_priority()


def _add_priority():
    priorities = [
        Priority(name="Low", color="#00FF00"),
        Priority(name="Medium", color="#FFFF00"),
        Priority(name="High", color="#FF0000"),
    ]
    with Session(engine) as session:
        session.add_all(priorities)
        commit_and_handle_exception(session)
    