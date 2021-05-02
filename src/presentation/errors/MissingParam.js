module.exports = class MissingParam extends Error {
  constructor(paramName) {
    super(`Missing param: ${paramName}`)
    this.name = 'MissingParamError'
  }
}
