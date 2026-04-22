from pydantic import BaseModel
from decimal import Decimal


class CategoryBreakdown(BaseModel):
    category: str
    amount: Decimal


class DashboardResponse(BaseModel):
    total_spent: Decimal
    budget_limit: Decimal
    remaining: Decimal

    locked_amount: Decimal
    available_to_spend: Decimal

    category_breakdown: list[CategoryBreakdown]