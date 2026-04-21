from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


class BudgetCreate(BaseModel):
    month: str
    total_limit: Decimal


class BudgetResponse(BaseModel):
    id: int
    user_id: int
    month: str
    total_limit: Decimal
    spent_amount: Decimal
    created_at: datetime

    class Config:
        from_attributes = True