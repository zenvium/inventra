import { registerManagedSerenityWorld } from '@cellix/serenity-framework/cucumber';
import { registerWorldLifecycleHooks } from '@cellix/serenity-framework/cucumber';
import { SerenityCast } from '@cellix/serenity-framework/serenity';
import type { E2EInfrastructureState } from '@cellix/serenity-framework/infrastructure/e2e';
import { infrastructure } from './infrastructure.ts';

export const InventraE2EWorld = registerManagedSerenityWorld<E2EInfrastructureState>({
	infrastructure,
	createCast: () => new SerenityCast({ useNotepad: true }),
});

export type InventraE2EWorld = InstanceType<typeof InventraE2EWorld>;

registerWorldLifecycleHooks<InventraE2EWorld>({
	before: async (world) => world.init(),
	after: async (world) => world.cleanup(),
	afterAll: () => infrastructure.stopAll(),
});
