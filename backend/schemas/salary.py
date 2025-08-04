from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SalaryBase(BaseModel):
    salary: int
    allowance: Optional[int] = None
    reward: Optional[int] = None
    detail: Optional[str] = None

class SalaryCreate(SalaryBase):
    employee_id: int

class SalaryUpdate(SalaryBase):
    salary: Optional[int] = None

class SalaryResponse(SalaryBase):
    employee_id: int
    create_date: datetime
    update_date: Optional[datetime] = None
    
    # Employee information
    employee_name: Optional[str] = None
    employee_email: Optional[str] = None
    employee_position: Optional[str] = None

    class Config:
        from_attributes = True

class SalaryListResponse(BaseModel):
    salaries: list[SalaryResponse]
    total: int
    page: int
    per_page: int
