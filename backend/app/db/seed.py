from sqlalchemy.orm import Session

from app.models.category import Category


def seed_categories(db: Session):
    categories = [
        "Racuni",
        "Subscriptions",
        "Hrana",
        "Prevoz",
        "Shopping",
        "Kuca",
        "Zdravlje",
        "Obrazovanje"
    ]

    for name in categories:
        exists = db.query(Category).filter(Category.name == name).first()
        if not exists:
            db.add(Category(name=name))

    db.commit()