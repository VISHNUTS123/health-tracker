import { useState } from "react";
import axios from "axios";

function Signup() {
  const [form, setForm] = useState({  name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    height: "",
    activityLevel: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/signup", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage("Signup successful!");
    } catch (err) {if (err.response) {
    // Server responded with a status other than 2xx
    console.error("Signup error:", err.response.status, err.response.data);
    setMessage(`Signup failed: ${err.response.data?.error || "Server error"}`);
  } else if (err.request) {
    // Request was made but no response received
    console.error("Signup error: No response from server", err.request);
    setMessage("Signup failed: No response from server.");
  } else {
    // Something else happened
    console.error("Signup error:", err.message);
    setMessage(`Signup failed: ${err.message}`);
  };
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
<input
  name="name"
  placeholder="Name"
  value={form.name}
  onChange={handleChange}
  required
/>
<br></br>
<br></br>
<input
  name="email"
  type="email"
  placeholder="Email"
  value={form.email}
  onChange={handleChange}
  required
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
/>
<br></br>
<br></br>

<input
  name="age"
  type="number"
  placeholder="Age"
  value={form.age}
  onChange={handleChange}
  required
/>
<br></br>
<br></br>
<select
  name="gender"
  value={form.gender}
  onChange={handleChange}
  required
>
  <option value="">Select Gender</option>
  <option value="male">Male</option>
  <option value="female">Female</option>
</select>

<br></br>
<br></br>
<select
  name="activityLevel"
  value={form.activityLevel}
  onChange={handleChange}
  required
>
  <option value="">Select Activity Level</option>
  <option value="sedentary">Sedentary (little or no exercise)</option>
  <option value="light">Lightly active (light exercise 1–3 days/week)</option>
  <option value="moderate">Moderately active (moderate exercise 3–5 days/week)</option>
  <option value="active">Active (hard exercise 6–7 days/week)</option>
  <option value="very active">Very active (physical job + exercise)</option>
</select>

<br></br>
<br></br>

<input
  name="height"
  type="number"
  placeholder="Height (cm)"
  value={form.height}
  onChange={handleChange}
  required
/>
<br></br>
<br></br>
        <button type="submit">Signup</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Signup;
