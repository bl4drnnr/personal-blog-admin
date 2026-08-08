import { Link } from 'react-router-dom';

const CARDS = [
  { to: '/posts', title: 'Posts', body: 'Write and manage articles and projects.' },
  { to: '/assets', title: 'Assets', body: 'Upload and manage images.' },
  { to: '/about', title: 'About / CV', body: 'Edit profile, work history, education, certifications.' },
  { to: '/settings', title: 'Site settings', body: 'Hero, intro, social links, SEO defaults, footer.' },
];

export function DashboardPage() {
  return (
    <div className="page">
      <h1 className="page-h1">Dashboard</h1>
      <div className="card-grid">
        {CARDS.map((card) => (
          <Link key={card.to} to={card.to} className="dash-card">
            <span className="dash-card-title">{card.title}</span>
            <span className="dash-card-body">{card.body}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
