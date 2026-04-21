from pydantic import BaseModel

class Insight(BaseModel):
    type:str
    message:str