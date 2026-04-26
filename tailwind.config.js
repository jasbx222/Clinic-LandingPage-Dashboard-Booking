/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF8FB1",
          dark: "#E96A93",
          light: "#FFD1E0",
        },
        secondary: {
          DEFAULT: "#A78BFA",
          light: "#E6D6FF",
        },
        accent: {
          DEFAULT: "#34D399",
          light: "#D1FAE5",
        },
        bg: {
          main: "#F8FAFF",
          soft: "#FDF4F8",
        },
        text: {
          primary: "#1F2937",
          secondary: "#6B7280",
          muted: "#9CA3AF",
        },
        border: "#EEF2F7",
        lavender: "#A78BFA", // Keep for backward compatibility if needed
      },
      fontFamily: {
        sans: ['Cairo', 'Tajawal', 'Inter', 'sans-serif'],
        arabic: ['Cairo', 'Tajawal', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 10px 30px rgba(0,0,0,0.05)',
        'hover': '0 20px 50px rgba(0,0,0,0.08)',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #FF8FB1 0%, #A5C8FF 100%)',
        'soft-gradient': 'linear-gradient(180deg, #FDF4F8 0%, #F8FAFF 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,143,177,0.08) 0%, rgba(165,200,255,0.08) 100%)',
      }
    },
  },
  plugins: [],
}
