/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'numu-primary': '#046A38', // Lebanese green
                'numu-secondary': '#CE1126', // Lebanese red
                'mitai-blue': '#1E3A8A', // Government blue
            }
        },
    },
    plugins: [],
}
