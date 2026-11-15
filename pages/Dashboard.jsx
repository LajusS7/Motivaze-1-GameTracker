import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";

function Dashboard() {
    const { user } = useAuth();
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadDashboard() {
            try {
                const data = await api("/api/dashboard");
                setMessage(data.message);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadDashboard();
    }, []);

    return (
        <div className="page-wrapper">
            <h1>Workspace Dashboard</h1>
            <p>Welcome back, {user?.username}.</p>

            {loading && <p>Loading dashboard...</p>}
            {error && <p role="alert">Error: {error}</p>}
            {message && <p>{message}</p>}
        </div>
    );
}

export default Dashboard;

