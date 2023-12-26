import { TokenPayload } from '@domain/entities/Token'
import User from '@domain/entities/User'
import IAuthRepository, { ICreateUserData } from '@domain/repositories/IAuthRepository'

export default class AuthRepositoryMock implements IAuthRepository {
	async updateRefreshToken(currentTokenPayload: TokenPayload): Promise<string> {
		throw `${this.updateRefreshToken.name} - Method not implemented`
	}
	async createRefreshToken(userId: string, contextId: string): Promise<string> {
		throw `${this.createRefreshToken.name} - Method not implemented`
	}

	async createAccessToken(userId: string, contextId: string): Promise<string> {
		throw `${this.createAccessToken.name} - Method not implemented`
	}

	async decodeToken(token: string): Promise<TokenPayload> {
		throw `${this.decodeToken.name} - Method not implemented`
	}

	async revokeRefreshToken(contextId: string): Promise<void> {
		throw `${this.revokeRefreshToken.name} - Method not implemented`
	}

	async getRefreshToken(contextId: string): Promise<string> {
		throw `${this.getRefreshToken.name} - Method not implemented`
	}

	async createUser(user: ICreateUserData): Promise<string> {
		throw `${this.createUser.name} - Method not implemented`
	}

	async getUserByEmail(email: string): Promise<User | undefined> {
		throw `${this.getUserByEmail.name} - Method not implemented`
	}

	async verifyEmailAlreadyUsed(email: string): Promise<boolean> {
		throw `${this.verifyEmailAlreadyUsed.name} - Method not implemented`
	}

	async getUserById(id: string): Promise<User> {
		throw `${this.getUserById.name} - Method not implemented`
	}
}
