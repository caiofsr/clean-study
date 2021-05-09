const AuthUseCase = require('../../../src/domain/usecases/AuthUseCase')
const { MissingParam } = require('../../../src/utils/errors')

const makeSut = () => {
  class LoadUserByEmailRepositorySpy {
    async load(email) {
      this.email = email
    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy)

  return {
    sut,
    loadUserByEmailRepositorySpy,
  }
}

describe('Auth Use Case', () => {
  test('Should throw if no email was provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth()

    expect(promise).rejects.toThrow(new MissingParam('email'))
  })

  test('Should throw if no password was provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('any_email@mail.com')

    expect(promise).rejects.toThrow(new MissingParam('password'))
  })

  test('Should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()

    sut.auth('any_email@mail.com', 'any_password')

    expect(loadUserByEmailRepositorySpy.email).toBe('any_email@mail.com')
  })

  test('Should throw if repository was not provided', async () => {
    const sut = new AuthUseCase()

    const promise = sut.auth('any_email@mail.com', 'any_password')

    expect(promise).rejects.toThrow()
  })

  test('Should throw if repository has no load method', async () => {
    const sut = new AuthUseCase({})

    const promise = sut.auth('any_email@mail.com', 'any_password')

    expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadUserByEmailRepository returns null', async () => {
    const { sut } = makeSut()

    const accessToken = await sut.auth('invalid_email@mail.com', 'any_password')

    expect(accessToken).toBeNull()
  })
})
