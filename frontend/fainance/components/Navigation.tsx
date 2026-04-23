"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Transactions", href: "/transactions" },
  { label: "Vault", href: "/vault" },
  { label: "Receipts", href: "/receipts" },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/");
  }

  return (
    <nav className="mb-8 rounded-2xl border border-neutral-800 bg-neutral-900 px-4 py-4">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard" className="text-xl font-bold text-white">
            FaiNance
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden items-center gap-3 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-4 py-2 text-sm transition ${
                  isActive
                    ? "bg-white text-black"
                    : "text-neutral-300 hover:bg-neutral-800"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="rounded-xl border border-neutral-700 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800"
          >
            Logout
          </button>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-700 text-neutral-300 md:hidden"
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="mt-4 flex flex-col gap-2 md:hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm transition ${
                  isActive
                    ? "bg-white text-black"
                    : "bg-neutral-950 text-neutral-300 hover:bg-neutral-800"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="rounded-xl border border-neutral-700 px-4 py-3 text-left text-sm text-neutral-300 hover:bg-neutral-800"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}