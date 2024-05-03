from database import commit_and_handle_exception, engine
from sqlmodel import SQLModel, Session
from sqlalchemy.engine import reflection
from models import Priority, Tag


def initialize_database():
    if not _db_initialized():
        SQLModel.metadata.create_all(engine)
        _add_priority()
        _add_tags()

def _db_initialized():
    inspector = reflection.Inspector.from_engine(engine)
    tables = inspector.get_table_names(schema="public")
    return True if len(tables) > 0 else False

def _add_priority():
    priorities = [
        Priority(name="Low", points=1, color="success"),
        Priority(name="Medium", points=3, color="warning"),
        Priority(name="High", points=5, color="danger"),
    ]
    with Session(engine) as session:
        session.add_all(priorities)
        commit_and_handle_exception(session)

def _add_tags():
    tags = [
        Tag(name="Development"),
        Tag(name="Business"),
        Tag(name="Design"),
        Tag(name="Marketing"),
        Tag(name="Management"),
        Tag(name="Education")
    ]
    with Session(engine) as session:
        session.add_all(tags)
        commit_and_handle_exception(session)
    