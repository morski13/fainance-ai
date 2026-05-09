import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))
from random import choice, randint, uniform

from datetime import datetime, timedelta
from faker import Faker

import app.db.init_models
from app.db.session import SessionLocal
from app.models.user import User
from app.models.transaction import Transaction
from app.models.category import Category

fake = Faker()

db = SessionLocal()

USER_ARCHETYPES = [
    "impulsive",
    "balanced",
    "saver",
    "luxury",
]

CATEGORY_BEHAVIOR = {
    "impulsive": {
        "Shopping": (40, 250),
        "Hrana": (10, 40),
        "Prevoz": (5, 30),
    },
    "balanced": {
        "Shopping": (20, 80),
        "Hrana": (10, 30),
        "Prevoz": (5, 20),
    },
    "saver": {
        "Shopping": (5, 40),
        "Hrana": (5, 20),
        "Prevoz": (5, 15),
    },
    "luxury": {
        "Shopping": (100, 500),
        "Hrana": (30, 80),
        "Prevoz": (20, 60),
    },
}

categories = db.query(Category).all()

category_map = {c.name: c.id for c in categories}


def random_date():
    now = datetime.now()
    days_ago = randint(0, 90)

    return now - timedelta(days=days_ago)


def create_user(index):
    user = User(
        username=f"fake_user_{index}",
        email=f"fake{index}@fainance.ai",
        hashed_password="fakehashedpassword"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def create_transactions(user, archetype):
    behavior = CATEGORY_BEHAVIOR[archetype]

    for _ in range(randint(30, 80)):

        category_name = choice(list(behavior.keys()))

        min_amount, max_amount = behavior[category_name]

        transaction = Transaction(
            user_id=user.id,
            category_id=category_map[category_name],
            amount=round(uniform(min_amount, max_amount), 2),
            description=f"{archetype} spending",
            date=random_date()
        )

        db.add(transaction)

    db.commit()


def main():
    print("Generating fake users and transactions...")

    for i in range(50):

        archetype = choice(USER_ARCHETYPES)

        user = create_user(i)

        create_transactions(user, archetype)

        print(f"Created user {user.username} ({archetype})")

    print("Done.")


if __name__ == "__main__":
    main()