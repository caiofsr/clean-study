const LoginRouter = require('../../../src/presentation/routers/loginRouter')
const { Unauthorized, ServerError } = require('../../../src/presentation/errors')
const { MissingParam, InvalidParam } = require('../../../src/utils/errors')

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase()
  const emailValidatorSpy = makeEmailValidator()
  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)

  return {
    sut,
    authUseCaseSpy,
    emailValidatorSpy,
  }
}

const makeEmailValidator = () => {
  class EmailValidatorSpy {
    isValid(email) {
      this.email = email
      return this.isEmailValid
    }
  }

  const emailValidatorSpy = new EmailValidatorSpy()
  emailValidatorSpy.isEmailValid = true

  return emailValidatorSpy
}

const makeAuthUseCase = () => {
  class AuthUseCaseSpy {
    auth(email, password) {
      this.email = email
      this.password = password

      return this.accessToken
    }
  }

  const authUseCaseSpy = new AuthUseCaseSpy()
  authUseCaseSpy.accessToken = 'valid_token'
  return authUseCaseSpy
}

const makeAuthUseCaseWithError = () => {
  class AuthUseCaseSpy {
    auth() {
      throw new Error()
    }
  }

  return new AuthUseCaseSpy()
}

const makeEmailValidatorWithError = () => {
  class EmailValidator {
    isValid() {
      throw new Error()
    }
  }

  return new EmailValidator()
}

describe('Login Router', () => {
  test('should return 400 if email was not provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        password: 'password',
      },
    }

    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParam('email'))
  })

  test('should return 400 if password was not provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'password@email.com',
      },
    }

    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParam('password'))
  })

  test('should return 500 if httpRequest was not provided', () => {
    const { sut } = makeSut()

    const httpResponse = sut.route()

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return 500 if httpRequest body was not provided', () => {
    const { sut } = makeSut()
    const httpRequest = {}

    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should call AuthUseCase with correct params', () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    }

    sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  test('should return 401 when invalid credentials are provided', () => {
    const { sut, authUseCaseSpy } = makeSut()
    authUseCaseSpy.accessToken = null

    const httpRequest = {
      body: {
        email: 'wrong_email@email.com',
        password: 'wrong_password',
      },
    }

    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new Unauthorized('email'))
  })

  test('should return 200 when valid credentials are provided', () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'valid_email@email.com',
        password: 'valid_password',
      },
    }

    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken)
  })

  test('should return 500 if no AuthUseCase is provided', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    }

    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return 500 if AuthUseCase has no auth method', () => {
    const sut = new LoginRouter({})
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    }

    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  test('should return 500 if AuthUseCase throws', () => {
    const authUseCaseSpy = makeAuthUseCaseWithError()
    const sut = new LoginRouter(authUseCaseSpy)

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    }

    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  test('should return 400 if an invalid email was provided', () => {
    const { sut, emailValidatorSpy } = makeSut()

    emailValidatorSpy.isEmailValid = false

    const httpRequest = {
      body: {
        email: 'invalid_email@mail.com',
        password: 'password',
      },
    }

    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParam('email'))
  })

  test('should return 500 if no EmailValidator was provided', () => {
    const authUseCaseSpy = makeAuthUseCase()
    const sut = new LoginRouter(authUseCaseSpy)

    const httpRequest = {
      body: {
        email: 'invalid_email@mail.com',
        password: 'password',
      },
    }

    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return 500 if EmailValidator has no isValid method', () => {
    const authUseCaseSpy = makeAuthUseCase()
    const sut = new LoginRouter(authUseCaseSpy, {})

    const httpRequest = {
      body: {
        email: 'invalid_email@mail.com',
        password: 'password',
      },
    }

    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return 500 if EmailValidator throws', () => {
    const authUseCaseSpy = makeAuthUseCase()
    const emailValidatorSpy = makeEmailValidatorWithError()
    const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    }

    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  test('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    }

    sut.route(httpRequest)
    expect(emailValidatorSpy.email).toBe(httpRequest.body.email)
  })
})
