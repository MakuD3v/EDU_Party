/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'rk-bg-dark': '#050a10',
                'rk-bg-teal-deep': '#0b1a26',
                'rk-teal-bright': '#00ffcc',
                'rk-teal-muted': '#1a4d55',
                'rk-gold': '#c49b66',
                'rk-text-white': '#e0e0e0',
                'rk-text-dim': '#7a8b99',
            },
            fontFamily: {
                'title': ['Cinzel', 'serif'],
                'body': ['Lato', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
