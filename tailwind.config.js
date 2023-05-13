/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        corgi: {
          DEFAULT: '#E79B39',
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
