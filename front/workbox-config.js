module.exports = {
	globDirectory: 'public/',
	globPatterns: [
		'**/*.{txt,png,ico,html,webmanifest}'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/,
		/^deda/
	],
	swDest: 'public/sw.js'
};