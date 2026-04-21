from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.budget import BudgetCreate, BudgetResponse
from app.services import budget_service

router = APIRouter()


@router.post("/budgets", response_model=BudgetResponse)
def create_budget(
    budget_data: BudgetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return budget_service.create_budget(db, current_user.id, budget_data)


@router.get("/budgets", response_model=list[BudgetResponse])
def get_budgets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return budget_service.get_budgets_for_user(db, current_user.id)


@router.get("/budgets/{budget_id}", response_model=BudgetResponse)
def get_budget(
    budget_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return budget_service.get_budget_for_user_by_id(db, current_user.id, budget_id)