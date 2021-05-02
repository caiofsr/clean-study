class AuthUseCase {
  async auth(email, password) {
    if (!email) {
      throw new Error()
    }
  }
}

describe('Auth Use Case', () => {
  test('Should throw if no email was provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth()

    expect(promise).rejects.toThrow()
  })
})
