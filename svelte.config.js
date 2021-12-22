import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',

		// files: {
		// 	assets: 'static',
		// },
		// paths: {
		// 	assets: 'static'
		// }
	}
};

export default config;
