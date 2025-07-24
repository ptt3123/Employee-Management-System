from operator import truediv

from sqlalchemy.ext.asyncio import AsyncSession

from cruds.employee_crud import get_current_employee
from enums import EmployeeRole
from unidecode import unidecode

async def generate_username(employee_name: str, db= AsyncSession):

    employee_name = unidecode(employee_name)
    split_employee_name = employee_name.split(" ")
    split_employee_name_length = len(split_employee_name)
    username = split_employee_name[split_employee_name_length - 1]
    i = 0
    while i < split_employee_name_length - 1:
        username += split_employee_name[i][0]
        i += 1

    suffix = 0
    while await get_current_employee(db= db, field="username", value=username):
        suffix += 1
        username += str(suffix)

    return username