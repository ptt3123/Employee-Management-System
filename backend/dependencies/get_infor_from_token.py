from fastapi import Depends
from jose import jwt, ExpiredSignatureError, JWTError
from fastapi.security import OAuth2PasswordBearer

from config import settings
from exceptions.exceptions import UnauthorizedException
from schemas.token.InforFromToken import InforFromToken

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/employee/login")


async def get_infor_from_token(token: str = Depends(oauth2_scheme)) -> InforFromToken:

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        employee_id: str = payload.get("sub")
        employee_name = payload.get("name")
        employee_role = payload.get("role")
        if employee_id is None or employee_name is None or employee_role is None:
            raise UnauthorizedException
    except ExpiredSignatureError:
        raise UnauthorizedException("Token has expired. Please login again.")
    except JWTError:
        raise UnauthorizedException("Invalid token")
    except Exception as e:
        raise e

    infor_from_token = InforFromToken(
        id = int(employee_id),
        employee_name = employee_name,
        employee_role = employee_role
    )
    return infor_from_token
