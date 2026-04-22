from datetime import datetime
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories import budget_repository, vault_repository
from app.schemas.vault import VaultCreate


def create_vault(db: Session, user_id: int, data: VaultCreate):
    current_month = datetime.utcnow().strftime("%Y-%m")

    budget = budget_repository.get_budget_by_user_and_month(db, user_id, current_month)
    if not budget:
        raise HTTPException(status_code=400, detail="No budget for current month")

    already_locked = vault_repository.get_total_locked_for_budget(db, budget.id)

    remaining_budget = budget.total_limit - budget.spent_amount - already_locked

    essential_reserve = vault_repository.get_average_essential_spending_last_3_months(
        db, user_id
    )

    max_lockable = remaining_budget - essential_reserve

    if data.locked_amount <= 0:
        raise HTTPException(status_code=400, detail="Locked amount must be greater than 0")

    if data.locked_amount > max_lockable:
        raise HTTPException(
            status_code=400,
            detail=(
                f"You can lock at most {max_lockable:.2f}. "
                f"Essential reserve is {essential_reserve:.2f}"
            )
        )

    return vault_repository.create_vault(
        db=db,
        user_id=user_id,
        budget_id=budget.id,
        goal_name=data.goal_name,
        target_amount=data.target_amount,
        locked_amount=data.locked_amount,
        locked_until=data.locked_until
    )


def get_vaults_for_user(db: Session, user_id: int):
    return vault_repository.get_vaults_by_user(db, user_id)

def request_unlock(db: Session, user_id: int, vault_id: int):
    vault = vault_repository.get_vault_by_id(db, vault_id)

    if not vault or vault.user_id != user_id:
        raise HTTPException(status_code=404, detail="Vault not found")

    if vault.status != "active":
        raise HTTPException(
            status_code=400,
            detail="Unlock request can only be made for active vaults"
        )

    vault.status = "unlock_requested"
    db.commit()
    db.refresh(vault)

    return {
        "message": (
            "Early unlock requested. This may delay your savings goal "
            "and reduce your protected budget."
        ),
        "vault_id": vault.id,
        "status": vault.status
    }