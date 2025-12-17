/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'cartoony-yellow': '#FFD914',
                'cartoony-blue': '#29B6F6',
                'cartoony-blue-dark': '#1976D2',
                'cartoony-red': '#FF5252',
                'cartoony-green': '#4CAF50',
                'cartoony-purple': '#9C27B0',
                'cartoony-orange': '#FF9800',
                'cartoony-dark': '#1A1A1A',
                'cartoony-white': '#FFFFFF',
            },
            fontFamily: {
                'display': ['Fredoka', 'Arial', 'sans-serif'],
                'body': ['Roboto', 'Arial', 'sans-serif'],
            },
            boxShadow: {
                'cartoony': '0 4px 0 0 rgba(0,0,0,0.3)',
                'cartoony-lg': '0 6px 0 0 rgba(0,0,0,0.4)',
            }
        },
    },
    plugins: [],
}
