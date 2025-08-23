/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'jetbrains-mono': ['JetBrains Mono', 'monospace'],
        'hostgrotesk': ['Host Grotesk', 'sans-serif']
      },
      keyframes: {
        fade: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        reveal: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        'bounce-messenger': {
          '0%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-0.15rem)' }, // very small lift (~2.5px)
        },
      },
      animation: {
        fade: "fade 0.3s ease forwards",
        reveal: "reveal 0.35s ease forwards",
        'bounce-messenger': 'bounce-messenger 1.4s infinite ease-in-out',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
