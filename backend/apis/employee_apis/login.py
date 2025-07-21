from fastapi import APIRouter, HTTPException,status
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm

from cruds.employee_crud import get_current_employee
from database import get_db
from utils.generate_token import generate_access_token
from utils.verify_password import verify_password

login_router = APIRouter()

@login_router.post("/login")
async def login(
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: AsyncSession = Depends(get_db)
    ):
    employee = await get_current_employee(db,'username', form_data.username)

    if not employee or not verify_password(form_data.password, employee.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = generate_access_token(
        employee_id= employee.id,
        employee_role= employee.role,
        employee_name= employee.name
    )
    return {
        "access_token": token,
        "token_type": "bearer"
    }