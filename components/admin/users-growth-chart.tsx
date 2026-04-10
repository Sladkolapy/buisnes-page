"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend,
} from "chart.js";
import { useAdminStore } from "@/stores/admin-store";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function UsersGrowthChart() {
  const daily = useAdminStore((s) => s.dailyStats);

  const data = {
    labels: daily.map((d) => d.date.slice(5)),
    datasets: [
      {
        label: "Новые пользователи",
        data: daily.map((d) => d.users),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.1)",
        tension: 0.4,
        pointRadius: 2,
      },
      {
        label: "Новые мастера",
        data: daily.map((d) => d.masters),
        borderColor: "#16a34a",
        backgroundColor: "rgba(22,163,74,0.1)",
        tension: 0.4,
        pointRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const, labels: { boxWidth: 12, font: { size: 11 } } },
    },
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Рост пользователей</h3>
      <div style={{ height: 220 }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
