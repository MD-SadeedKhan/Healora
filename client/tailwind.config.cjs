/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'healora-primary': '#5AC8FA',
        'healora-primary-light': '#82D9FF',
        'healora-accent': '#A1E3D8',
        'healora-background': '#f7faff',
        'navbar-bg': 'rgba(90, 200, 250, 0.1)',
        primary: '#38BDF8',
        background: 'hsl(var(--background))',
        border: 'hsl(var(--border))',
      },
    },
  },
  plugins: [],
};
