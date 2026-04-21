from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel


class TransactionCreate(BaseModel):
    amount: Decimal
    category_id: int
    description: str | None = None


class TransactionResponse(BaseModel):
    id: int
    amount: Decimal
    category_id: int
    description: str | None
    date: datetime

    class Config:
        from_attributes = True