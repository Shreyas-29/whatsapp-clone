/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './app/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                'primary': '#25D366',
                'secondary': '#e9eaeb',
                'teal': '#128C7E',
                'teal2': '#075E54',
            }
        },
    },
    plugins: [
        require('tailwind-scrollbar-hide')
    ],
}