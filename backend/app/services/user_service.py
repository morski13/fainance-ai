from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories import user_repository
from app.schemas.user import UserCreate
from app.core.security import hash_password


def create_user(db: Session, user_data: UserCreate):
    existing_email = user_repository.get_user_by_email(db, user_data.email)
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    existing_username = user_repository.get_user_by_username(db, user_data.username)
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")

    hashed_password = user_data.password + "_hashed"

    return user_repository.create_user(
        db=db,
        username=user_data.username,
        email=user_data.email,
        hashed_password = hash_password(user_data.password)
    )

def get_all_users(db: Session):
    return user_repository.get_all_users(db)


def get_user_by_id(db: Session, user_id: int):
    user = user_repository.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

    from fastapi import HTTPException

from app.core.security import verify_password, create_access_token
from fastapi import HTTPException


def login_user_by_username(db: Session, username: str, password: str):
    user = user_repository.get_user_by_username(db, username)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "access_token": create_access_token(data={"sub": user.email}),
        "token_type": "bearer"
    }

from app.core.security import verify_password, create_access_token
from app.schemas.user import UserLogin


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

def login_user_by_username(db: Session, username: str, password: str):
    user = user_repository.get_user_by_username(db, username)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(data={"sub": user.username})

    return {
        "access_token": token,
        "token_type": "bearer"
    }