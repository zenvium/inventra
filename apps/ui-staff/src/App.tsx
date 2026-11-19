import { Helmet } from '@dr.pogodin/react-helmet';
import { useAuth } from 'react-oidc-context';

const serviceRows = [
	{ label: 'Inventory health', value: 'In good shape', tone: 'green' },
	{ label: 'Orders to review', value: 'Ready when you are', tone: 'blue' },
	{ label: 'Latest sync', value: 'Just now', tone: 'muted' },
];

export default function App() {
	const auth = useAuth();
	const signedInName = auth.user?.profile.given_name ?? auth.user?.profile.name ?? 'team member';

	return (
		<main className="portal-shell">
			<Helmet><title>Staff portal · Inventra</title></Helmet>
			<header className="topbar">
				<a className="brand" href="/" aria-label="Inventra home"><span className="brand-mark">i</span><span>inventra</span></a>
				<div className="topbar-note"><span className="status-dot" /> Staff workspace</div>
			</header>
			<section className="login-layout">
				<div className="intro-panel">
					<div className="eyebrow"><span className="eyebrow-line" /> STAFF PORTAL</div>
					<h1>Make room for<br /><em>better flow.</em></h1>
					<p className="intro-copy">A focused home for the people keeping products, teams, and daily operations moving.</p>
					<div className="operations-card">
						<div className="operations-header"><div><span className="card-kicker">OPERATIONS AT A GLANCE</span><strong>Ready for today.</strong></div><span className="operations-date">THU · 19 NOV</span></div>
						{serviceRows.map((row) => <div className="service-row" key={row.label}><span className={`service-indicator ${row.tone}`} /><span className="service-label">{row.label}</span><strong>{row.value}</strong><span className="row-arrow">↗</span></div>)}
					</div>
					<div className="team-note"><span className="team-avatars"><i>J</i><i>M</i><i>A</i></span><span>Made for teams that keep things moving.</span></div>
				</div>
				<section className="sign-in-panel" aria-labelledby="sign-in-title">
					<div className="sign-in-card">
						<div className="mobile-mark"><span className="brand-mark">i</span></div>
						<span className="card-kicker">INVENTRA TEAM</span>
						<h2 id="sign-in-title">{auth.isAuthenticated ? `Welcome, ${signedInName}.` : 'Sign in to your workspace'}</h2>
						<p className="sign-in-copy">{auth.isAuthenticated ? 'Your staff workspace is ready.' : 'Use your staff account to access the operations portal.'}</p>
						{auth.error && <p className="error-message" role="alert">We could not complete sign-in. Please try again.</p>}
						{auth.isLoading ? <div className="loading-message" role="status">Checking your sign-in…</div> : auth.isAuthenticated ? (
							<button className="primary-button" type="button" onClick={() => void auth.signoutRedirect()}>Sign out <span aria-hidden="true">↗</span></button>
						) : (
							<button className="primary-button" type="button" onClick={() => void auth.signinRedirect()}>Continue with secure sign-in <span aria-hidden="true">→</span></button>
						)}
						<div className="secure-note"><span className="lock-icon" aria-hidden="true">⌑</span> Staff access is protected with secure sign-in.</div>
					</div>
					<footer className="sign-in-footer">Having trouble? <a href="mailto:support@inventra.example">Contact your administrator</a></footer>
				</section>
			</section>
			<footer className="page-footer"><span>© 2026 Inventra</span><span>Operations, with clarity.</span></footer>
		</main>
	);
}
