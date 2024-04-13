from pydantic import BaseModel


class DefaultBase(BaseModel):
    message: str

    @classmethod
    def from_default(cls, message: str):
        return cls(message=message)