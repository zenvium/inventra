import { NodeDevRunner } from '@cellix/local-dev';
import { readDotEnv } from '@cellix/local-dev/files';

new NodeDevRunner({
	entry: 'src/index.ts',
	settings: {
		...readDotEnv('.env'),
		PORT: '50000',
		DB_NAME: 'inventra',
		REPL_SET_NAME: 'inventra',
	},
}).start();
