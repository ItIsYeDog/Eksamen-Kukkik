module.exports = {
    content: [
      "./views/**/*.ejs",
      "./public/**/*.{js,css}"
    ],
    theme: {
      extend: {
        colors: {
            'primary': '#2563eb',
        },
        container: {
          center: true,
          padding: '1rem',
          screens: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
          },
        }
      },
    },
    plugins: [],
}