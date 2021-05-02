const { MissingParam } = require('../../../src/utils/errors')

class AuthUseCase {
  async auth(email, password) {
    if (!email) {
      throw new MissingParam('email')
    }

    if (!password) {
      throw new MissingParam('password')
    }
  }
}

describe('Auth Use Case', () => {
  test('Should throw if no email was provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth()

    expect(promise).rejects.toThrow(new MissingParam('email'))
  })

  test('Should throw if no password was provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('any_email@mail.com')

    expect(promise).rejects.toThrow(new MissingParam('password'))
  })
})
