from sqlmodel import Session, select
from models import Priority


class PriorityService:
    def select_all_prorities_db(self, session: Session):
        statement = select(Priority)
        priorities = session.exec(statement).all()
        return priorities