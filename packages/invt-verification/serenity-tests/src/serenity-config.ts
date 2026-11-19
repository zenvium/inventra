import { AfterAll, BeforeAll } from '@cucumber/cucumber';
import { ConsoleReporter } from '@serenity-js/console-reporter';
import { configure, Duration } from '@serenity-js/core';
import { SerenityBDDReporter } from '@serenity-js/serenity-bdd';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

BeforeAll(() => {
	mkdirSync(resolve(process.cwd(), 'target/site/serenity'), { recursive: true });
	configure({
		crew: [ConsoleReporter.fromJSON({ theme: 'auto' }), SerenityBDDReporter.fromJSON({})],
		cueTimeout: Duration.ofSeconds(5),
		interactionTimeout: Duration.ofSeconds(10),
	});
});

AfterAll(() => undefined);
