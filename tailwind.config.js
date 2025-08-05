/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.html",
    "./src/**/*.{js,ts,jsx,tsx}", // sesuaikan dengan lokasi file kamu
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        meaculpa: ['"Mea Culpa"', "cursive"],
        poppins: ['"Poppins"', "sans-serif"],
        chonburi: ['"Chonburi"', "cursive"],
      },

      // -- Custom sizing dalam satuan px --
      spacing: {
        '1px':  '1px',
        '2px':  '2px',
        '4px':  '4px',
        '6px':  '6px',
        '8px':  '8px',
        '10px': '10px',
        '12px': '12px',
        '16px': '16px',
        '20px': '20px',
        '24px': '24px',
        '32px': '32px',
        '48px': '48px',
        '64px': '64px',
      },
      width: theme => ({
        ...theme('spacing'),   // bawa semua spacing ke width
        '10px': '10px',
        '20px': '20px',
        '25px': '25px',
        '30px': '30px',
        '40px': '40px',
        '50px': '50px',
        '60px': '60px', 
        '70px': '70px',
        '80px': '80px',
        '90px': '90px',
        '100px': '100px',
        '120px': '120px',
        '150px': '150px',
        '200px': '200px',
        '250px': '250px',
        '300px': '300px',
      }),
      height: theme => ({
        ...theme('spacing'),   // bawa semua spacing ke height
        '10px': '10px',
        '20px': '20px',
        '30px': '30px',
        '40px': '40px',
        '50px': '50px',
        '60px': '60px', 
        '70px': '70px',
        '80px': '80px',
        '90px': '90px',
        '100px': '100px',
        '120px': '120px',
        '150px': '150px',
        '200px': '200px',
        '250px': '250px',
        '300px': '300px',
      }),
    },
  },
  plugins: [],
};
