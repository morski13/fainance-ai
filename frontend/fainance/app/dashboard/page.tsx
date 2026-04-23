"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";

const API_BASE_URL = "http://127.0.0.1:8000";

type DashboardData = {
  total_spent: string;
  budget_limit: string;
  remaining: string;
  locked_amount: string;
  available_to_spend: string;
  category_breakdown: { category: string; amount: string }[];
};

type Insight = {
  type: string;
  message: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/");
        return;
      }

      try {
        const [dashboardRes, insightsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/dashboard`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE_URL}/insights`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!dashboardRes.ok || !insightsRes.ok) {
          localStorage.removeItem("token");
          router.push("/");
          return;
        }

        const dashboardData = await dashboardRes.json();
        const insightsData = await insightsRes.json();

        setDashboard(dashboardData);
        setInsights(insightsData);
      } catch {
        localStorage.removeItem("token");
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <p className="text-neutral-400">Loading dashboard...</p>
      </main>
    );
  }

  if (!dashboard) {
    return null;
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Navigation/>

        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">FaiNance</h1>
            <p className="mt-2 text-neutral-400">
              Smart personal finance dashboard
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-neutral-700 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-900"
          >
            Logout
          </button>
        </header>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-neutral-900 p-6">
            <p className="text-sm text-neutral-400">Budget Limit</p>
            <h2 className="mt-2 text-2xl font-semibold">
              €{dashboard.budget_limit}
            </h2>
          </div>

          <div className="rounded-2xl bg-neutral-900 p-6">
            <p className="text-sm text-neutral-400">Total Spent</p>
            <h2 className="mt-2 text-2xl font-semibold">
              €{dashboard.total_spent}
            </h2>
          </div>

          <div className="rounded-2xl bg-neutral-900 p-6">
            <p className="text-sm text-neutral-400">Locked Amount</p>
            <h2 className="mt-2 text-2xl font-semibold">
              €{dashboard.locked_amount}
            </h2>
          </div>

          <div className="rounded-2xl bg-neutral-900 p-6">
            <p className="text-sm text-neutral-400">Available to Spend</p>
            <h2 className="mt-2 text-2xl font-semibold">
              €{dashboard.available_to_spend}
            </h2>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-3">
          <div className="rounded-2xl bg-neutral-900 p-6 xl:col-span-2">
            <h3 className="text-lg font-semibold">Category Breakdown</h3>
            <div className="mt-4 space-y-3">
              {dashboard.category_breakdown.length === 0 ? (
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-neutral-400">
                  No category data yet.
                </div>
              ) : (
                dashboard.category_breakdown.map((item) => (
                  <div
                    key={item.category}
                    className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950 p-4"
                  >
                    <span>{item.category}</span>
                    <span className="text-neutral-300">€{item.amount}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-neutral-900 p-6">
            <h3 className="text-lg font-semibold">Insights</h3>
            <ul className="mt-4 space-y-3 text-sm text-neutral-300">
              {insights.length === 0 ? (
                <li className="rounded-xl bg-neutral-950 p-3 text-neutral-400">
                  No insights available.
                </li>
              ) : (
                insights.map((insight, index) => (
                  <li key={index} className="rounded-xl bg-neutral-950 p-3">
                    <span className="mb-1 block text-xs uppercase tracking-wide text-neutral-500">
                      {insight.type}
                    </span>
                    <span>{insight.message}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}