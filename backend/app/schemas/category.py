from pydantic import BaseModel


class CategoryResponse(BaseModel):
    id: int
    name: str
    is_essential: bool

    class Config:
        from_attributes = True