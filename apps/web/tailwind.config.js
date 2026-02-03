/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Cores principais
                primary: {
                    DEFAULT: '#5B7C6F',
                    foreground: '#FFFFFF',
                    50: '#EDF2F0',
                    100: '#D4E0DB',
                    200: '#A9C1B7',
                    300: '#7EA293',
                    400: '#5B7C6F',
                    500: '#4A6459',
                    600: '#3A4F46',
                    700: '#2A3A33',
                    800: '#1A2520',
                    900: '#0A100D',
                },
                secondary: {
                    DEFAULT: '#E8DFD5',
                    foreground: '#2D3436',
                },
                accent: {
                    DEFAULT: '#D4A574',
                    foreground: '#2D3436',
                },
                // Cores do Ikigai
                ikigai: {
                    love: '#E57373',
                    skills: '#64B5F6',
                    world: '#81C784',
                    paid: '#FFD54F',
                    passion: '#9575CD',
                    mission: '#4DB6AC',
                    vocation: '#AED581',
                    profession: '#FFB74D',
                    center: '#F8BBD9',
                },
                // Neutros
                background: '#FAF8F5',
                surface: '#FFFFFF',
                foreground: '#2D3436',
                muted: {
                    DEFAULT: '#F4F1ED',
                    foreground: '#636E72',
                },
                border: '#E8E4DF',
                ring: '#5B7C6F',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                heading: ['Outfit', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                lg: '0.75rem',
                md: '0.5rem',
                sm: '0.25rem',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
                'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
            },
        },
    },
    plugins: [],
};
