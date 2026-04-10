"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const SERVICES = [
  { name: "Маникюр", count: 342 },
  { name: "Стрижка", count: 289 },
  { name: "Брови", count: 214 },
  { name: "Массаж", count: 178 },
  { name: "Макияж", count: 145 },
];

const COLORS = ["#7c3aed", "#2563eb", "#16a34a", "#d97706", "#db2777"];

export function PopularServicesChart() {
  const data = {
    labels: SERVICES.map((s) => s.name),
    datasets: [
      {
        data: SERVICES.map((s) => s.count),
        backgroundColor: COLORS,
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        position: "right" as const,
        labels: { boxWidth: 12, padding: 12, font: { size: 11 } },
      },
    },
  };

  const total = SERVICES.reduce((s, item) => s + item.count, 0);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Популярные услуги</h3>
      <div className="relative" style={{ height: 220 }}>
        <Doughnut data={data} options={options} />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{total.toLocaleString("ru")}</p>
          <p className="text-xs text-zinc-400">всего</p>
        </div>
      </div>
    </div>
  );
}
