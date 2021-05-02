const HttpResponse = require('../helpers/httpResponse')
const { MissingParam, InvalidParam } = require('../../utils/errors')

module.exports = class LoginRouter {
  constructor(authUseCase, emailValidator) {
    this.authUseCase = authUseCase
    this.emailValidator = emailValidator
  }

  route(httpRequest) {
    try {
      const { email, password } = httpRequest.body

      if (!email) {
        return HttpResponse.badRequest(new MissingParam('email'))
      }

      if (!this.emailValidator.isValid(email)) {
        return HttpResponse.badRequest(new InvalidParam('email'))
      }

      if (!password) {
        return HttpResponse.badRequest(new MissingParam('password'))
      }

      this.authUseCase.auth(email, password)

      const accessToken = this.authUseCase.auth(email, password)

      if (!accessToken) {
        return HttpResponse.unauthorizedError()
      }

      return HttpResponse.ok({ accessToken })
    } catch (error) {
      // console.error(error)

      return HttpResponse.internalError()
    }
  }
}
