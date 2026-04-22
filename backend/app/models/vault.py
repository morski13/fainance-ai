from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship

from app.db.base import Base


class Vault(Base):
    __tablename__ = "vaults"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    budget_id = Column(Integer, ForeignKey("budgets.id"), nullable=False)

    goal_name = Column(String, nullable=False)
    target_amount = Column(Numeric(10, 2), nullable=False)
    locked_amount = Column(Numeric(10, 2), nullable=False)

    locked_until = Column(DateTime, nullable=False)
    status = Column(String, default="active", nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", backref="vaults")
    budget = relationship("Budget", backref="vaults")