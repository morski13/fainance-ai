from fastapi import FastAPI
from sqlalchemy import text
from app.db.session import SessionLocal
from app.db.base import Base
from app.db.session import engine

Base.metadata.create_all(bind=engine)

from app.api import user

app = FastAPI()
app.include_router(user.router)



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

