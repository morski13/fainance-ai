from sqlalchemy.orm import Session
from app.models.user import User
from fastapi import HTTPException
from app.core.security import verify_password, create_access_token
from app.schemas.user import UserLogin


def create_user(db: Session, username: str, email: str, hashed_password: str):
    user = User(
        username=username,
        email=email,
        hashed_password=hashed_password
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_all_users(db: Session):
    return db.query(User).all()

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def login_user(db: Session, user_data: UserLogin):
    user = user_repository.get_user_by_email(db, user_data.email)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(data={"sub": user.email})

    return {
        "access_token": token,
        "token_type": "bearer"
    }

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()