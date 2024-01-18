import { LoginInput, RegisterInput } from '@application/dto/AuthDto'
import { Tokens } from '@domain/entities/Token'
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

	async renewAccessToken(refreshToken: string): Promise<Tokens> {
		return this.service.renewAccessToken(refreshToken)
	}

	async renewRefreshToken(refreshToken: string): Promise<Tokens> {
		return this.service.renewRefreshToken(refreshToken)
	}

	async logout(contextId: string, userId: string): Promise<void> {
		await this.service.revokeAuthorization(contextId, userId)
	}
}
