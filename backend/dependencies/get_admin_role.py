from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from dependencies.get_infor_from_token import get_infor_from_token
from exceptions.exceptions import UnauthorizedException

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

async def get_admin_role(employee_infor: dict = Depends(get_infor_from_token)) -> dict:
    print(employee_infor)
    if employee_infor.get("employee_role") != "ADMIN":
        raise UnauthorizedException
    return employee_infor