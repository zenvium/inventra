import { createFileUserStore, createMockOAuth2Manager, discoverPortalConfigs, ensurePortInUrl, normalizeBaseUrl, type MockOAuth2PortalConfig, type PortalOidcConfig } from '@cellix/server-oauth2-mock-seedwork';
import path from 'node:path';

const appsDir = new URL('../../', import.meta.url).pathname;
const port = Number.parseInt(process.env['PORT'] ?? '1355', 10);
const baseUrl = ensurePortInUrl(process.env['BASE_URL'] ?? 'https://mock-auth.inventra.localhost:1355', port);
const portals: PortalOidcConfig[] = discoverPortalConfigs(appsDir);

if (portals.length === 0) throw new Error('No OIDC portal configs found under apps/ui-*');

const manager = createMockOAuth2Manager({ port, host: '127.0.0.1', baseUrl: normalizeBaseUrl(baseUrl) });

for (const portal of portals) {
	const config: MockOAuth2PortalConfig = {
		allowedRedirectUris: new Set([portal.redirectUri]),
		allowedRedirectUri: portal.redirectUri,
		redirectUriToAudience: new Map([[portal.redirectUri, portal.clientId]]),
		userStore: createFileUserStore(path.join(appsDir, portal.dirName), portal.configName),
		getUserProfile: () => ({ email: 'demo@inventra.example', given_name: 'Inventra', family_name: 'Demo' }),
	};
	await manager.register(portal.name, config);
	console.log(`[inventra-auth] registered ${portal.name}`);
}

const stop = async () => {
	await manager.stopAll();
	process.exit(0);
};
process.once('SIGINT', () => void stop());
process.once('SIGTERM', () => void stop());
