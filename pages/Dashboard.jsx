import { useState, useEffect } from "react";

function Dashboard() {
  
  const [games, setGames] = useState([]);
  useEffect(() => {
    async function loadGames() {
      const res = await fetch("https://api.rawg.io/api/games?key=fd338b93143d45a3bca11baec9a3124e");
      const data = await res.json();
      setGames(data.results);
    }
    loadGames();
  }, []);
  
  return (
    <div className="page-wrapper">
      <h1>Workspace Dashboard</h1>
      <p>Welcome to workspace dashboard.</p>
      
      {games.map((g) => (
        <p key={g.id}>{g.name}</p>
      ))}
    </div>
  );
}


export default Dashboard;

