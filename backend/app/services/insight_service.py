from datetime import datetime
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.transaction import Transaction
from app.models.category import Category
from app.repositories import budget_repository


def get_insights(db: Session, user_id: int):
    insights = []

    current_month = datetime.utcnow().strftime("%Y-%m")

    budget = budget_repository.get_budget_by_user_and_month(
        db, user_id, current_month
    )

    if not budget:
        return insights

    # 1. Total spent
    total_spent = db.query(func.sum(Transaction.amount)) \
        .filter(Transaction.user_id == user_id) \
        .scalar() or 0

    # 2. Spending by category
    breakdown = db.query(
        Category.name,
        func.sum(Transaction.amount)
    ).join(Transaction, Transaction.category_id == Category.id) \
     .filter(Transaction.user_id == user_id) \
     .group_by(Category.name) \
     .all()

    # 🔥 RULE 1: Ako neka kategorija prelazi 40%
    for name, amount in breakdown:
        if total_spent > 0:
            percentage = amount / total_spent

            if percentage > 0.4:
                insights.append({
                    "type": "warning",
                    "message": f"Trošiš {int(percentage * 100)}% budžeta na {name}"
                })

    # 🔥 RULE 2: Ako si prešao 80% budžeta
    if total_spent > 0 and budget.total_limit > 0:
        usage = total_spent / budget.total_limit

        if usage > 0.8:
            insights.append({
                "type": "warning",
                "message": "Blizu si limita budžeta"
            })

        # 🔥 RULE 3: Projekcija
        if usage > 1:
            insights.append({
                "type": "warning",
                "message": "Prešao si budžet"
            })
        elif usage > 0.5:
            insights.append({
                "type": "info",
                "message": "Ako nastaviš ovim tempom, probićeš budžet"
            })

    # 🔥 RULE 4: Ako nema troškova
    if total_spent == 0:
        insights.append({
            "type": "info",
            "message": "Još nemaš troškova za ovaj mesec"
        })

    return insights