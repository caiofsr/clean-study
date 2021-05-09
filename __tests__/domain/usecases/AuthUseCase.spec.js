const AuthUseCase = require('../../../src/domain/usecases/AuthUseCase')
const { MissingParam } = require('../../../src/utils/errors')

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare(password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword

      return this.isValid
    }
  }

  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true

  return encrypterSpy
}

const makeLoadUserByEmailRepository = () => {
  class LoadUserByEmailRepositorySpy {
    async load(email) {
      this.email = email

      return this.user
    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = {
    id: 'any_id',
    password: 'hashed_password',
  }

  return loadUserByEmailRepositorySpy
}

const makeTokenGenerator = () => {
  class TokenGeneratorSpy {
    async generate(userId) {
      this.userId = userId

      return this.accessToken
    }
  }

  const tokenGeneratorSpy = new TokenGeneratorSpy()
  tokenGeneratorSpy.accessToken = 'any_token'

  return tokenGeneratorSpy
}

const makeSut = () => {
  const encrypterSpy = makeEncrypter()
  const tokenGeneratorSpy = makeTokenGenerator()
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()

  const sut = new AuthUseCase(loadUserByEmailRepositorySpy, encrypterSpy, tokenGeneratorSpy)

  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy,
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

  test('Should return null if invalid email was provided', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()

    loadUserByEmailRepositorySpy.user = null

    const accessToken = await sut.auth('invalid_email@mail.com', 'any_password')

    expect(accessToken).toBeNull()
  })

  test('Should return null if invalid password was provided', async () => {
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false

    const accessToken = await sut.auth('valid_email@mail.com', 'invalid_password')

    expect(accessToken).toBeNull()
  })

  test('Should call Encrypter with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut()

    await sut.auth('valid_email@mail.com', 'any_password')

    expect(encrypterSpy.password).toBe('any_password')
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password)
  })

  test('Should call TokenGenerator with correct userId', async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut()

    await sut.auth('valid_email@mail.com', 'valid_password')

    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
  })
})
