from sqlmodel import Session
from models import Status
from schemas.status import StatusCreate


class StatusService:
    def insert_status_db(self, sprint_id: int, status_create: StatusCreate, user_id: int, session: Session):
        status = Status(
            name=status_create.name,
            sprint_id=sprint_id
        )
        session.add(status)