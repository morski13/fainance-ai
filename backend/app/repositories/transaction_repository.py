from sqlalchemy.orm import Session

from app.models.transaction import Transaction


def create_transaction(db: Session, transaction: Transaction):
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction


def get_transactions_by_user(db: Session, user_id: int):
    return db.query(Transaction).filter(Transaction.user_id == user_id).all()