from pydantic import BaseModel

from enums import EmployeeRole


class InforFromToken(BaseModel):
    id: int
    employee_name: str
    employee_role: EmployeeRole