"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createTransaction,
  fetchCategories,
  fetchTransactions,
} from "@/lib/api";
import Navigation from "@/components/Navigation";

type Category = {
  id: number;
  name: string;
  is_essential: boolean;
};

type Transaction = {
  id: number;
  amount: string;
  category_id: number;
  description?: string | null;
  date: string;
};

export default function TransactionsPage() {
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function loadData(token: string) {
    const [transactionsData, categoriesData] = await Promise.all([
      fetchTransactions(token),
      fetchCategories(token),
    ]);

    setTransactions(transactionsData);
    setCategories(categoriesData);
  }

  useEffect(() => {
    async function init() {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/");
        return;
      }

      try {
        await loadData(token);
      } catch {
        localStorage.removeItem("token");
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      setSubmitting(true);

      await createTransaction(token, {
        amount: Number(amount),
        category_id: Number(categoryId),
        description: description || undefined,
      });

      setAmount("");
      setCategoryId("");
      setDescription("");

      await loadData(token);
    } catch {
      setError("Failed to create transaction");
    } finally {
      setSubmitting(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <p className="text-neutral-400">Loading transactions...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Navigation/>

        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Transactions</h1>
            <p className="mt-2 text-neutral-400">
              Add and review your spending
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="rounded-xl border border-neutral-700 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-900"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="rounded-xl border border-neutral-700 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-900"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-3">
          <section className="rounded-2xl bg-neutral-900 p-6">
            <h2 className="text-xl font-semibold">Add transaction</h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm text-neutral-300">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 outline-none focus:border-neutral-600"
                  placeholder="Enter amount"
                  required
                />
              </div>

                <div>
                    <label
                        htmlFor="category"
                        className="mb-2 block text-sm text-neutral-300"
                    >
                        Category
                    </label>

                    <select
                        id="category"
                        name="category"
                        title="Transaction category"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 outline-none focus:border-neutral-600"
                        required
                    >
                        <option value="">Select category</option>

                        {categories.map((category) => (
                        <option
                            key={category.id}
                            value={category.id}
                        >
                            {category.name}
                        </option>
                        ))}
                    </select>
                </div>

              <div>
                <label className="mb-2 block text-sm text-neutral-300">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 outline-none focus:border-neutral-600"
                  placeholder="Optional description"
                />
              </div>

              {error ? (
                <p className="text-sm text-red-400">{error}</p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-white px-4 py-3 font-medium text-black transition hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Add transaction"}
              </button>
            </form>
          </section>

          <section className="rounded-2xl bg-neutral-900 p-6 xl:col-span-2">
            <h2 className="text-xl font-semibold">Transaction history</h2>

            <div className="mt-6 space-y-3">
              {transactions.length === 0 ? (
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-neutral-400">
                  No transactions yet.
                </div>
              ) : (
                transactions.map((transaction) => {
                  const category = categories.find(
                    (item) => item.id === transaction.category_id
                  );

                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950 p-4"
                    >
                      <div>
                        <p className="font-medium">
                          {category?.name ?? "Unknown category"}
                        </p>
                        <p className="text-sm text-neutral-400">
                          {transaction.description || "No description"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold">€{transaction.amount}</p>
                        <p className="text-sm text-neutral-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}