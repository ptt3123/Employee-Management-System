from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from dependencies.get_infor_from_token import get_infor_from_token
from enums import EmployeeRole
from exceptions.exceptions import UnauthorizedException
from schemas.token.InforFromToken import InforFromToken


async def get_admin_role(employee_infor: InforFromToken = Depends(get_infor_from_token)) -> InforFromToken:
    print(employee_infor)
    if employee_infor.employee_role != EmployeeRole.ADMIN:
        raise UnauthorizedException
    return employee_infor