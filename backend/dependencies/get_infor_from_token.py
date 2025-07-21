from fastapi import Depends
from jose import jwt
from fastapi.security import OAuth2PasswordBearer

from config import settings
from exceptions.exceptions import UnauthorizedException

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


async def get_infor_from_token(token: str = Depends(oauth2_scheme)):
    print(f"Received token: {token}")
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        employee_id: str = payload.get("sub")
        employee_name = payload.get("name")
        employee_role = payload.get("role")
        if employee_id is None or employee_name is None or employee_role is None:
            raise UnauthorizedException
    except Exception as e:
        raise e

    return {
        "id": employee_id,
        "employee_name": payload.get("name"),
        "employee_role": payload.get("role")
    }
