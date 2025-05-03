/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // Include all files in the src folder
    ],
    theme: {
      extend: {
        colors: {
          // Add custom colors if needed
          primary: "#4F46E5", // Example: Indigo
          secondary: "#6B7280", // Example: Gray
        },
      },
    },
    plugins: [
      require('@tailwindcss/forms'), // Include Tailwind Forms plugin for better form styling
    ],
  };