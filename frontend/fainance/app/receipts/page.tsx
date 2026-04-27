"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import {
  fetchReceipts,
  createReceipt,
  fetchCategories,
} from "@/lib/api";

type Receipt = {
  id: number;
  vendor_name: string | null;
  image_path: string;
  amount: string;
  category_name?: string;
  created_at: string;
};

type Category = {
  id: number;
  name: string;
};

export default function ReceiptsPage() {
  const router = useRouter();

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [merchantName, setMerchantName] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadData(token: string) {
    const [receiptData, categoryData] = await Promise.all([
      fetchReceipts(token),
      fetchCategories(token),
    ]);

    setReceipts(receiptData);
    setCategories(categoryData);
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
    setMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }

    try {
      setSubmitting(true);

      await createReceipt(token, {
        image_path: `storage/receipts/${Date.now()}-manual-receipt.jpg`,
        vendor_name: merchantName,
        amount: Number(amount),
        category_id: Number(categoryId),
      });

      setMerchantName("");
      setAmount("");
      setCategoryId("");

      await loadData(token);

      setMessage(
        "Receipt saved and transaction created automatically."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create receipt"
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <p className="text-neutral-400">Loading receipts...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Navigation />

        <header className="mb-8">
          <h1 className="text-4xl font-bold">Receipts</h1>
          <p className="mt-2 text-neutral-400">
            Add receipts and auto-create transactions
          </p>
        </header>

        <div className="grid gap-6 xl:grid-cols-3">
          <section className="rounded-2xl bg-neutral-900 p-6">
            <h2 className="text-xl font-semibold">Add receipt</h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm text-neutral-300">
                  Merchant
                </label>
                <input
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3"
                  placeholder="Lidl"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-neutral-300">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3"
                  placeholder="35"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="receiptCategory"
                  className="mb-2 block text-sm text-neutral-300"
                >
                  Category
                </label>

                <select
                  id="receiptCategory"
                  title="Receipt category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3"
                  required
                >
                  <option value="">Select category</option>

                  {categories.map((c) => (
                    <option
                      key={c.id}
                      value={c.id}
                    >
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}

              {message && (
                <p className="text-sm text-green-400">{message}</p>
              )}

              <button
                disabled={submitting}
                className="w-full rounded-xl bg-white px-4 py-3 font-medium text-black"
              >
                {submitting ? "Saving..." : "Save receipt"}
              </button>
            </form>
          </section>

          <section className="rounded-2xl bg-neutral-900 p-6 xl:col-span-2">
            <h2 className="text-xl font-semibold">Receipt history</h2>

            <div className="mt-6 space-y-3">
              {receipts.length === 0 ? (
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-neutral-400">
                  No receipts yet.
                </div>
              ) : (
                receipts.map((receipt) => (
                  <div
                    key={receipt.id}
                    className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950 p-4"
                  >
                    <div>
                      <p className="font-medium">
                        {receipt.vendor_name || "Unknown vendor"}
                      </p>

                      <p className="text-sm text-neutral-400">
                        {receipt.category_name || "Category"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">
                        €{receipt.amount}
                      </p>

                      <p className="text-sm text-neutral-500">
                        {new Date(
                          receipt.created_at
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}