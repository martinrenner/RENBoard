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
    accepted: bool


    @classmethod
    def from_member(cls, member: Member):
        return cls(
            id=member.user.id,
            name=member.user.name,
            surname=member.user.surname,
            username=member.user.username,
            email=member.user.email,
            accepted=member.accepted
        )