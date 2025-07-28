from typing import Optional

from pydantic import BaseModel

from enums import EmployeeStatus, SortValue


class GetEmployees(BaseModel):
    employee_status: Optional[EmployeeStatus] = EmployeeStatus.ACTIVE
    team_id: Optional[int] = None
    search_by: Optional[str] = None
    search_value: Optional[str] = None
    sort_by: Optional[str] = 'name'
    sort_value: Optional[SortValue] = SortValue.DESC
    page: int = 1
    page_size: int = 10

    class Config:
        from_attributes = True