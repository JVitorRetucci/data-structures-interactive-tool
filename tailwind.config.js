// tailwind.config.js
module.exports = {
  content: [
    "./source/presentation/pages/**/*.{js,ts,jsx,tsx}",
    "./source/presentation/components/**/*.{js,ts,jsx,tsx}",
  ],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        editor: "#1e1e1e",
        canvas: "#27272a",
        dracula: {
          green: "#0DFA83",
          pink: "#FF79C5",
          purple: "#BF93F6",
          red: "#FF555A",
          cyan: "#7BE9FB",
          orange: "#FFB873",
          yellow: "#F1FA94",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
