from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


class VaultCreate(BaseModel):
    goal_name: str
    target_amount: Decimal
    locked_amount: Decimal
    locked_until: datetime


class VaultResponse(BaseModel):
    id: int
    user_id: int
    budget_id: int
    goal_name: str
    target_amount: Decimal
    locked_amount: Decimal
    locked_until: datetime
    status: str
    created_at: datetime

class VaultUnlockResponse(BaseModel):
    message: str
    vault_id: int
    status: str

    class Config:
        from_attributes = True