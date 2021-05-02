const validator = require('validator')
const EmailValidator = require('../../src/utils/emailValidator')

const makeSut = () => {
  return new EmailValidator()
}

describe('Email Validator', () => {
  test('Should return true if validator return true', () => {
    const sut = makeSut()
    const isEmailValid = sut.isValid('valid_email@mail.com')

    expect(isEmailValid).toBe(true)
  })

  test('Should return false if validator return false', () => {
    validator.isEmailValid = false
    const sut = makeSut()
    const isEmailValid = sut.isValid('invalid_email@mail.com')

    expect(isEmailValid).toBe(false)
  })

  test('Should call validator with correct email', () => {
    const sut = makeSut()
    const anyEmail = 'any_email@mail.com'

    sut.isValid(anyEmail)

    expect(validator.email).toBe(anyEmail)
  })
})
