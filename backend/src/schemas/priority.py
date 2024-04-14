from pydantic import BaseModel, ConfigDict
from models import Priority


class PriorityBase(BaseModel):
    model_config = ConfigDict(extra="forbid")

class PriorityRead(PriorityBase):
    id: int
    name: str
    color: str

    @classmethod
    def from_priority(cls, priority: Priority):
        return cls(
            id=priority.id, 
            name=priority.name, 
            color=priority.color
        )
