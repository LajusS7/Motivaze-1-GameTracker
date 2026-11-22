import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="page-wrapper">
      <h1>Welcome to Team Workspace</h1>
      <p className="lead">
        Track your backlog, discover new games, and share reviews with other
        players.
      </p>

      <div className="actions">
        <Link to="/catalog" className="btn">Browse the Catalog</Link>
        <Link to="/dashboard" className="btn btn-secondary">My Dashboard</Link>
      </div>
    </div>
  );
}

export default Home;
