"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler,
} from "chart.js";
import { useAdminStore } from "@/stores/admin-store";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export function RevenueChart() {
  const daily = useAdminStore((s) => s.dailyStats);

  const data = {
    labels: daily.map((d) => d.date.slice(5)),
    datasets: [
      {
        label: "Выручка, ₽",
        data: daily.map((d) => d.revenue),
        borderColor: "#7c3aed",
        backgroundColor: "rgba(124,58,237,0.08)",
        fill: true,
        tension: 0.4,
        pointRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: { parsed: { y: number } }) => `${ctx.parsed.y.toLocaleString("ru")} ₽`,
        },
      },
    },
    scales: {
      y: { ticks: { callback: (v: number | string) => `${Number(v).toLocaleString("ru")} ₽` } },
    },
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Выручка за месяц</h3>
      <div style={{ height: 220 }}>
        <Line data={data} options={options as Parameters<typeof Line>[0]["options"]} />
      </div>
    </div>
  );
}
