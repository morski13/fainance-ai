from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories import receipt_repository
from app.services import transaction_service
from app.schemas.transaction import TransactionCreate


def create_receipt(db: Session, user_id: int, data):
    receipt = receipt_repository.create_receipt(
        db=db,
        user_id=user_id,
        image_path=data.image_path,
        amount=data.amount,
        category_id=data.category_id,
        vendor_name=data.vendor_name
    )

    # Ako receipt ima dovoljno podataka, automatski pravi transaction
    if data.amount is not None and data.category_id is not None:
        transaction_data = TransactionCreate(
            amount=data.amount,
            category_id=data.category_id,
            description=f"Receipt: {data.vendor_name}" if data.vendor_name else "Receipt import"
        )
        transaction_service.create_transaction(db, user_id, transaction_data)

    return receipt


def get_receipts_for_user(db: Session, user_id: int):
    return receipt_repository.get_receipts_by_user(db, user_id)


def get_receipt_for_user_by_id(db: Session, user_id: int, receipt_id: int):
    receipt = receipt_repository.get_receipt_by_id(db, receipt_id)

    if not receipt or receipt.user_id != user_id:
        raise HTTPException(status_code=404, detail="Receipt not found")

    return receipt