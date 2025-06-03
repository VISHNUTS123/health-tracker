import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend
);

function BMRChart({ refreshTrigger }) {
  const [bmrData, setBmrData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBMR = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/bmr", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBmrData(res.data);
      } catch (err) {
        console.error("Failed to fetch BMR:", err);
      }
    };

    fetchBMR();
  }, [refreshTrigger]);

  const chartData = {
    labels: bmrData.map(entry => new Date(entry.date).toLocaleDateString()),
    datasets: [
      {
        label: "BMR (cal/day)",
        data: bmrData.map(entry => entry.bmr),
        fill: false,
        borderColor: "#2563eb",
        tension: 0.3
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "BMR History" }
    }
  };

  return (
    <div>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default BMRChart;
