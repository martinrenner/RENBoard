from sqlmodel import Session, select
from models import Tag


class TagService:
    def select_all_status_db(self, session: Session):
        statement = select(Tag)
        tags = session.exec(statement).all()
        return tags