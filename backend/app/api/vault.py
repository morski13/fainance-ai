from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.vault import VaultCreate, VaultResponse, VaultUnlockResponse
from app.services import vault_service

router = APIRouter()


@router.post("/vaults", response_model=VaultResponse)
def create_vault(
    data: VaultCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return vault_service.create_vault(db, current_user.id, data)


@router.get("/vaults", response_model=list[VaultResponse])
def get_vaults(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return vault_service.get_vaults_for_user(db, current_user.id)

@router.post("/vaults/{vault_id}/unlock-request", response_model=VaultUnlockResponse)
def unlock_request(
    vault_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return vault_service.request_unlock(db, current_user.id, vault_id)