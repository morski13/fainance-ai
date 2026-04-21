from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories import budget_repository
from app.schemas.budget import BudgetCreate


def create_budget(db: Session, user_id: int, budget_data: BudgetCreate):
    existing_budget = budget_repository.get_budget_by_user_and_month(
        db, user_id, budget_data.month
    )

    if existing_budget:
        raise HTTPException(
            status_code=400,
            detail="Budget for this month already exists"
        )

    return budget_repository.create_budget(
        db=db,
        user_id=user_id,
        month=budget_data.month,
        total_limit=budget_data.total_limit
    )


def get_budgets_for_user(db: Session, user_id: int):
    return budget_repository.get_budgets_by_user(db, user_id)


def get_budget_for_user_by_id(db: Session, user_id: int, budget_id: int):
    budget = budget_repository.get_budget_by_id(db, budget_id)

    if not budget or budget.user_id != user_id:
        raise HTTPException(status_code=404, detail="Budget not found")

    return budget