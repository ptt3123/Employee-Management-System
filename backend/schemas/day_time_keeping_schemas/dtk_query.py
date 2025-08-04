from pydantic import BaseModel, conint

class DTKQuery(BaseModel):
    year: conint(gt=2000)
    month: conint(gt=0, lt=13)
