const { readdirSync } = require('fs')
let errors = {}

readdirSync(__dirname).forEach(file => {
  if (file !== 'index.js') {
    errors = { ...errors, [file.slice(0, -3)]: require(`./${file}`) }
  }
})

module.exports = errors
