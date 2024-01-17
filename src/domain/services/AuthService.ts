import { compareHash, generateHash } from '@utils/hash'
import IAuthRepository from '@domain/repositories/IAuthRepository'
import { IRegisterInput, ILoginInput, IUserOutput } from '@domain/services/interfaces/IAuth'
import { TokenPayload, Tokens } from '@domain/entities/Token'
import { generateId } from '@utils/id'

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
		const contextId = await generateId()
		const refreshToken = await this.repository.createRefreshToken(userId, contextId)
		const accessToken = await this.repository.createAccessToken(userId, contextId)
		return {
			refreshToken,
			accessToken,
		}
	}

	private async validateTokensMismatch(accessToken: string, sessionRefreshToken: string): Promise<void> {
		const accessTokenDecoded = await this.repository.decodeToken(accessToken)
		const currentRefreshToken = await this.repository.getRefreshToken(accessTokenDecoded.contextId)
		if (!currentRefreshToken) {
			await this.mismatchErrorHandler()
		}
		const refreshTokenDecoded = await this.repository.decodeToken(currentRefreshToken)

		if (currentRefreshToken !== sessionRefreshToken) {
			const sessionRefreshTokenDecoded = await this.repository.decodeToken(sessionRefreshToken)
			const contextIdsToRevoke = [refreshTokenDecoded.contextId]

			if (sessionRefreshTokenDecoded.contextId !== refreshTokenDecoded.contextId) {
				contextIdsToRevoke.push(sessionRefreshTokenDecoded.contextId)
			}

			await this.revokeTokenByContextId(contextIdsToRevoke)
			await this.mismatchErrorHandler()
		}

		if (refreshTokenDecoded.contextId !== accessTokenDecoded.contextId) {
			await this.revokeTokenByContextId([refreshTokenDecoded.contextId, accessTokenDecoded.contextId])
			await this.mismatchErrorHandler()
		}

		if (refreshTokenDecoded.userId !== accessTokenDecoded.userId) {
			await this.repository.revokeRefreshToken(refreshTokenDecoded.contextId)
			await this.mismatchErrorHandler()
		}
	}

	private async mismatchErrorHandler(): Promise<void> {
		//TODO: log security error
		throw '401-Mismatch'
	}

	private async revokeTokenByContextId(contextIds: string[]): Promise<void> {
		const revokePromises: Promise<void>[] = contextIds.map((contextId) =>
			this.repository.revokeRefreshToken(contextId),
		)

		await Promise.all(revokePromises)
	}

	async validateAccessToken(accessToken: string, refreshToken: string): Promise<TokenPayload> {
		await this.validateTokensMismatch(accessToken, refreshToken)

		const accessTokenDecoded = await this.repository.decodeToken(accessToken)
		return accessTokenDecoded
	}

	async renewAccessToken(accessToken: string, refreshToken: string): Promise<Tokens> {
		await this.validateTokensMismatch(accessToken, refreshToken)
		const refreshTokenDecoded = await this.repository.decodeToken(refreshToken)

		const now = new Date()
		if (refreshTokenDecoded.expiresIn < now.valueOf()) {
			throw 'Refresh token expired'
		}

		const user = await this.repository.getUserById(refreshTokenDecoded.userId)
		if (!user) {
			throw 'User not found'
		}

		const updatedRefreshToken = await this.repository.updateRefreshToken(refreshTokenDecoded)

		const newAccessToken = await this.repository.createAccessToken(
			refreshTokenDecoded.userId,
			refreshTokenDecoded.contextId,
		)

		return {
			refreshToken: updatedRefreshToken,
			accessToken: newAccessToken,
		}
	}

	async renewRefreshToken(refreshToken: string): Promise<Tokens> {
		const refreshTokenDecoded = await this.repository.decodeToken(refreshToken)

		const now = new Date()
		if (refreshTokenDecoded.expiresIn < now.valueOf()) {
			throw 'Refresh token expired'
		}

		const user = await this.repository.getUserById(refreshTokenDecoded.userId)
		if (!user) {
			throw 'User not found'
		}

		const updatedRefreshToken = await this.repository.createRefreshToken(
			refreshTokenDecoded.userId,
			refreshTokenDecoded.contextId,
		)

		const newAccessToken = await this.repository.createAccessToken(
			refreshTokenDecoded.userId,
			refreshTokenDecoded.contextId,
		)

		return {
			refreshToken: updatedRefreshToken,
			accessToken: newAccessToken,
		}
	}

	async revokeRefreshToken(refreshToken: string): Promise<void> {
		const refreshTokenDecoded = await this.repository.decodeToken(refreshToken)
		this.repository.revokeRefreshToken(refreshTokenDecoded.contextId)
	}
}
