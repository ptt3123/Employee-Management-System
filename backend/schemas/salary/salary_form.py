from pydantic import BaseModel, conint

class SalaryForm(BaseModel):
    salary: conint(gt=0)
    allowance: conint(gt=0)
    reward: conint(gt=0)
    detail: str

class SalaryCreateForm(SalaryForm):
    employee_id: conint(gt=0)
