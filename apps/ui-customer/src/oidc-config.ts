export const oidcConfig = {
	authority: import.meta.env['VITE_APP_UI_CUSTOMER_OIDC_AUTHORITY'] ?? 'https://mock-auth.inventra.localhost:1355/customer-customer',
	client_id: import.meta.env['VITE_APP_UI_CUSTOMER_OIDC_CLIENT_ID'] ?? 'inventra-customer',
	redirect_uri: import.meta.env['VITE_APP_UI_CUSTOMER_OIDC_REDIRECT_URI'] ?? 'https://customer.inventra.localhost:1355/auth-redirect',
	response_type: 'code',
	scope: 'openid profile email',
	onSigninCallback: () => {
		globalThis.history.replaceState({}, document.title, globalThis.location.pathname);
	},
};
