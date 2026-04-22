from sqlalchemy.orm import Session

from app.models.category import Category


def seed_categories(db: Session):
    categories = [
        {"name": "Racuni", "is_essential": True},
        {"name": "Subscriptions", "is_essential": True},
        {"name": "Hrana", "is_essential": True},
        {"name": "Prevoz", "is_essential": False},
        {"name": "Shopping", "is_essential": False},
        {"name": "Kuca", "is_essential": False},
        {"name": "Zdravlje", "is_essential": False},
        {"name": "Obrazovanje", "is_essential": False},
    ]

    for item in categories:
        exists = db.query(Category).filter(Category.name == item["name"]).first()
        if not exists:
            db.add(
                Category(
                    name=item["name"],
                    is_essential=item["is_essential"]
                )
            )

    db.commit()