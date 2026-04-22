from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.receipt import ReceiptCreate, ReceiptResponse
from app.services import receipt_service

router = APIRouter()


@router.post("/receipts", response_model=ReceiptResponse)
def create_receipt(
    data: ReceiptCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return receipt_service.create_receipt(db, current_user.id, data)


@router.get("/receipts", response_model=list[ReceiptResponse])
def get_receipts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return receipt_service.get_receipts_for_user(db, current_user.id)


@router.get("/receipts/{receipt_id}", response_model=ReceiptResponse)
def get_receipt(
    receipt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return receipt_service.get_receipt_for_user_by_id(
        db,
        current_user.id,
        receipt_id
    )