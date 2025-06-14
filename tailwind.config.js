/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/index.html', './src/**/*.{js,jsx,ts,tsx}'], // Adjust paths as needed
  darkMode: 'class', // Enable dark mode using a class
  theme: {
    extend: {
      colors: {
        background: {
          light: '#F1F1F1',
          dark: '#181818',
        },
        onBackground: {
          light: '#222222',
          dark: '#E2E2E2',
        },
        surface: {
          light: '#F4FBF9',
          dark: '#0E1514',
        },
        onSurface: {
          light: '#161D1C',
          dark: '#DDE4E2',
        },
        primary: {
          light: '#277069',
          dark: '#76C7C0',
        },
        onPrimary: {
          light: '#FFFFFF',
          dark: '#003734',
        },
        primaryContainer: {
          light: '#9DF2EA',
          dark: '#00504C',
        },
        onPrimaryContainer: {
          light: '#00201E',
          dark: '#9DF2EA',
        },
        inversePrimary: {
          light: '#81D5CE',
          dark: '#006A65',
        },
      },
    },
  },
  plugins: [],
};
