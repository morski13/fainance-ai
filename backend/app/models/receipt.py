from datetime import datetime

from sqlalchemy import Column, Integer, ForeignKey, Numeric, DateTime, String
from sqlalchemy.orm import relationship

from app.db.base import Base


class Receipt(Base):
    __tablename__ = "receipts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)

    image_path = Column(String, nullable=False)
    amount = Column(Numeric(10, 2), nullable=True)
    vendor_name = Column(String, nullable=True)

    parsed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", backref="receipts")
    category = relationship("Category")