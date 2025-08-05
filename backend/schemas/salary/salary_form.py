from pydantic import BaseModel, conint

class SalaryForm(BaseModel):
    salary: conint(gt=0) = None
    allowance: conint(gt=0) = None
    reward: conint(gt=0) = None
    detail: str = None

class SalaryCreateForm(SalaryForm):
    employee_id: conint(gt=0)
