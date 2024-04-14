import os
from fastapi import HTTPException
from sqlmodel import Session, create_engine
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
POSTGRES_DB = os.getenv("POSTGRES_DB")

DATABASE_URL = f"postgresql+psycopg2://{POSTGRES_USER}:{POSTGRES_PASSWORD}@swi-postgres_db-application/{POSTGRES_DB}"

engine = create_engine(DATABASE_URL)


def get_session():
    with Session(engine) as session:
        yield session


def commit_and_handle_exception(session: Session):
    try:
        session.commit()
    except IntegrityError as e:
        if 'unique constraint' in str(e.orig).lower():
            raise HTTPException(status_code=409, detail=f"{e.orig.diag.message_detail}")
        else:
            raise HTTPException(status_code=500, detail="DatabaseError")
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="DatabaseError")

def refresh_and_handle_exception(session: Session, *objects):
    try:
        for obj in objects:
            if obj is not None:
                session.refresh(obj)
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="DatabaseError")

def flush_and_handle_exception(session: Session):
    try:
        session.flush()
    except IntegrityError as e:
        if 'unique constraint' in str(e.orig).lower():
            raise HTTPException(status_code=409, detail=f"{e.orig.diag.message_detail}")
        else:
            raise HTTPException(status_code=500, detail="DatabaseError")
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="DatabaseError")
