import { Routes, Route, Link } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute"; // ✅ new

function App() {
  return (
    <>
      <nav>
        <Link to="/">Signup</Link> |{" "}
        <Link to="/login">Login</Link> |{" "}
        <Link to="/dashboard">Dashboard</Link> |{" "}
        <button onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}>
          Logout
        </button>
      </nav>

      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
