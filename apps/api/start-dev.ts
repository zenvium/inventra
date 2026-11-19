import { existsSync } from 'node:fs';
import { AzureFunctionsDevRunner, buildAzuriteConnectionString, getAzuritePorts } from '@cellix/local-dev';
import { readDotEnv, readJsonFile } from '@cellix/local-dev/files';

interface LocalSettingsDocument {
	Values?: Record<string, unknown>;
	Host?: Record<string, unknown>;
}

const exampleSettings = readJsonFile<LocalSettingsDocument>('local.settings.example.json');
const localSettings = existsSync('local.settings.json') ? readJsonFile<LocalSettingsDocument>('local.settings.json') : undefined;
const userValues = { ...(exampleSettings?.Values ?? {}), ...(localSettings?.Values ?? {}) };
delete userValues['PORT'];
const values = { ...userValues, ...readDotEnv('.env') };
const azuriteKeys = ['AzureWebJobsStorage'] as const;
const storageSetting = String(values['AzureWebJobsStorage'] ?? '');
const azuriteConnectionString = buildAzuriteConnectionString({
	accountName: String(values['AZURE_STORAGE_ACCOUNT_NAME'] ?? 'devstoreaccount1'),
	accountKey: String(values['BLOB_QUEUE_ACCOUNT_KEY'] ?? exampleSettings?.Values?.['BLOB_QUEUE_ACCOUNT_KEY'] ?? ''),
	ports: getAzuritePorts(''),
});
for (const key of azuriteKeys) {
	if (values[key] === 'UseDevelopmentStorage=true' || /(?:^|;)AccountKey=;/.test(storageSetting)) values[key] = azuriteConnectionString;
}

new AzureFunctionsDevRunner({
	scriptRoot: '.',
	localSettings: {
		scriptRoot: '.',
		values: {
			FUNCTIONS_WORKER_RUNTIME: 'node',
			FUNCTIONS_EXTENSION_VERSION: '~4',
			MONGODB_URI: 'mongodb://127.0.0.1:50000/inventra',
			...values,
		},
		...(localSettings?.Host ? { host: localSettings.Host } : {}),
		worktreeConversion: { mongoKeys: ['MONGODB_URI'], azuriteKeys: [...azuriteKeys] },
	},
}).start();
