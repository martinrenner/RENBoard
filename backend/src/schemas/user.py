from pydantic import BaseModel, ConfigDict, Field, field_validator, EmailStr
from pydantic_core.core_schema import FieldValidationInfo
from models import User


class UserBase(BaseModel):
    model_config = ConfigDict(extra="forbid")


class UserCreate(UserBase):
    name: str = Field(..., examples=["Your name"], min_length=3, max_length=100)
    surname: str = Field(..., examples=["Your surname"], min_length=3, max_length=100)
    username: str = Field(..., examples=["username"], min_length=3, max_length=100)
    email: EmailStr = Field(..., examples=["email@example.com"], min_length=3, max_length=100)
    password: str = Field(..., examples=["MyPassword123"], min_length=3, max_length=100)
    password_confirmation: str = Field(..., examples=["MyPassword123"], min_length=3, max_length=100)

    @field_validator("password_confirmation", mode="before")
    def validate_password_confirmation(cls, value, info: FieldValidationInfo):
        password = info.data.get("password")
        if value != password:
            raise ValueError("Passwords do not match")
        return value


class UserLogin(UserBase):
    username: str
    password: str


class UserRead(UserBase):
    id: int
    name: str
    surname: str
    username: str
    email: str

    @classmethod
    def from_user(cls, user: User):
        return cls(
            id=user.id,
            name=user.name,
            surname=user.surname,
            username=user.username,
            email=user.email,
        )