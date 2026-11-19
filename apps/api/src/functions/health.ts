import type { AppHost } from '@cellix/api-core';
import type { HttpHandler } from '@azure/functions';
import type { ApplicationServices } from '@invt/application-services';

export const healthHandler = (applicationServices: AppHost<ApplicationServices>): HttpHandler =>
	async () => {
		await applicationServices.forRequest();
		return {
			jsonBody: { service: 'inventra-api', status: 'ok', timestamp: new Date().toISOString() },
		};
	};
