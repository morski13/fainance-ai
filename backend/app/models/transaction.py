from datetime import datetime

from sqlalchemy import Column, Integer, ForeignKey, Numeric, DateTime, String
from sqlalchemy.orm import relationship

from app.db.base import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)

    amount = Column(Numeric(10, 2), nullable=False)
    description = Column(String, nullable=True)

    date = Column(DateTime, default=datetime.utcnow)
    source = Column(String, default="manual")  # manual / receipt

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", backref="transactions")
    category = relationship("Category")