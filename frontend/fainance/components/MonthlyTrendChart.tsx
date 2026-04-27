"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type TrendData = {
  date: string;
  amount: number;
};

export default function MonthlyTrendChart({ data }: { data: TrendData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl bg-neutral-900 p-6">
        <h2 className="mb-6 text-xl font-semibold">Monthly Spending Trend</h2>
        <div className="flex h-80 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-400">
          No trend data yet.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-neutral-900 p-6">
      <h2 className="mb-6 text-xl font-semibold">Monthly Spending Trend</h2>

      <div className="h-[320px] w-full min-w-0">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#a78bfa"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}