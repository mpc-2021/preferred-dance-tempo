const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {},
    container: (theme) => ({
      // To center containers by default
      center: true,

      // To add horizontal padding by default
      padding: theme("spacing.4"),
    }),
  },

  plugins: [],
};

module.exports = config;
