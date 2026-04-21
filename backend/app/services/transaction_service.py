from datetime import datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.transaction import Transaction
from app.repositories import transaction_repository, budget_repository


def create_transaction(db: Session, user_id: int, data):
    # 1. Kreiraj transaction
    transaction = Transaction(
        user_id=user_id,
        category_id=data.category_id,
        amount=data.amount,
        description=data.description,
        date=datetime.utcnow()
    )

    transaction = transaction_repository.create_transaction(db, transaction)

    # 2. Pronađi budžet za trenutni mesec
    current_month = datetime.utcnow().strftime("%Y-%m")

    budget = budget_repository.get_budget_by_user_and_month(
        db, user_id, current_month
    )

    if not budget:
        raise HTTPException(
            status_code=400,
            detail="No budget for current month"
        )

    # 3. Update budget
    budget.spent_amount += data.amount
    db.commit()

    return transaction