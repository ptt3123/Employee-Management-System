from typing import Optional

from enums import EmployeeStatus

class GetEmployees:
    employee_status: Optional[EmployeeStatus] = EmployeeStatus.ACTIVE,
    team_id: Optional[int] = None,
    search_by: Optional[str] = None,
    search_value: Optional[str] = None,
    sort_by: Optional[str] = 'id',
    sort_value: Optional[str] = 'desc',
    page: int = 1,
    page_size: int = 10

    class Config:
        from_attributes = True