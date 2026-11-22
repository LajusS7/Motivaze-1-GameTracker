const TEAM = [
  "Arianna Gutierrez",
  "Alyssa Trevino",
  "Jakob Sanchez",
  "Sujal Sharma",
];

export default function About() {
  return (
    <div className="page-wrapper">
      <h1>About Team Motivaze+1</h1>
      <p className="lead">
        We are computer science students building GameTracker, a game library
        where players track their backlog and write reviews.
      </p>

      <h2>Meet the Team</h2>
      <div className="team-grid">
        {TEAM.map((name) => (
          <div className="card member" key={name}>
            <span className="member-avatar" aria-hidden="true">{name[0]}</span>
            <span className="member-name">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
