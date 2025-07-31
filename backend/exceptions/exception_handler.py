from fastapi import Request
from fastapi.logger import logger
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from pydantic import ValidationError
from starlette.responses import Response
from sqlalchemy.exc import SQLAlchemyError
from exceptions.exceptions import *

def http_exception_handler(request: Request, exc: Exception) -> Response:
    if not isinstance(exc, HTTPException):
        logger.error(f"Unexpected exception in http_exception_handler: {str(exc)}")
        return JSONResponse(status_code=500, content={'success': False, "error": "Internal Server Error"})
    logger.warning(f"HTTP error: {exc.detail}")
    return JSONResponse(status_code=exc.status_code, content={
        'success': False,
        "error": exc.detail
    })

def value_error_handler(request: Request, exc: Exception) -> Response:
    if not isinstance(exc, ValueError):
        logger.error(f"Unexpected exception in employee_not_found_handler: {str(exc)}")
        return JSONResponse(status_code=500, content={'success': False, "error": "Internal Server Error"})
    return JSONResponse(
        status_code=422,
        content={'success': False, "error": str(exc)},
    )

def validation_error_handler(request: Request, exc: Exception) -> Response:
    if not isinstance(exc, ValidationError):
        logger.error(f"Unexpected exception in employee_not_found_handler: {str(exc)}")
        return JSONResponse(status_code=500, content={'success': False, "error": "Internal Server Error"})
    return JSONResponse(
        status_code=422,
        content={'success': False, "error": str(exc)},
    )

def sqlalchemy_exception_handler(request: Request, exc: Exception) -> Response:
    if not isinstance(exc, SQLAlchemyError):
        logger.error(f"Unexpected exception in sqlalchemy_exception_handler: {str(exc)}")
        return JSONResponse(status_code=500, content={'success': False, "error": "Internal Server Error"})
    logger.error(f"Database error: {str(exc)}")
    return JSONResponse(status_code=500, content={'success': False, "error": "Database operation failed"})

def employee_not_found_handler(request: Request, exc: Exception) -> Response:
    if not isinstance(exc, EmployeeNotFoundException):
        logger.error(f"Unexpected exception in employee_not_found_handler: {str(exc)}")
        return JSONResponse(status_code=500, content={'success': False, "error": "Internal Server Error"})
    return JSONResponse(
        status_code=404,
        content={'success': False, "error": "Employee not found"}
    )

def object_not_found_handler(request: Request, exc: Exception) -> Response:
    if not isinstance(exc, ObjectNotFoundException):
        logger.error(f"Unexpected exception in object_not_found_handler: {str(exc)}")
        return JSONResponse(status_code=500, content={'success': False, "error": "Internal Server Error"})
    return JSONResponse(
        status_code=404,
        content={'success': False, "error": exc.message}
    )

def has_registered_next_week_handler(request: Request, exc: Exception) -> Response:
    if not isinstance(exc, HasRegisteredNextWeekException):
        logger.error(f"Unexpected exception in has_registered_next_week_handler: {str(exc)}")
        return JSONResponse(status_code=500, content={'success': False, "error": "Internal Server Error"})
    return JSONResponse(
        status_code=400,
        content={'success': False, "error": exc.message}
    )

def no_schedule_registered_handler(request: Request, exc: Exception) -> Response:
    if not isinstance(exc, NoScheduleRegisteredException):
        logger.error(f"Unexpected exception in no_schedule_registered_handler: {str(exc)}")
        return JSONResponse(status_code=500, content={'success': False, "error": "Internal Server Error"})
    return JSONResponse(
        status_code=404,
        content={'success': False, "error": exc.message}
    )

def invalid_checkout_handler(request: Request, exc: Exception) -> Response:
    if not isinstance(exc, InvalidCheckoutException):
        logger.error(f"Unexpected exception in invalid_checkout_handler: {str(exc)}")
        return JSONResponse(status_code=500, content={'success': False, "error": "Internal Server Error"})
    return JSONResponse(
        status_code=400,
        content={'success': False, "error": exc.message}
    )

def invalid_checkin_checkout_handler(request: Request, exc: Exception) -> Response:
    if not isinstance(exc, InvalidCheckinCheckoutException):
        logger.error(f"Unexpected exception in invalid_checkin_checkout_handler: {str(exc)}")
        return JSONResponse(status_code=500, content={'success': False, "error": "Internal Server Error"})
    return JSONResponse(
        status_code=400,
        content={'success': False, "error": exc.message}
    )

def invalid_pagination_handler(request: Request, exc: Exception) -> Response:
    if not isinstance(exc, InvalidPaginationException):
        logger.error(f"Unexpected exception in invalid_pagination_handler: {str(exc)}")
        return JSONResponse(status_code=500, content={'success': False, "error": "Internal Server Error"})
    return JSONResponse(
        status_code=400,
        content={'success': False, "error": exc.message}
    )

def fields_value_exist_handler(request: Request, exc: Exception) -> Response:
    if not isinstance(exc, FieldValueExistsException):
        logger.error(f"Unexpected exception in fields_exist_handler: {str(exc)}")
        return JSONResponse(status_code=500, content={'success': False, "error": "Internal Server Error"})
    return JSONResponse(
        status_code=409,
        content={'success': False, "error": exc.message}
    )

def unauthorized_exception_handler(request: Request, exc: Exception) -> Response:
    if not isinstance(exc, UnauthorizedException):
        logger.error(f"Unexpected exception in unauthorized_exception_handler: {str(exc)}")
        return JSONResponse(status_code=500, content={'success': False, "error": "Internal Server Error"})
    return JSONResponse(
        status_code=401,
        content={'success': False, "error": exc.message}
    )

def fallback_exception_handler(request: Request, exc: Exception) -> Response:
    if not isinstance(exc, Exception):
        logger.error(f"Unexpected exception in fallback_exception_handler: {str(exc)}")
        return JSONResponse(status_code=500, content={'success': False, "error": "Internal Server Error"})
    return JSONResponse(
        status_code=500,
        content={'success': False, "error": "Internal Server Error"}
    )

def username_password_incorrect_handler(request: Request, exc: Exception) -> Response:
    if not isinstance(exc, UsernameOrPasswordIncorrectException):
        logger.error(f"Unexpected exception in username_password_incorrect_handler: {str(exc)}")
        return JSONResponse(status_code=500, content={'success': False, "error": "Internal Server Error"})

    return JSONResponse(
        status_code=401,
        content={'success': False, "error": exc.message}
    )

def password_incorrect_handler(request: Request, exc: Exception) -> Response:
    if not isinstance(exc, PasswordIncorrectException):
        logger.error(f"Unexpected exception in password_incorrect_handler: {str(exc)}")
        return JSONResponse(status_code=500, content={'success': False, "error": "Internal Server Error"})

    return JSONResponse(
        status_code=401,
        content={'success': False, "error": exc.message}
    )

def request_in_processing_handler(request: Request, exc: Exception) -> Response:
    if not isinstance(exc, RequestInProcessingException):
        logger.error(f"Unexpected exception in request_in_processing_handler: {str(exc)}")
        return JSONResponse(status_code=500, content={'success': False, "error": "Internal Server Error"})

    return JSONResponse(
        status_code=400,
        content={'success': False, "error": exc.message}
    )
