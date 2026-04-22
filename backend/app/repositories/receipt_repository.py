from datetime import datetime
from sqlalchemy.orm import Session

from app.models.receipt import Receipt


def create_receipt(
    db: Session,
    user_id: int,
    image_path: str,
    amount=None,
    category_id=None,
    vendor_name=None
):
    receipt = Receipt(
        user_id=user_id,
        image_path=image_path,
        amount=amount,
        category_id=category_id,
        vendor_name=vendor_name,
        parsed_at=datetime.utcnow() if amount is not None else None
    )
    db.add(receipt)
    db.commit()
    db.refresh(receipt)
    return receipt


def get_receipts_by_user(db: Session, user_id: int):
    return db.query(Receipt).filter(Receipt.user_id == user_id).all()


def get_receipt_by_id(db: Session, receipt_id: int):
    return db.query(Receipt).filter(Receipt.id == receipt_id).first()