const { MissingParam } = require('../../utils/errors/')

module.exports = class AuthUseCase {
  constructor(loadUserByEmailRepository, encrypter, tokenGenerator) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.encrypter = encrypter
    this.tokenGenerator = tokenGenerator
  }

  async auth(email, password) {
    if (!email) {
      throw new MissingParam('email')
    }

    if (!password) {
      throw new MissingParam('password')
    }

    const user = await this.loadUserByEmailRepository.load(email)
    const isValid = user && (await this.encrypter.compare(password, user.password))

    if (isValid) {
      const accessToken = await this.tokenGenerator.generate(user.id)
      return accessToken
    }

    return null
  }
}
