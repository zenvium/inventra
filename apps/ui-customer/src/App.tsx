import { useAuth } from 'react-oidc-context';
import { Helmet } from '@dr.pogodin/react-helmet';

const highlights = [
	{ value: 'One view', label: 'for every order' },
	{ value: 'Live updates', label: 'as stock moves' },
	{ value: 'Clear history', label: 'from request to delivery' },
];

export default function App() {
	const auth = useAuth();
	const signedInName = auth.user?.profile.given_name ?? auth.user?.profile.name ?? 'there';

	const signIn = async () => {
		await auth.signinRedirect();
	};

	return (
		<main className="portal-shell">
			<Helmet>
				<title>Customer portal · Inventra</title>
			</Helmet>
			<header className="topbar">
				<a className="brand" href="/" aria-label="Inventra home">
					<span className="brand-mark">i</span>
					<span>inventra</span>
				</a>
				<div className="topbar-note"><span className="status-dot" /> Customer workspace</div>
			</header>

			<section className="login-layout">
				<div className="intro-panel">
					<div className="eyebrow"><span className="eyebrow-line" /> CUSTOMER PORTAL</div>
					<h1>Your inventory,<br /><em>in clearer view.</em></h1>
					<p className="intro-copy">Keep every order, delivery, and product update in one calm, reliable place.</p>
					<div className="inventory-card" aria-label="Inventory preview">
						<div className="card-heading">
							<div><span className="card-kicker">YOUR SUPPLY SNAPSHOT</span><strong>Everything in rhythm.</strong></div>
							<span className="card-icon">↗</span>
						</div>
						<div className="stock-visual" aria-hidden="true">
							<div className="stock-bar bar-one" /><div className="stock-bar bar-two" /><div className="stock-bar bar-three" /><div className="stock-bar bar-four" /><div className="stock-bar bar-five" /><div className="stock-bar bar-six" /><div className="stock-bar bar-seven" />
						</div>
						<div className="stock-caption"><span><i className="legend-dot" /> Orders moving smoothly</span><span>THIS WEEK</span></div>
					</div>
					<div className="highlights">
						{highlights.map((highlight) => <div className="highlight" key={highlight.value}><strong>{highlight.value}</strong><span>{highlight.label}</span></div>)}
					</div>
				</div>

				<section className="sign-in-panel" aria-labelledby="sign-in-title">
					<div className="sign-in-card">
						<div className="mobile-mark"><span className="brand-mark">i</span></div>
						<span className="card-kicker">WELCOME BACK</span>
						<h2 id="sign-in-title">{auth.isAuthenticated ? `Good to see you, ${signedInName}.` : 'Sign in to your account'}</h2>
						<p className="sign-in-copy">{auth.isAuthenticated ? 'Your customer workspace is ready.' : 'Access your orders and stay close to every delivery.'}</p>
						{auth.error && <p className="error-message" role="alert">We could not complete sign-in. Please try again.</p>}
						{auth.isLoading ? (
							<div className="loading-message" role="status">Checking your sign-in…</div>
						) : auth.isAuthenticated ? (
							<button className="primary-button" type="button" onClick={() => void auth.signoutRedirect()}>Sign out <span aria-hidden="true">↗</span></button>
						) : (
							<button className="primary-button" type="button" onClick={() => void signIn()}>Continue securely <span aria-hidden="true">→</span></button>
						)}
						<div className="secure-note"><span className="lock-icon" aria-hidden="true">⌑</span> Your account is protected with secure sign-in.</div>
					</div>
					<footer className="sign-in-footer">Need a hand? <a href="mailto:support@inventra.example">Contact support</a></footer>
				</section>
			</section>
			<footer className="page-footer"><span>© 2026 Inventra</span><span>Built for dependable supply.</span></footer>
		</main>
	);
}
