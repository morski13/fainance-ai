"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import { createVault, fetchVaults, requestVaultUnlock } from "@/lib/api";

type Vault = {
  id: number;
  goal_name: string;
  target_amount: string;
  locked_amount: string;
  locked_until: string;
  status: string;
  created_at: string;
};

export default function VaultPage() {
  const router = useRouter();

  const [vaults, setVaults] = useState<Vault[]>([]);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [lockedAmount, setLockedAmount] = useState("");
  const [lockedUntil, setLockedUntil] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadVaults(token: string) {
    const data = await fetchVaults(token);
    setVaults(data);
  }

  useEffect(() => {
    async function init() {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/");
        return;
      }

      try {
        await loadVaults(token);
      } catch {
        localStorage.removeItem("token");
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [router]);

  async function handleCreateVault(e: FormEvent) {
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

      await createVault(token, {
        goal_name: goalName,
        target_amount: Number(targetAmount),
        locked_amount: Number(lockedAmount),
        locked_until: `${lockedUntil}T00:00:00`,
      });

      setGoalName("");
      setTargetAmount("");
      setLockedAmount("");
      setLockedUntil("");

      await loadVaults(token);
      setMessage("Vault created successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create vault");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUnlockRequest(vaultId: number) {
    setError("");
    setMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }

    try {
      const response = await requestVaultUnlock(token, vaultId);
      setMessage(response.message);
      await loadVaults(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to request unlock");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <p className="text-neutral-400">Loading vault...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Navigation />

        <header className="mb-8">
          <h1 className="text-4xl font-bold">Vault</h1>
          <p className="mt-2 text-neutral-400">
            Lock part of your budget and protect your savings goals.
          </p>
        </header>

        <div className="grid gap-6 xl:grid-cols-3">
          <section className="rounded-2xl bg-neutral-900 p-6">
            <h2 className="text-xl font-semibold">Create vault</h2>

            <form onSubmit={handleCreateVault} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm text-neutral-300">
                  Goal name
                </label>
                <input
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 outline-none focus:border-neutral-600"
                  placeholder="Summer vacation"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-neutral-300">
                  Target amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 outline-none focus:border-neutral-600"
                  placeholder="800"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-neutral-300">
                  Amount to lock now
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={lockedAmount}
                  onChange={(e) => setLockedAmount(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 outline-none focus:border-neutral-600"
                  placeholder="100"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="lockedUntil"
                  className="mb-2 block text-sm text-neutral-300"
                >
                  Locked until
                </label>
                <input
                  id="lockedUntil"
                  name="lockedUntil"
                  title="Locked until date"
                  type="date"
                  value={lockedUntil}
                  onChange={(e) => setLockedUntil(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 outline-none focus:border-neutral-600"
                  required
                />
              </div>

              {error ? <p className="text-sm text-red-400">{error}</p> : null}
              {message ? <p className="text-sm text-green-400">{message}</p> : null}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-white px-4 py-3 font-medium text-black transition hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create vault"}
              </button>
            </form>
          </section>

          <section className="rounded-2xl bg-neutral-900 p-6 xl:col-span-2">
            <h2 className="text-xl font-semibold">Your vaults</h2>

            <div className="mt-6 space-y-4">
              {vaults.length === 0 ? (
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-neutral-400">
                  No vaults yet.
                </div>
              ) : (
                vaults.map((vault) => {
                  const target = Number(vault.target_amount);
                  const locked = Number(vault.locked_amount);
                  const progress = target > 0 ? Math.min((locked / target) * 100, 100) : 0;

                  return (
                    <div
                      key={vault.id}
                      className="rounded-xl border border-neutral-800 bg-neutral-950 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {vault.goal_name}
                          </h3>
                          <p className="mt-1 text-sm text-neutral-400">
                            Locked until{" "}
                            {new Date(vault.locked_until).toLocaleDateString()}
                          </p>
                        </div>

                        <span className="rounded-full border border-neutral-700 px-3 py-1 text-xs uppercase text-neutral-300">
                          {vault.status}
                        </span>
                      </div>

                      <div className="mt-5">
                        <div className="mb-2 flex justify-between text-sm text-neutral-400">
                          <span>Progress</span>
                          <span>{progress.toFixed(0)}%</span>
                        </div>

                        <div className="h-3 rounded-full bg-neutral-800">
                          <div
                            className="h-3 rounded-full bg-white"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-sm">
                        <span className="text-neutral-400">
                          €{vault.locked_amount} / €{vault.target_amount}
                        </span>

                        {vault.status === "active" ? (
                          <button
                            onClick={() => handleUnlockRequest(vault.id)}
                            className="rounded-xl border border-neutral-700 px-4 py-2 text-neutral-300 hover:bg-neutral-900"
                          >
                            Request unlock
                          </button>
                        ) : null}
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