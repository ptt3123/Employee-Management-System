from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer

from config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


async def authorize(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        employee_id: str = payload.get("sub")
        employee_name = payload.get("name")
        employee_role = payload.get("role")
        if employee_id is None or employee_name is None or employee_role is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    return {
        "id": employee_id,
        "employee_name": payload.get("name"),
        "employee_role": payload.get("role")
    }
