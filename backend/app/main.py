from fastapi import FastAPI
from sqlalchemy import text
from app.db.session import SessionLocal
from app.db.base import Base
from app.db.session import engine
from app.api import budgets
from app.db.seed import seed_categories
from app.db.session import SessionLocal
from app.api import user
from app.api import category
from app.api import transaction
from app.api import dashboard
from app.api import insight

Base.metadata.create_all(bind=engine)
db = SessionLocal()
seed_categories(db)
db.close()

app = FastAPI()
app.include_router(user.router)
app.include_router(budgets.router)
app.include_router(transaction.router)
app.include_router(category.router)
app.include_router(dashboard.router)
app.include_router(insight.router)


@app.get("/")
async def root():
    return {"message": "FaiNance API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/db-check")
def db_check():
    db=SessionLocal()
    try:
        result = db.execute(text("SELECT 1"))
        value = result.scalar()
        return {"database": "connected", "result": value}
    finally:
        db.close()

