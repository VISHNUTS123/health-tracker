import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", form);

      // ✅ Save JWT token and user profile
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage("Login successful!");
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err) {
      console.error(err);
      setMessage("Login failed.");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white p-6 shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
      
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded-md"
        />
        <br></br>
        <br></br>
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded-md"
        />
        <br></br>
        <br></br>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm text-green-600">{message}</p>}
    </div>
  );
}

export default Login;
