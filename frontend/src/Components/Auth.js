import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error before submitting

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
    const endpoint = isRegister ? "/auth/register" : "/auth/login";

    // ✅ Corrected userData based on Register/Login
    const userData = isRegister
      ? { name: formData.name, email: formData.email, password: formData.password }
      : { email: formData.email, password: formData.password };

    console.log("📩 Submitting Form:", userData);

    try {
      const { data } = await axios.post(`${API_URL}${endpoint}`, userData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("✅ API Response:", data);

      if (!isRegister) {
        localStorage.setItem("token", data.token); // Store JWT token
        console.log("💾 Token stored:", data.token);
        setTimeout(() => navigate("/dashboard"), 0); // Prevents immediate remount
      } else {
        alert("Registration successful. Please login.");
        setIsRegister(false);
      }
    } catch (err) {
      console.error("❌ API Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    console.log("✅ Auth Component Mounted");
    return () => console.log("❌ Auth Component Unmounted");
  }, []);

  return (
    <div>
      <h2>{isRegister ? "Register" : "Login"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">{isRegister ? "Sign Up" : "Login"}</button>
      </form>
      <p onClick={() => setIsRegister(!isRegister)} style={{ cursor: "pointer", color: "blue" }}>
        {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
      </p>
    </div>
  );
};

export default Auth;
