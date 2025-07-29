from fastapi import FastAPI
from sqlalchemy.exc import SQLAlchemyError

from fastapi.exceptions import HTTPException

from apis.routes import router

from exceptions.exception_handler import (
    http_exception_handler,
    sqlalchemy_exception_handler,
    employee_not_found_handler,
    invalid_pagination_handler,
    fallback_exception_handler, fields_value_exist_handler, unauthorized_exception_handler,
    username_password_incorrect_handler, password_incorrect_handler, object_not_found_handler,
)
from exceptions.exceptions import EmployeeNotFoundException, InvalidPaginationException, FieldValueExistsException, \
    UnauthorizedException, UsernameOrPasswordIncorrectException, PasswordIncorrectException, ObjectNotFoundException

app = FastAPI()


app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
app.add_exception_handler(EmployeeNotFoundException, employee_not_found_handler)
app.add_exception_handler(InvalidPaginationException, invalid_pagination_handler)
app.add_exception_handler(FieldValueExistsException, fields_value_exist_handler)
app.add_exception_handler(UnauthorizedException, unauthorized_exception_handler)
app.add_exception_handler(UsernameOrPasswordIncorrectException, username_password_incorrect_handler)
app.add_exception_handler(PasswordIncorrectException, password_incorrect_handler)
app.add_exception_handler(ObjectNotFoundException, object_not_found_handler)
app.add_exception_handler(Exception, fallback_exception_handler)

app.include_router(router)