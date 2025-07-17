from fastapi import APIRouter, HTTPException,status
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from database import get_db
from cruds.employee_crud import get_employee_by_username
from utils.generate_token import generate_access_token

auth_router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")
@auth_router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    employee = await get_employee_by_username(db, form_data.username)

    if not employee or employee.password != form_data.password:  # Replace with hashed check
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = generate_access_token(employee.id)
    return {
        "success": True,
        "message": "Login successful",
        "data": {
            "token": token,
            "type": "Bearer",
            "username": employee.username,
            "name": employee.name,
            "position": employee.position
        }
    }


