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
    setError("");
    console.log("📩 Submitting Form:", formData);
  
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const { data } = await axios.post(`${API_URL}${endpoint}`, formData);
  
      console.log("✅ Login Response:", data);
  
      if (!isRegister) {
        localStorage.setItem("token", data.token);  
        console.log("💾 Token stored:", data.token);
  
        // ✅ Use navigate without full page reload
        if (!isRegister) {
          setTimeout(() => navigate("/dashboard"), 0); // Prevents immediate remount
        }
        
      } else {
        alert("Registration successful. Please login.");
        setIsRegister(false);
      }
    } catch (err) {
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
        {isRegister && <input type="text" name="name" placeholder="Name" onChange={handleChange} required />}
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">{isRegister ? "Sign Up" : "Login"}</button>
      </form>
      <p onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
      </p>
    </div>
  );
};

export default Auth;
