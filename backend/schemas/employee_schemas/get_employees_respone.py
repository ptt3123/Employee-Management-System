from datetime import date

from enums import EmployeeStatus, EmployeePosition
from schemas.employee_schemas.employee_schema import EmployeeBase


class EmployeesResponse(EmployeeBase):
    id: int
    team_id: int
    name: str
    email: str
    phone_number: str
    status: EmployeeStatus
    address: str
    dob: date
    position: EmployeePosition
    username: str
    team_name: str
    is_woking: bool