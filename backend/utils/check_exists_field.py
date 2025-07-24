from pydantic import EmailStr
from sqlalchemy.ext.asyncio import AsyncSession

from cruds.employee_crud import get_current_employee
from exceptions.exceptions import FieldValueExistsException


async def check_exists_field(db: AsyncSession, email: EmailStr, phone_number: str ):
    exists_email = False
    exists_phone_number = False

    if(await get_current_employee(db= db, field="email", value=email)):
        exists_email = True
    if(await get_current_employee(db= db, field="phone_number", value=phone_number)):
        exists_email = True

    if (exists_email and exists_phone_number):
        raise FieldValueExistsException(email=exists_email, phone_number=exists_phone_number)

    if(exists_email):
        raise FieldValueExistsException(email=exists_email)

    if(exists_phone_number):
        raise FieldValueExistsException(phone_number=exists_phone_number)