import { ContextPayload } from '@domain/entities/Context'
import { TokenPayload } from '@domain/entities/Token'
import User from '@domain/entities/User'
import IAuthRepository, { ICreateUserData } from '@domain/repositories/IAuthRepository'

export default class AuthRepositoryMock implements IAuthRepository {
	async verifyEmailAlreadyUsed(email: string): Promise<boolean> {
		throw `${this.verifyEmailAlreadyUsed.name} - Method not implemented`
	}
	async getUserByEmail(email: string): Promise<User> {
		throw `${this.getUserByEmail.name} - Method not implemented`
	}
	async getUserById(id: string): Promise<User> {
		throw `${this.getUserById.name} - Method not implemented`
	}
	async createUser(user: ICreateUserData): Promise<string> {
		throw `${this.createUser.name} - Method not implemented`
	}
	async createRefreshToken(contextId: string, userId: string, expiresIn?: number): Promise<string> {
		throw `${this.createRefreshToken.name} - Method not implemented`
	}
	async createAccessToken(contextId: string, userId: string): Promise<string> {
		throw `${this.createAccessToken.name} - Method not implemented`
	}
	async decodeToken(token: string): Promise<TokenPayload> {
		throw `${this.decodeToken.name} - Method not implemented`
	}
	async createContext(payload: ContextPayload): Promise<string> {
		throw `${this.createContext.name} - Method not implemented`
	}
	async getContext(contextId: string): Promise<ContextPayload> {
		throw `${this.getContext.name} - Method not implemented`
	}
	async revokeContext(contextId: string): Promise<void> {
		throw `${this.revokeContext.name} - Method not implemented`
	}
	async shouldRenewRefreshToken(currentExpiresIn: number): Promise<boolean> {
		throw `${this.shouldRenewRefreshToken.name} - Method not implemented`
	}
}
