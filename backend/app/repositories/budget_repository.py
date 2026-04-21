from sqlalchemy.orm import Session

from app.models.budget import Budget


def create_budget(db: Session, user_id: int, month: str, total_limit):
    budget = Budget(
        user_id=user_id,
        month=month,
        total_limit=total_limit,
        spent_amount=0
    )
    db.add(budget)
    db.commit()
    db.refresh(budget)
    return budget


def get_budgets_by_user(db: Session, user_id: int):
    return db.query(Budget).filter(Budget.user_id == user_id).all()


def get_budget_by_id(db: Session, budget_id: int):
    return db.query(Budget).filter(Budget.id == budget_id).first()


def get_budget_by_user_and_month(db: Session, user_id: int, month: str):
    return db.query(Budget).filter(
        Budget.user_id == user_id,
        Budget.month == month
    ).first()