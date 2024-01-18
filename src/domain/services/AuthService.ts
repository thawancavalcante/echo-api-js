import { compareHash, generateHash } from '@utils/hash'
import IAuthRepository from '@domain/repositories/IAuthRepository'
import { IRegisterInput, ILoginInput, IUserOutput } from '@domain/services/interfaces/IAuth'
import { TokenPayload, Tokens } from '@domain/entities/Token'

//TODO: get fingerprint props to know about the user device, with that we can create a way to manager connected devices
export default class AuthService {
	constructor(readonly repository: IAuthRepository) {}

	async register(input: IRegisterInput): Promise<IUserOutput> {
		const emailAlreadyUsed = await this.repository.verifyEmailAlreadyUsed(input.email)

		if (emailAlreadyUsed) {
			throw 'Your registration was not possible. Try again later.'
		}

		const hashPassword = await generateHash(input.password)

		const userId = await this.repository.createUser({
			email: input.email,
			hashPassword,
			username: input.username,
		})

		return { id: userId, email: input.email, username: input.username }
	}

	async login(input: ILoginInput): Promise<IUserOutput> {
		const user = await this.repository.getUserByEmail(input.email)

		if (!user) {
			throw 'Email or password incorrect'
		}

		const comparePassword = await compareHash(input.password, user.hashPassword)
		if (!comparePassword) {
			throw 'Email or password incorrect'
		}

		return { id: user.id, email: user.email, username: user.username }
	}

	async createTokens(userId: string): Promise<Tokens> {
		const contextId = await this.repository.createContext({ userId })
		const refreshToken = await this.repository.createRefreshToken(contextId, userId)
		const accessToken = await this.repository.createAccessToken(contextId, userId)

		return {
			refreshToken,
			accessToken,
		}
	}

	async validateToken(token: string): Promise<TokenPayload> {
		const tokenDecoded = await this.repository.decodeToken(token)
		const context = await this.repository.getContext(tokenDecoded.contextId)
		if (!context) {
			throw 'Forbidden'
		}

		if (tokenDecoded.userId !== context.userId) {
			await this.repository.revokeContext(tokenDecoded.contextId)
			//TODO: log security error
			throw '401-Mismatch'
		}

		return tokenDecoded
	}

	async renewAccessToken(refreshToken: string): Promise<Tokens> {
		const refreshTokenDecoded = await this.validateToken(refreshToken)
		const oldContextId = refreshTokenDecoded.contextId

		const contextId = await this.repository.createContext({ userId: refreshTokenDecoded.userId })
		await this.repository.revokeContext(oldContextId)

		const shouldRenewRefreshToken = await this.repository.shouldRenewRefreshToken(refreshTokenDecoded.expiresIn)

		const refreshTokenModified = await this.repository.createRefreshToken(
			contextId,
			refreshTokenDecoded.userId,
			shouldRenewRefreshToken ? undefined : refreshTokenDecoded.expiresIn,
		)

		const newAccessToken = await this.repository.createAccessToken(contextId, refreshTokenDecoded.userId)

		return {
			refreshToken: refreshTokenModified,
			accessToken: newAccessToken,
		}
	}

	async renewRefreshToken(refreshToken: string): Promise<Tokens> {
		const { userId, contextId: oldContextId } = await this.validateToken(refreshToken)

		const contextId = await this.repository.createContext({ userId })
		await this.repository.revokeContext(oldContextId)

		const newRefreshToken = await this.repository.createRefreshToken(contextId, userId)
		const newAccessToken = await this.repository.createAccessToken(contextId, userId)

		return {
			refreshToken: newRefreshToken,
			accessToken: newAccessToken,
		}
	}

	async revokeAuthorization(contextId: string, userId: string): Promise<void> {
		const context = await this.repository.getContext(contextId)

		if (context.userId !== userId) {
			//log security error
			throw 'Forbiden'
		}

		await this.repository.revokeContext(contextId)
	}
}
