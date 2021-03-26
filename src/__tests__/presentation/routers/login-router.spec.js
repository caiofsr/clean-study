class LoginRouter {
  route(httpRequest) {
    const { email, password } = httpRequest.body

    if (!email || !password) {
      return {
        statusCode: 400,
      }
    }
  }
}

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
  })
})
