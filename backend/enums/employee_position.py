from enum import Enum

class EmployeePosition(str, Enum):
    IT = "IT"
    QA = "QA"
    BA = "BA"
    TESTER = "TESTER"
    PM = "PM"