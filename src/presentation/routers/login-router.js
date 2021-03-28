const HttpResponse = require('../helpers/http-response')

module.exports = class LoginRouter {
  constructor(authUseCase) {
    this.authUseCase = authUseCase
  }

  route(httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return HttpResponse.internalError()
    }

    const { email, password } = httpRequest.body

    if (!email) {
      return HttpResponse.badRequest('email')
    }

    if (!password) {
      return HttpResponse.badRequest('password')
    }

    this.authUseCase.auth(email, password)
  }
}
