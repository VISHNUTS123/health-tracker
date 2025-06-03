import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement, PointElement, CategoryScale, LinearScale,
  Title, Tooltip, Legend
} from "chart.js";
import { subDays } from "date-fns";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function WaterChart({ refreshTrigger }) {
  const [waterData, setWaterData] = useState([]);
  const [daysRange, setDaysRange] = useState(7);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/water", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sorted = res.data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setWaterData(sorted);
    };
    fetchData();
  }, [refreshTrigger]);

  const filtered = waterData.filter((d) => daysRange === 0 || new Date(d.date) >= subDays(new Date(), daysRange));

  const chartData = {
    labels: filtered.map((d) => d.date.slice(0, 10)),
    datasets: [
      {
        label: "Liters Drank",
        data: filtered.map((d) => d.liters),
        borderColor: "teal",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-4xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
       
        <select
          onChange={(e) => setDaysRange(Number(e.target.value))}
          value={daysRange}
          className="border px-2 py-1 rounded text-sm"
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="0">All Time</option>
        </select>
      </div>
      <div className="h-[300px]">
        <Line data={chartData} />
      </div>
    </div>
  );
}

export default WaterChart;
