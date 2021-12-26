import preprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-node";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),

    // hydrate the <div id="svelte"> element in src/app.html
    target: "#svelte",

    vite: () => ({
      define: {
        __VERSION__: JSON.stringify(process.env.npm_package_version)
      }
    })
  },

  preprocess: [preprocess({})],
};

export default config;
