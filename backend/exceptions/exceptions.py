from typing import Optional

from pydantic import EmailStr


class EmployeeNotFoundException(Exception):
    def __init__(self, message: str = "Can not find employee"):
        self.message = message
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