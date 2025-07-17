from pydantic import BaseModel


class EmployeeBase(BaseModel):
    username: str
    password: str

    class Config:
        orm_mode = True
