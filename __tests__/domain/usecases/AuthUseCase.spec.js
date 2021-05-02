const { MissingParam, InvalidParam } = require('../../../src/utils/errors')

class AuthUseCase {
  constructor(loadUserByEmailRepository) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
  }

  async auth(email, password) {
    if (!email) {
      throw new MissingParam('email')
    }

    if (!password) {
      throw new MissingParam('password')
    }

    if (!this.loadUserByEmailRepository) {
      throw new MissingParam('loadUserByEmailRepository')
    }

    if (!this.loadUserByEmailRepository.load) {
      throw new InvalidParam('loadUserByEmailRepository')
    }

    const user = await this.loadUserByEmailRepository.load(email)

    if (!user) {
      return null
    }
  }
}

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

    expect(promise).rejects.toThrow(new MissingParam('loadUserByEmailRepository'))
  })

  test('Should throw if repository has no load method', async () => {
    const sut = new AuthUseCase({})

    const promise = sut.auth('any_email@mail.com', 'any_password')

    expect(promise).rejects.toThrow(new InvalidParam('loadUserByEmailRepository'))
  })

  test('Should return null if LoadUserByEmailRepository returns null', async () => {
    const { sut } = makeSut()

    const accessToken = await sut.auth('invalid_email@mail.com', 'any_password')

    expect(accessToken).toBeNull()
  })
})
