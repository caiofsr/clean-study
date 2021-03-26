class LoginRouter {
  route(httpRequest) {
    if (!httpRequest.body.email || !httpRequest.body.password) {
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
