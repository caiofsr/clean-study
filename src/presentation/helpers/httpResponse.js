const { ServerError, Unauthorized } = require('../errors')
module.exports = class HttpResponse {
  static badRequest(error) {
    return {
      statusCode: 400,
      body: error,
    }
  }

  static internalError() {
    return {
      statusCode: 500,
      body: new ServerError(),
    }
  }

  static unauthorizedError() {
    return {
      statusCode: 401,
      body: new Unauthorized(),
    }
  }

  static ok(data) {
    return {
      statusCode: 200,
      body: data,
    }
  }
}
