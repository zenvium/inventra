import { isE2E, NodeDevRunner, resolveWorkspaceRoot } from '@cellix/local-dev';
import { readDotEnv } from '@cellix/local-dev/files';
import path from 'node:path';

const workspaceRoot = resolveWorkspaceRoot();
const customerEnv = readDotEnv(path.join(workspaceRoot, 'apps/ui-customer/.env'));
const staffEnv = readDotEnv(path.join(workspaceRoot, 'apps/ui-staff/.env'));
const customerE2E = readDotEnv(path.join(workspaceRoot, 'apps/ui-customer/.env.e2e'));
const staffE2E = readDotEnv(path.join(workspaceRoot, 'apps/ui-staff/.env.e2e'));

new NodeDevRunner({
	entry: 'src/index.ts',
	settings: {
		VITE_APP_UI_CUSTOMER_OIDC_CLIENT_ID: 'inventra-customer',
		VITE_APP_UI_CUSTOMER_OIDC_REDIRECT_URI: 'https://customer.inventra.localhost:1355/auth-redirect',
		VITE_APP_UI_STAFF_OIDC_CLIENT_ID: 'inventra-staff',
		VITE_APP_UI_STAFF_OIDC_REDIRECT_URI: 'https://staff.inventra.localhost:1355/auth-redirect',
		...customerEnv,
		...staffEnv,
		...(isE2E() ? { ...customerE2E, ...staffE2E } : {}),
		BASE_URL: 'https://mock-auth.inventra.localhost',
	},
}).start();
