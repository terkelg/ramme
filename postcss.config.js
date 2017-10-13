module.exports = ({ file, options, env }) => ({
  plugins: {
    'autoprefixer': {
      grid: false
    },
    'cssnano': true
  }
})
