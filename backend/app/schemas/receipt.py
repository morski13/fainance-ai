from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel


class ReceiptCreate(BaseModel):
    image_path: str
    amount: Decimal | None = None
    category_id: int | None = None
    vendor_name: str | None = None


class ReceiptResponse(BaseModel):
    id: int
    user_id: int
    category_id: int | None
    image_path: str
    amount: Decimal | None
    vendor_name: str | None
    parsed_at: datetime | None
    created_at: datetime

    class Config:
        from_attributes = True