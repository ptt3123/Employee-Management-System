# app run here
import logging
from fastapi import FastAPI
from sqlalchemy.exc import SQLAlchemyError

from fastapi.exceptions import HTTPException

from apis.employee_apis.auth_api import auth_router
from apis.routes import router

from exceptions.exception_handler import (
    http_exception_handler,
    sqlalchemy_exception_handler,
    employee_not_found_handler,
    invalid_pagination_handler,
    fallback_exception_handler,
    email_already_exists_handler,
    phone_number_already_exists_handler,
    username_already_exists_handler
)
from exceptions.exceptions import EmployeeNotFoundException, InvalidPaginationException, EmailAlreadyExistsException, \
    PhoneNumberAlreadyExistsException, UsernameAlreadyExistsException


app = FastAPI()


app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
app.add_exception_handler(EmployeeNotFoundException, employee_not_found_handler)
app.add_exception_handler(InvalidPaginationException, invalid_pagination_handler)
app.add_exception_handler(EmailAlreadyExistsException, email_already_exists_handler)
app.add_exception_handler(PhoneNumberAlreadyExistsException, phone_number_already_exists_handler)
app.add_exception_handler(UsernameAlreadyExistsException, username_already_exists_handler)
app.add_exception_handler(Exception, fallback_exception_handler)

app.include_router(auth_router)
app.include_router(router)