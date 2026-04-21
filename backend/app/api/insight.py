from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.insight import Insight
from app.services.insight_service import get_insights

router = APIRouter()


@router.get("/insights", response_model=list[Insight])
def insights(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_insights(db, current_user.id)