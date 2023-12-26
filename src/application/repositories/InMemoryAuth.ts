import { TokenPayload } from '@domain/entities/Token'
import User from '@domain/entities/User'
import IAuthRepository, { ICreateUserData } from '@domain/repositories/IAuthRepository'
import { decode, encode } from '@utils/jwt'

export default class InMemoryAuth implements IAuthRepository {
	users: Map<string, User> = new Map<string, User>()
	cache: Map<string, string> = new Map<string, string>()

	async createUser(user: ICreateUserData): Promise<string> {
		const newId = `${this.users.size}`
		this.users.set(user.email, { id: newId, ...user })
		return newId
	}

	async getUserByEmail(email: string): Promise<User | undefined> {
		if (this.users.has(email)) {
			return this.users.get(email)
		}

		return
	}

	async verifyEmailAlreadyUsed(email: string): Promise<boolean> {
		return this.users.has(email)
	}

	async getUserById(id: string): Promise<User> {
		const key = [...this.users.keys()][+id]
		if (!key) {
			return
		}

		return this.users.get(key)
	}

	async createRefreshToken(userId: string, contextId: string): Promise<string> {
		const headerOptions = {
			sub: userId,
			jti: contextId,
			expiresIn: '15d',
		}

		const token = await encode({}, headerOptions)

		this.cache.set(contextId, token)
		return token
	}

	async updateRefreshToken(currentTokenPayload: TokenPayload): Promise<string> {
		const headerOptions = {
			sub: currentTokenPayload.userId,
			jti: currentTokenPayload.contextId,
			expiresIn: currentTokenPayload.expiresIn,
		}

		const token = await encode({}, headerOptions)

		this.cache.set(currentTokenPayload.contextId, token)
		return token
	}

	async createAccessToken(userId: string, contextId: string): Promise<string> {
		const headerOptions = {
			sub: userId,
			jti: contextId,
			expiresIn: '15m',
		}

		return encode({}, headerOptions)
	}

	async decodeToken(token: string): Promise<TokenPayload> {
		const decoded = (await decode(token)) as {
			jti: string
			sub: string
			expiresIn: number
		}

		return {
			contextId: decoded.jti,
			userId: decoded.sub,
			expiresIn: decoded.expiresIn,
		}
	}

	async revokeRefreshToken(contextId: string): Promise<void> {
		this.cache.delete(contextId)
	}

	async getRefreshToken(contextId: string): Promise<string> {
		return this.cache.get(contextId)
	}
}
