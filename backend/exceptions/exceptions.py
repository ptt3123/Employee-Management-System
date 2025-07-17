class EmployeeNotFoundException(Exception):
    def __init__(self, message: str = "Can not find employee"):
        self.message = message
        super().__init__(message)

class InvalidPaginationException(Exception):
    def __init__(self, message: str = "Page and page_size must be greater than 0"):
        self.message = message
        super().__init__(message)

class FieldExistsException(Exception):
    def __init__(self, message: str = "Field already exists"):
        self.message = message
        super().__init__(message)

class UnauthorizedException(Exception):
    def __init__(self, message: str = "Unauthorized"):
        self.message = message
        super().__init__(message)