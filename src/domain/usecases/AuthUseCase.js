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
    if (!user) {
      return null
    }

    const isValid = await this.encrypter.compare(password, user.password)
    if (!isValid) {
      return null
    }

    await this.tokenGenerator.generate(user.id)
  }
}
