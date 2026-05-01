/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'fade-in':    'fadeIn  0.4s ease-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'float':      'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { from:{ opacity:'0' },                              to:{ opacity:'1' } },
        slideUp: { from:{ opacity:'0', transform:'translateY(20px)' }, to:{ opacity:'1', transform:'translateY(0)' } },
        float:   { '0%,100%':{ transform:'translateY(0)' },           '50%':{ transform:'translateY(-8px)' } },
      },
      colors: {
        teal:   { DEFAULT:'#0d9488', dark:'#0f766e', light:'#ccfbf1' },
        orange: { DEFAULT:'#f97316', dark:'#ea580c', light:'#fff7ed' },
        violet: { DEFAULT:'#7c3aed', dark:'#6d28d9', light:'#ede9fe' },
      },
    },
  },
  plugins: [],
}
