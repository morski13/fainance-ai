from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.vault import Vault
from app.models.transaction import Transaction
from app.models.category import Category


def create_vault(
    db: Session,
    user_id: int,
    budget_id: int,
    goal_name: str,
    target_amount,
    locked_amount,
    locked_until
):
    vault = Vault(
        user_id=user_id,
        budget_id=budget_id,
        goal_name=goal_name,
        target_amount=target_amount,
        locked_amount=locked_amount,
        locked_until=locked_until,
        status="active"
    )
    db.add(vault)
    db.commit()
    db.refresh(vault)
    return vault


def get_vaults_by_user(db: Session, user_id: int):
    return db.query(Vault).filter(Vault.user_id == user_id).all()


def get_total_locked_for_budget(db: Session, budget_id: int):
    total = db.query(func.sum(Vault.locked_amount)) \
        .filter(Vault.budget_id == budget_id, Vault.status == "active") \
        .scalar()
    return total or 0


def get_average_essential_spending_last_3_months(db: Session, user_id: int):
    total = db.query(func.sum(Transaction.amount)) \
        .join(Category, Transaction.category_id == Category.id) \
        .filter(
            Transaction.user_id == user_id,
            Category.is_essential == True
        ) \
        .scalar()

    total = total or 0

    # MVP aproksimacija: ukupan essential spending / 3
    return total / 3 if total else 0

def get_vault_by_id(db: Session, vault_id: int):
    return db.query(Vault).filter(Vault.id == vault_id).first()