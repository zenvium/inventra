export const oidcConfig = {
	authority: import.meta.env['VITE_APP_UI_STAFF_OIDC_AUTHORITY'] ?? 'https://mock-auth.inventra.localhost:1355/staff-staff',
	client_id: import.meta.env['VITE_APP_UI_STAFF_OIDC_CLIENT_ID'] ?? 'inventra-staff',
	redirect_uri: import.meta.env['VITE_APP_UI_STAFF_OIDC_REDIRECT_URI'] ?? 'https://staff.inventra.localhost:1355/auth-redirect',
	response_type: 'code',
	scope: 'openid profile email',
	onSigninCallback: () => {
		globalThis.history.replaceState({}, document.title, globalThis.location.pathname);
	},
};
