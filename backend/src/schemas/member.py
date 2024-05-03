from pydantic import BaseModel, ConfigDict
from models import Member


class MemberBase(BaseModel):
    model_config = ConfigDict(extra="forbid")

class MemberRead(MemberBase):
    id: int
    name: str
    surname: str
    username: str
    email: str
    is_owner: bool
    is_accepted: bool


    @classmethod
    def from_member(cls, member: Member):
        return cls(
            id=member.user.id,
            name=member.user.name,
            surname=member.user.surname,
            username=member.user.username,
            email=member.user.email,
            is_owner=True if member.project.user_id == member.user_id else False,
            is_accepted=member.accepted
        )