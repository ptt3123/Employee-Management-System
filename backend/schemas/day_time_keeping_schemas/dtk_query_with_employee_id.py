from pydantic import conint

from schemas.day_time_keeping_schemas.dtk_query import DTKQuery

class DTKWithEmployeeId(DTKQuery):
    employee_id: conint(ge=0)