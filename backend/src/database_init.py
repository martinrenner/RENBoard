from database import commit_and_handle_exception, engine
from sqlmodel import SQLModel, Session
from sqlalchemy.engine import reflection
from models import Priority  # noqa: F401


def initialize_database():
    if not _db_initialized():
        SQLModel.metadata.create_all(engine)
        _add_priority()

def _db_initialized():
    inspector = reflection.Inspector.from_engine(engine)
    tables = inspector.get_table_names(schema="public")
    return True if len(tables) > 0 else False

def _add_priority():
    priorities = [
        Priority(name="Low", color="#00FF00"),
        Priority(name="Medium", color="#FFFF00"),
        Priority(name="High", color="#FF0000"),
    ]
    with Session(engine) as session:
        session.add_all(priorities)
        commit_and_handle_exception(session)
    