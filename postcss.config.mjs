/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {
      optimize: false,
    },
    autoprefixer: {},
  },
};

export default config;
