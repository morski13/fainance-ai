from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.optimizer import SavingsGoalRequest, SavingsGoalResponse
from app.services.optimizer_service import generate_savings_goal_plan

router = APIRouter()


@router.post("/optimizer/savings-goal", response_model=SavingsGoalResponse)
def savings_goal_optimizer(
    data: SavingsGoalRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return generate_savings_goal_plan(db, current_user.id, data)