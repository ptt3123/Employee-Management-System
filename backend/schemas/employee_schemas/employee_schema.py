# noinspection PyInterpreter
from pydantic import constr, model_validator
from typing import Optional

from pydantic import BaseModel, EmailStr
from datetime import date

from enums import EmployeeRole, EmployeeStatus, EmployeePosition


class EmployeeBase(BaseModel):

    class Config:
        from_attributes = True

class EmployeeCreate(EmployeeBase):
    name: str
    email: EmailStr
    phone_number: str
    address: str
    dob: date
    role: EmployeeRole = EmployeeRole.STAFF
    status: EmployeeStatus = EmployeeStatus.ACTIVE

    @model_validator(mode="after")
    def validate_employee(self):
        if len(self.phone_number) != 10:
            raise ValueError("Phone number must be 10 digits")

        return self

class EmployeeUpdate(EmployeeBase):

    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    dob: Optional[date] = None
    address: Optional[str] = None
    role: Optional[EmployeeRole] = None
    position: Optional[EmployeePosition] = None
    password: Optional[constr(min_length=6, max_length=12)] = None
    status: Optional[EmployeeStatus] = None
    team_id: Optional[int] = None

    @model_validator(mode="after")
    def validate_update_employee(self):
        if self.phone_number is not None and len(self.phone_number) != 10:
            raise ValueError("Phone number must be 10 digits")
        return self