from datetime import datetime
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.transaction import Transaction
from app.models.category import Category
from app.repositories import budget_repository


def get_dashboard(db: Session, user_id: int):
    current_month = datetime.utcnow().strftime("%Y-%m")

    # 1. Budget
    budget = budget_repository.get_budget_by_user_and_month(
        db, user_id, current_month
    )

    if not budget:
        return {
            "total_spent": 0,
            "budget_limit": 0,
            "remaining": 0,
            "category_breakdown": []
        }

    # 2. Total spent
    total_spent = db.query(func.sum(Transaction.amount)) \
        .filter(Transaction.user_id == user_id) \
        .scalar() or 0

    # 3. Category breakdown
    breakdown = db.query(
        Category.name,
        func.sum(Transaction.amount)
    ).join(Transaction, Transaction.category_id == Category.id) \
     .filter(Transaction.user_id == user_id) \
     .group_by(Category.name) \
     .all()

    category_breakdown = [
        {"category": name, "amount": amount}
        for name, amount in breakdown
    ]

    # 4. Remaining
    remaining = budget.total_limit - total_spent

    return {
        "total_spent": total_spent,
        "budget_limit": budget.total_limit,
        "remaining": remaining,
        "category_breakdown": category_breakdown
    }