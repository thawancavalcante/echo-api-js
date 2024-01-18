import { ContextPayload } from '@domain/entities/Context'
import { TokenPayload } from '@domain/entities/Token'
import User from '@domain/entities/User'
import IAuthRepository, { ICreateUserData } from '@domain/repositories/IAuthRepository'
import { daysUntilExpiration } from '@infra/api/utils/daysUntilExpiration'
import { env } from '@infra/config/env'
import { generateId } from '@utils/id'
import { decode, encode } from '@utils/jwt'

const oneHourInMs = 1000 * 60 * 60
const oneDayIsMs = oneHourInMs * 24

export default class InMemoryAuth implements IAuthRepository {
	users: Map<string, User> = new Map<string, User>()
	cache: Map<string, ContextPayload> = new Map<string, ContextPayload>()

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

	async createRefreshToken(contextId: string, userId: string, expiresIn?: number): Promise<string> {
		const headerOptions = {
			sub: userId,
			jti: contextId,
			expiresIn: expiresIn || oneDayIsMs * env.refreshTokenExpiresInDays,
		}

		const token = await encode({}, headerOptions)
		return token
	}

	async createAccessToken(contextId: string, userId: string): Promise<string> {
		const headerOptions = {
			sub: userId,
			jti: contextId,
			expiresIn: oneHourInMs * env.accessTokenExpiresInHours,
		}

		return encode({}, headerOptions)
	}

	async decodeToken(token: string): Promise<TokenPayload> {
		const decoded = (await decode(token)) as {
			jti: string
			sub: string
			exp: number
		}

		return {
			contextId: decoded.jti,
			userId: decoded.sub,
			expiresIn: decoded.exp,
		}
	}

	async createContext(payload: ContextPayload): Promise<string> {
		const contextId = await generateId()
		this.cache.set(contextId, payload)
		return contextId
	}

	async getContext(contextId: string): Promise<ContextPayload> {
		return this.cache.get(contextId)
	}

	async revokeContext(contextId: string): Promise<void> {
		this.cache.delete(contextId)
	}

	async shouldRenewRefreshToken(currentExpiresIn: number): Promise<boolean> {
		const daysToExpires = daysUntilExpiration(currentExpiresIn)
		const halfOfNewTokensExpiresInDays = env.refreshTokenExpiresInDays / 2
		return daysToExpires < halfOfNewTokensExpiresInDays
	}
}
