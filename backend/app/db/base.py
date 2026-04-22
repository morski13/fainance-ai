from sqlalchemy.orm import declarative_base

Base = declarative_base()

# 🔥 BITNO — import svih modela
from app.models.user import User
from app.models.budget import Budget
from app.models.category import Category
from app.models.transaction import Transaction
from app.models.vault import Vault
from app.models.receipt import Receipt