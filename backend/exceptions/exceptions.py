from datetime import date
from typing import Optional

from pydantic import EmailStr


class HasRegisteredNextWeekException(Exception):
    def __init__(self, message: str = "Can not register next week again"):
        self.message = message
        super().__init__(message)

class NoScheduleRegisteredException(Exception):
    def __init__(self, message: str = "No schedule registered for today"):
        self.message = message
        super().__init__(message)

class InvalidCheckoutException(Exception):
    def __init__(self, message: str = "Can not checkout before checkin"):
        self.message = message
        super().__init__(message)

class InvalidCheckinCheckoutException(Exception):
    def __init__(self, message: str = "Can not checkin too soon or checkout too late"):
        self.message = message
        super().__init__(message)

class EmployeeNotFoundException(Exception):
    def __init__(self, message: str = "Can not find employee"):
        self.message = message
        super().__init__(message)

class ObjectNotFoundException(Exception):
    def __init__(self, not_found_object: Optional[str] = None):
        if not_found_object is not None:
            self.not_found_object = not_found_object
            message = f"Object {not_found_object} not found"
        else: message = "not found"

        super().__init__(message)

class InvalidPaginationException(Exception):
    def __init__(self, message: str = "Page and page_size must be greater than 0"):
        self.message = message
        super().__init__(message)

class FieldValueExistsException(Exception):
    def __init__(self, email: Optional[EmailStr] = None, phone_number: Optional[str] = None):
        parts = []
        if email:
            parts.append(f'Email "{email}"')
        if phone_number:
            parts.append(f'Phone number "{phone_number}"')
        message = " and ".join(parts) + " already exists"
        super().__init__(message)

class UnauthorizedException(Exception):
    def __init__(self, message: str = "Unauthorized"):
        self.message = message
        super().__init__(message)

class UsernameOrPasswordIncorrectException(Exception):
    def __init__(self, message: str = "Username or password is incorrect"):
        self.message = message
        super().__init__(message)

class PasswordIncorrectException(Exception):
    def __init__(self, message: str = "Password is incorrect"):
        self.message = message
        super().__init__(message)