import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter: adapter(),
		adapter: adapter({ out: 'my-output-directory' }),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',

		files: {
			assets: 'static',
		},
	}
};

export default config;