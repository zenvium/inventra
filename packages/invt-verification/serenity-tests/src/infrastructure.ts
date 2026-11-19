import { E2EInfrastructure } from '@cellix/serenity-framework/infrastructure/e2e';

export const infrastructure = E2EInfrastructure.create({
	browserContextOptions: { ignoreHTTPSErrors: true },
}).finalize();
