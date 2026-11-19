import { isE2E, ViteDevRunner } from '@cellix/local-dev';
import { readDotEnv } from '@cellix/local-dev/files';

const settings = {
	...readDotEnv('.env'),
	...(isE2E() ? readDotEnv('.env.e2e') : {}),
};

new ViteDevRunner({ settings }).start();
