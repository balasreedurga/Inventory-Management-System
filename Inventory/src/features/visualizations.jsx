import { Bar, Line } from "react-chartjs-2";

/**
 * Generates a bar chart for top-selling products.
 * @param {Array} products - List of product objects with sales data.
 * @returns {JSX.Element} - Bar chart component.
 */
export function TopSellingProductsChart({ products }) {
  const data = {
    labels: products.map(product => product.name),
    datasets: [
      {
        label: "Units Sold",
        data: products.map(product => product.unitsSold),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={data} />;
}

/**
 * Generates a line chart for total sales over time.
 * @param {Array} sales - List of sales data points { date, total }.
 * @returns {JSX.Element} - Line chart component.
 */
export function TotalSalesOverTimeChart({ sales }) {
  const data = {
    labels: sales.map(sale => sale.date),
    datasets: [
      {
        label: "Total Sales",
        data: sales.map(sale => sale.total),
        fill: false,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
      },
    ],
  };

  return <Line data={data} />;
}
