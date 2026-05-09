"use client";

import { FormEvent, useState } from "react";
import { generateSavingsPlan } from "@/lib/api";

type ReductionPlanItem = {
  category: string;
  current_spending: string;
  recommended_cut: string;
};

type SavingsPlan = {
  goal_amount: string;
  months: number;
  monthly_savings_needed: string;
  reduction_plan: ReductionPlanItem[];
};

export default function SavingsOptimizer() {
  const [goalAmount, setGoalAmount] = useState("");
  const [months, setMonths] = useState("");
  const [plan, setPlan] = useState<SavingsPlan | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setPlan(null);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in.");
      return;
    }

    try {
      setLoading(true);

      const data = await generateSavingsPlan(token, {
        goal_amount: Number(goalAmount),
        months: Number(months),
      });

      setPlan(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate plan"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-neutral-900 p-6">
      <h2 className="text-xl font-semibold">Savings Goal Optimizer</h2>
      <p className="mt-2 text-sm text-neutral-400">
        Generate a monthly reduction plan based on your spending behavior.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm text-neutral-300">
            Goal amount
          </label>
          <input
            type="number"
            step="0.01"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 outline-none focus:border-neutral-600"
            placeholder="700"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-neutral-300">
            Months
          </label>
          <input
            type="number"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 outline-none focus:border-neutral-600"
            placeholder="3"
            required
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white px-4 py-3 font-medium text-black transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate plan"}
          </button>
        </div>
      </form>

      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}

      {plan ? (
        <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-950 p-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-neutral-400">Monthly saving needed</p>
              <p className="mt-1 text-2xl font-bold">
                €{plan.monthly_savings_needed}
              </p>
            </div>

            <div className="text-sm text-neutral-400">
              Goal: €{plan.goal_amount} / {plan.months} months
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {plan.reduction_plan.length === 0 ? (
              <p className="rounded-xl bg-neutral-900 p-4 text-sm text-neutral-400">
                No reducible spending patterns detected yet. Add more
                non-essential transactions to improve recommendations.
              </p>
            ) : (
              plan.reduction_plan.map((item) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between rounded-xl bg-neutral-900 p-4"
                >
                  <div>
                    <p className="font-medium">{item.category}</p>
                    <p className="text-sm text-neutral-400">
                      Current spending: €{item.current_spending}
                    </p>
                  </div>

                  <p className="font-semibold">
                    -€{item.recommended_cut}/month
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}