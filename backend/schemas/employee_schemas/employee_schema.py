from typing import Optional

from pydantic import BaseModel, EmailStr
from datetime import date

from enums import EmployeeRole, EmployeeStatus


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
    password: Optional[str] = None
    status: Optional[EmployeeStatus] = None
