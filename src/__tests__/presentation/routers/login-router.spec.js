const LoginRouter = require('../../../presentation/routers/login-routes')
const MissingParamError = require('../../../presentation/helpers/missing-param-error')

describe('Login Router', () => {
  test('should return 400 if email was not provided', () => {
    const sut = new LoginRouter()

    const httpRequest = {
      body: {
        password: 'password',
      },
    }

    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('should return 400 if password was not provided', () => {
    const sut = new LoginRouter()

    const httpRequest = {
      body: {
        email: 'password@email.com',
      },
    }

    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('should return 500 if httpRequest was not provided', () => {
    const sut = new LoginRouter()

    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })

  test('should return 500 if httpRequest body was not provided', () => {
    const sut = new LoginRouter()
    const httpRequest = {}

    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })
})
