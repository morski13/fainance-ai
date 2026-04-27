from decimal import Decimal
from pydantic import BaseModel


class SavingsGoalRequest(BaseModel):
    goal_amount: Decimal
    months: int


class ReductionPlanItem(BaseModel):
    category: str
    current_spending: Decimal
    recommended_cut: Decimal


class SavingsGoalResponse(BaseModel):
    goal_amount: Decimal
    months: int
    monthly_savings_needed: Decimal
    reduction_plan: list[ReductionPlanItem]