from pydantic import constr
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
