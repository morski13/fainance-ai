"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#8b5cf6",
  "#a78bfa",
  "#c4b5fd",
  "#ddd6fe",
  "#7c3aed",
  "#6d28d9",
  "#5b21b6",
  "#4c1d95",
];

type ChartData = {
  name: string;
  value: number;
};

export default function SpendingChart({ data }: { data: ChartData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl bg-neutral-900 p-6">
        <h2 className="mb-6 text-xl font-semibold">Spending by Category</h2>
        <div className="flex h-80 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-400">
          No chart data yet.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-neutral-900 p-6">
      <h2 className="mb-6 text-xl font-semibold">Spending by Category</h2>

      <div className="h-[320px] w-full min-w-0">
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}