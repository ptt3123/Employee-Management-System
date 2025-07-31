from datetime import date
from typing import Optional

from enums import EmployeeStatus, EmployeePosition
from schemas.employee_schemas.employee_schema import EmployeeBase


class EmployeesResponse(EmployeeBase):
    id: int
    team_id: Optional[int]
    position: EmployeePosition
    name: str
    email: str
    phone_number: str
    status: EmployeeStatus
    address: str
    dob: date
    position: Optional[EmployeePosition]
    username: str
    team_name: Optional[str]
    is_working: bool