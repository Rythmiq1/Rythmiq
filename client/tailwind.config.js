// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {

//       fontFamily: {
//         poppins: ["Poppins", "sans-serif"],
//       },
//       height: {
//         "1/10": "10%",
//         "9/10": "90%",
//       },
//       backgroundColor: {
//         "app-black": "#121212",
//       },
//       keyframes: {
//         slideDown: {
//           '0%': { transform: 'translateY(-100%)', opacity: '0' },
//           '100%': { transform: 'translateY(0)', opacity: '1' },
//         },
//       },
//       animation: {
//         slideDown: 'slideDown 0.8s ease-out', // Custom animation for sliding down
//       },

//     },
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      height: {
        "1/10": "10%",
        "9/10": "90%",
      },
      backgroundColor: {
        "app-black": "#121212",
      },
      keyframes: {
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        typing: {
          'from': { width: '0%' },
          'to': { width: '100%' },
        },
        blink: {
          '50%': { 'border-color': 'transparent' },
        },
      },
      animation: {
        slideDown: 'slideDown 0.8s ease-out',
        typing: 'typing 2s steps(20, end) forwards, blink 0.5s step-end infinite alternate',
      },
    },
  },
  plugins: [],
}
