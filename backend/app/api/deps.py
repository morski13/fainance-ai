from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.security import SECRET_KEY, ALGORITHM
from app.db.session import get_db
from app.repositories import user_repository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    print("RAW TOKEN:", token)

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("PAYLOAD:", payload)

        username: str | None = payload.get("sub")
        print("SUB:", username)

        if username is None:
            raise credentials_exception
    except JWTError as e:
        print("JWT ERROR:", e)
        raise credentials_exception

    user = user_repository.get_user_by_username(db, username)
    print("USER FOUND:", user)

    if user is None:
        raise credentials_exception

    return user