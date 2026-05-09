"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchVaults } from "@/lib/api";
import Navigation from "@/components/Navigation";
import SpendingChart from "@/components/SpendingChart";
import MonthlyTrendChart from "@/components/MonthlyTrendChart";
import SavingsOptimizer from "@/components/SavingsOptimizer";

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

type Vault = {
  id: number;
  goal_name: string;
  target_amount: string;
  locked_amount: string;
  status: string;
};

type Transaction = {
  id: number;
  amount: string;
  category_id: number;
  description?: string | null;
  date: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    async function loadData() {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/");
        return;
      }

      try {
        const [dashboardRes, insightsRes, vaultsRes, transactionsRes] =
          await Promise.all([
            fetch(`${API_BASE_URL}/dashboard`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_BASE_URL}/insights`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_BASE_URL}/vaults`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_BASE_URL}/transactions`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        if (!dashboardRes.ok || !insightsRes.ok || !vaultsRes.ok || !transactionsRes.ok) {
          localStorage.removeItem("token");
          router.push("/");
          return;
        }

        const dashboardData = await dashboardRes.json();
        const insightsData = await insightsRes.json();
        const vaultsData = await vaultsRes.json();
        const transactionsData = await transactionsRes.json();
        console.log("TRANSACTIONS DATA:", transactionsData);

        setTransactions(transactionsData);
        setVaults(vaultsData);
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

  const categoryChartData =
    dashboard?.category_breakdown?.map((item) => ({
      name: item.category,
      value: Number(item.amount),
  })) ?? [];

  const activeVault = vaults.find((vault) => vault.status === "active");

  const vaultProgress = activeVault
    ? Math.min(
        (Number(activeVault.locked_amount) / Number(activeVault.target_amount)) * 100,
        100
      )
    : 0;
  
    const trendByDate = transactions.reduce<Record<string, number>>(
      (acc, transaction) => {
        const date = new Date(transaction.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
        });

        acc[date] = (acc[date] || 0) + Number(transaction.amount);
        return acc;
      },
      {}
    );

    const monthlyTrendData = Object.entries(trendByDate).map(([date, amount]) => ({
      date,
      amount,
    }));

    const totalSpentSoFar = transactions.reduce(
  (sum, t) => sum + Number(t.amount),
  0
);

const today = new Date().getDate();

const daysInMonth = new Date(
  new Date().getFullYear(),
  new Date().getMonth() + 1,
  0
).getDate();

const projectedMonthSpend =
  today > 0
    ? (totalSpentSoFar / today) * daysInMonth
    : 0;

const overspendAmount =
  projectedMonthSpend - Number(dashboard.budget_limit || 0);

const budgetRisk =
  overspendAmount > 100
    ? "High"
    : overspendAmount > 0
    ? "Medium"
    : "Low";

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

          <div className="mt-8">
            <SpendingChart data={categoryChartData} />
          </div>

          <div className="mt-8">
            <MonthlyTrendChart data={monthlyTrendData} />
          </div>

          <div className="rounded-2xl bg-neutral-900 p-6">
            <h3 className="text-lg font-semibold">Vault Goal</h3>

            {!activeVault ? (
              <p className="mt-4 text-sm text-neutral-400">
                No active vault goal yet.
              </p>
            ) : (
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{activeVault.goal_name}</p>
                    <p className="mt-1 text-sm text-neutral-400">
                      €{activeVault.locked_amount} / €{activeVault.target_amount}
                    </p>
                  </div>

                  <span className="text-sm text-neutral-400">
                    {vaultProgress.toFixed(0)}%
                  </span>
                </div>

                <div className="mt-4 h-3 rounded-full bg-neutral-800">
                  <div
                    className="h-3 rounded-full bg-white"
                    style={{ width: `${vaultProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 rounded-2xl bg-neutral-900 p-6">
  <h2 className="text-xl font-semibold">
    Spending Forecast
  </h2>

  <div className="mt-6 grid gap-4 md:grid-cols-3">

    <div className="rounded-xl bg-neutral-950 p-4">
          <p className="text-sm text-neutral-400">
            Projected Month Spend
          </p>

          <p className="mt-2 text-2xl font-bold">
            €{projectedMonthSpend.toFixed(0)}
          </p>
        </div>

        <div className="rounded-xl bg-neutral-950 p-4">
          <p className="text-sm text-neutral-400">
            Budget Risk
          </p>

          <p className="mt-2 text-2xl font-bold">
            {budgetRisk}
          </p>
        </div>

        <div className="rounded-xl bg-neutral-950 p-4">
          <p className="text-sm text-neutral-400">
            Estimated Overspend
          </p>

          <p className="mt-2 text-2xl font-bold">
            €{Math.max(overspendAmount,0).toFixed(0)}
          </p>
        </div>

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

          <div className="mt-8">
            <SavingsOptimizer />
          </div>
        </section>
      </div>
    </main>
  );
}