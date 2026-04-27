from decimal import Decimal, ROUND_HALF_UP

from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.transaction import Transaction
from app.models.category import Category
from app.schemas.optimizer import SavingsGoalRequest


def money(value) -> Decimal:
    return Decimal(value).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def generate_savings_goal_plan(
    db: Session,
    user_id: int,
    data: SavingsGoalRequest
):
    if data.months <= 0:
        raise HTTPException(status_code=400, detail="Months must be greater than 0")

    if data.goal_amount <= 0:
        raise HTTPException(status_code=400, detail="Goal amount must be greater than 0")

    monthly_savings_needed = money(data.goal_amount / data.months)

    spending_by_category = (
        db.query(
            Category.name,
            Category.is_essential,
            func.sum(Transaction.amount).label("total")
        )
        .join(Transaction, Transaction.category_id == Category.id)
        .filter(Transaction.user_id == user_id)
        .group_by(Category.name, Category.is_essential)
        .all()
    )

    reducible_categories = [
        {
            "category": name,
            "current_spending": money(total),
            "is_essential": is_essential,
        }
        for name, is_essential, total in spending_by_category
        if not is_essential
    ]

    if not reducible_categories:
        return {
            "goal_amount": data.goal_amount,
            "months": data.months,
            "monthly_savings_needed": monthly_savings_needed,
            "reduction_plan": []
        }

    total_reducible_spending = sum(
        item["current_spending"] for item in reducible_categories
    )

    reduction_plan = []

    for item in reducible_categories:
        share = item["current_spending"] / total_reducible_spending

        recommended_cut = money(monthly_savings_needed * share)

        # Ne preporučujemo da se kategorija smanji više od 60%
        max_reasonable_cut = money(item["current_spending"] * Decimal("0.60"))

        if recommended_cut > max_reasonable_cut:
            recommended_cut = max_reasonable_cut

        reduction_plan.append({
            "category": item["category"],
            "current_spending": item["current_spending"],
            "recommended_cut": recommended_cut
        })

    return {
        "goal_amount": data.goal_amount,
        "months": data.months,
        "monthly_savings_needed": monthly_savings_needed,
        "reduction_plan": reduction_plan
    }