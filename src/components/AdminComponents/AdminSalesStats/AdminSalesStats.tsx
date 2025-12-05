import { useContext, useMemo } from "react";
import style from "./AdminSalesStas.module.css"
import { ordersResult } from "../../../App";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData,
} from "chart.js";
import { Chart, Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function AdminSalesStats() {
  const { allOrders, loading, error } = useContext(ordersResult);

  // Always call hooks first
  const weeklyStats = useMemo(() => {
    const stats: Record<string, { totalOrders: number; totalSales: number; avgOrder: number }> = {};

    allOrders?.forEach((order) => {
      const date = new Date(order.meta.createdAt);
      // Week string "YYYY-WW"
      const week = `${date.getFullYear()}-W${Math.ceil(
        ((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / 86400000 +
          new Date(date.getFullYear(), 0, 1).getDay() +
          1) /
          7
      )}`;
      const sales = order.totals.verifiedTotal || 0;

      if (!stats[week]) stats[week] = { totalOrders: 0, totalSales: 0, avgOrder: 0 };

      stats[week].totalOrders += 1;
      stats[week].totalSales += sales;
      stats[week].avgOrder = stats[week].totalSales / stats[week].totalOrders;
    });

    const sortedWeeks = Object.keys(stats).sort();
    return sortedWeeks.map((week) => ({ week, ...stats[week] }));
  }, [allOrders]);

  const weekLabels = weeklyStats.map((w) => w.week);

  // Cumulative sales for growth chart
  const cumulativeSales = weeklyStats.reduce<number[]>((acc, stat, i) => {
    const prev = i > 0 ? acc[i - 1] : 0;
    acc.push(prev + stat.totalSales);
    return acc;
  }, []);

  // Chart data
  const totalOrdersData = {
    labels: weekLabels,
    datasets: [
      {
        label: "Total Orders (Weekly)",
        data: weeklyStats.map((w) => w.totalOrders),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  const weeklySalesData: ChartData<"bar" | "line", number[], string> = {
    labels: weekLabels,
    datasets: [
      {
        type: "bar" as const,
        label: "Total Sales (kr)",
        data: weeklyStats.map((w) => w.totalSales),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        type: "line" as const,
        label: "Cumulative Sales (kr)",
        data: cumulativeSales,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
    ],
  };

  const avgOrderData = {
    labels: weekLabels,
    datasets: [
      {
        label: "Average Order Value (kr)",
        data: weeklyStats.map((w) => w.avgOrder),
        backgroundColor: "rgba(255, 159, 64, 0.5)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  // Early returns after hooks
  if (loading) {
    return (
      <article className={style.adminStatsContainer}>
        <h2>Laster...</h2>
      </article>
    );
  }

  if (error) {
    return (
      <article className={style.adminStatsContainer}>
        <h2>Noe gikk galt</h2>
      </article>
    );
  }

  return (
    <article className={style.adminStatsContainer}>
      <h2>Salgs Statistikk</h2>

      <div className={style.chartsGrid}>
        <div className={style.chartContainer}>
          <h3>Antall Order Per Uke</h3>
          <Bar data={totalOrdersData} />
        </div>

        <div className={style.chartContainer}>
          <h3>Sammlet Salg Per Uke</h3>
          <Chart
            type="bar"
            data={weeklySalesData} // mixed bar + line datasets
            options={{ responsive: true }}
          />
        </div>

        <div className={style.chartContainer}>
          <h3>Gjennomsnittlig Ordre Sum Per Uke</h3>
          <Line data={avgOrderData} />
        </div>
      </div>
    </article>
  );
}

export default AdminSalesStats;
