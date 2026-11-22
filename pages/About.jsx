import { useState } from "react";

const TEAM = [
  { name: "Arianna Gutierrez", photo: "/team/arianna.png" },
  { name: "Alyssa Trevino", photo: "/team/alyssa.jpg" },
  { name: "Jakob Sanchez", photo: "/team/jakob.jpg" },
  { name: "Sujal Sharma", photo: "/team/sujal.png" },
];

function Avatar({ name, photo }) {
  const [failed, setFailed] = useState(false);

  return (
    <span className="member-avatar" aria-hidden={!photo || failed}>
      {photo && !failed ? (
        <img src={photo} alt={name} onError={() => setFailed(true)} />
      ) : (
        name[0]
      )}
    </span>
  );
}

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
        {TEAM.map(({ name, photo }) => (
          <div className="card member" key={name}>
            <Avatar name={name} photo={photo} />
            <span className="member-name">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
