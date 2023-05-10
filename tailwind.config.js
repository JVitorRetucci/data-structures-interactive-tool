// tailwind.config.js
module.exports = {
  content: [
    './source/presentation/pages/**/*.{js,ts,jsx,tsx}',
    './source/presentation/components/**/*.{js,ts,jsx,tsx}',
  ],
  mode: 'jit',
  theme: {
    extend: {
      colors: {
        'editor': '#1e1e1e'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
