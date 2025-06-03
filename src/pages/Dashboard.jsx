import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SleepChart from "../components/SleepChart";
import StepsChart from "../components/StepsChart";
import WaterChart from "../components/WaterChart";
import WeightChart from "../components/WeightChart";

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [data, setData] = useState({
    count: "", hours: "", liters: "", weight: "", date: ""
  });

  const [message, setMessage] = useState("");
  const [refreshCharts, setRefreshCharts] = useState(0);
  const [bmr, setBmr] = useState(null);
  const [calories, setCalories] = useState(null);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const weight = parseFloat(data.weight);

      await Promise.all([
        axios.post("http://localhost:5000/api/steps", { count: data.count, date: data.date }, { headers }),
        axios.post("http://localhost:5000/api/sleep", { hours: data.hours, date: data.date }, { headers }),
        axios.post("http://localhost:5000/api/water", { liters: data.liters, date: data.date }, { headers }),
        axios.post("http://localhost:5000/api/weight", { weight, date: data.date }, { headers }),
      ]);

      setMessage("✅ All data submitted!");
      setRefreshCharts(prev => prev + 1);

      if (user && user.age && user.height && user.gender && user.activityLevel && weight) {
        const height = parseFloat(user.height);
        const age = parseInt(user.age);
        const gender = user.gender;

        const calculatedBMR = gender === "male"
          ? 10 * weight + 6.25 * height - 5 * age + 5
          : 10 * weight + 6.25 * height - 5 * age - 161;

        const activityMultipliers = {
          sedentary: 1.2,
          light: 1.375,
          moderate: 1.55,
          active: 1.725,
          extra: 1.9,
        };

        const multiplier = activityMultipliers[user.activityLevel] || 1.2;
        const calorieNeeds = calculatedBMR * multiplier;

        await axios.post("http://localhost:5000/api/bmr", {
          bmr: calculatedBMR,
          calories: calorieNeeds,
          weight,
          date: data.date,
        }, { headers });

        setBmr(calculatedBMR.toFixed(2));
        setCalories(calorieNeeds.toFixed(2));
      }

    } catch (err) {
      console.error(err);
      setMessage("❌ Submission failed.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-5xl font-extrabold text-center text-blue-700 mb-12">
        🧠 Health Tracker Dashboard
      </h1>

      {/* Input Form */}
      <div className="flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-xl px-8 py-6 w-full max-w-md space-y-5"
        >
          <h3 className="text-2xl font-bold text-left text-blue-700 mb-4">
            📋 Enter Daily Metrics
          </h3>

          {[
            { label: "Date", name: "date", type: "date" },
            { label: "Steps", name: "count", type: "number", placeholder: "Steps walked" },
            { label: "Sleep (hours)", name: "hours", type: "number", step: "0.1", placeholder: "Hours slept" },
            { label: "Water (liters)", name: "liters", type: "number", step: "0.1", placeholder: "Liters drank" },
            { label: "Weight (kg)", name: "weight", type: "number", step: "0.1", placeholder: "Weight" },
          ].map(({ label, name, ...rest }) => (
            <div key={name}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {label}
              </label>
              <input
                name={name}
                onChange={handleChange}
                className="w-64 border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...rest}
                
              />
              <br></br>
            </div>
            
          ))}
           <br></br>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-md hover:scale-105 transition transform duration-150 text-sm"
          >
            🚀 Submit All
          </button>

          {message && (
            <p className="text-center text-green-600 text-sm">{message}</p>
          )}
        </form>
      </div>

      {/* BMR + Calorie Info */}
      {bmr && calories && (
        <div className="text-center mt-8 space-y-2">
          <p className="text-blue-600 text-lg font-semibold">
            🔥 Your BMR: <span className="font-bold">{bmr}</span> calories/day
          </p>
          <p className="text-orange-600 text-lg font-semibold">
            🍱 Daily Calorie Needs: <span className="font-bold">{calories}</span> calories/day
          </p>
        </div>
      )}

      {/* Charts */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">🛌 Sleep Tracker</h3>
          <div className="w-full h-64">
            <SleepChart refreshTrigger={refreshCharts} />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">🚶 Steps Tracker</h3>
          <div className="w-full h-64">
            <StepsChart refreshTrigger={refreshCharts} />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">💧 Water Intake Tracker</h3>
          <div className="w-full h-64">
            <WaterChart refreshTrigger={refreshCharts} />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">⚖️ Weight Tracker</h3>
          <div className="w-full h-64">
            <WeightChart refreshTrigger={refreshCharts} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
