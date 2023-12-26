import { LoginInput, RegisterInput } from '@application/dto/AuthDto'
import Tokens from '@domain/entities/Token'
import User from '@domain/entities/User'
import AuthService from '@domain/services/AuthService'

export default class AuthController {
	constructor(readonly service: AuthService) {}

	async regiter(input: RegisterInput): Promise<Tokens> {
		const newUser = await this.service.register(input)
		const tokens = await this.service.createTokens(newUser.id)
		return tokens
	}

	async login(input: LoginInput): Promise<Tokens> {
		const user = await this.service.login(input)
		const tokens = await this.service.createTokens(user.id)
		return tokens
	}

	async renew(code: string): Promise<Tokens> {
		const newTokens = await this.service.renewTokens(code)
		return newTokens
	}

	async revoke(code: string): Promise<boolean> {
		return this.service.revokeAuthCode(code)
	}
}
