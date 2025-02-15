import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
    
      if (!token) {
        console.log("🔴 No token found! Redirecting to login...");
        navigate("/");
          return;
      }

      try {
        console.log("📡 Fetching user data...");

        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

        const { data } = await axios.get(`${API_URL}/auth/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("✅ User fetched:", data.user);
        setUser(data.user);  // Set actual user object
      } catch (err) {
        console.log("❌ Error fetching user:", err.response?.data || err.message);
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <div>
      <h2>Welcome to Dashboard</h2>
      {user ? <p>Hello, {user.name}!</p> : <p>Loading...</p>}
      <button onClick={() => {
        localStorage.removeItem("token");
        navigate("/");
      }}>Logout</button>
    </div>
  );
};

export default Dashboard;
