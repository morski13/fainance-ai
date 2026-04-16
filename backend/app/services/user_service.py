from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories import user_repository
from app.schemas.user import UserCreate


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
        hashed_password=hashed_password
    )