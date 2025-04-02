/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
  ],
  safelist: "grid grid-cols-2 grid-cols-3 grid-cols-4 grid-cols-5 grid-cols-6 grid-cols-7 bg-green-100 bg-gray-100".split(' '),
  theme: {
    extend: {
      container: {
        center: true
      },
      colors: {
      }
    },
  },
  plugins: [
  ],
};
