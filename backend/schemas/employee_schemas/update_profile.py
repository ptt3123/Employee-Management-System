from typing import Optional
from datetime import date

from pydantic import EmailStr, constr, model_validator

from schemas.employee_schemas.employee_schema import EmployeeBase


class UpdateProfile(EmployeeBase):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    dob: Optional[date] = None
    address: Optional[str] = None
    password: Optional[constr(min_length=6, max_length=12)] = None

    @model_validator(mode="after")
    def validate_update_employee(self):
        if len(self.phone_number) != 10:
            raise ValueError("Phone number must be 10 digits")