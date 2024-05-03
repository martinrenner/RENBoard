from pydantic import BaseModel, ConfigDict
from models import Tag


class TagBase(BaseModel):
    model_config = ConfigDict(extra="forbid")


class TagRead(TagBase):
    id: int
    name: str

    @classmethod
    def from_tag(cls, tag: Tag):
        return cls(
            id=tag.id,
            name=tag.name,
        )
