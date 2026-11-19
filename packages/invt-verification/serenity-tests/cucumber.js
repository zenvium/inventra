export default {
	paths: ['features/**/*.feature'],
	import: ['src/serenity-config.ts', 'src/world.ts'],
	format: ['progress-bar', 'json:./reports/cucumber-report.json', 'html:./reports/cucumber-report.html'],
	formatOptions: { snippetInterface: 'async-await' },
	parallel: 0,
};
