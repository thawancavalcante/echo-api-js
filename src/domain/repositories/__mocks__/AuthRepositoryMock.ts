import User from '@domain/entities/User'
import IAuthRepository, { ICreateUserData } from '@domain/repositories/IAuthRepository'
import { IAuthInput } from '@domain/useCases/interfaces/IAuth'

export default class AuthRepositoryMock implements IAuthRepository {
	async createUser(user: ICreateUserData): Promise<string> {
		throw `${this.createUser.name} - Method not implemented`
	}

	async getUserByEmail(email: string): Promise<User | undefined> {
		throw `${this.getUserByEmail.name} - Method not implemented`
	}

	async verifyEmailAlreadyUsed(email: string): Promise<boolean> {
		throw `${this.verifyEmailAlreadyUsed.name} - Method not implemented`
	}

	async decodeAuthCode(code: string): Promise<User> {
		throw `${this.decodeAuthCode.name} - Method not implemented`
	}

	async generateAuthCode(input: IAuthInput): Promise<string> {
		throw `${this.generateAuthCode.name} - Method not implemented`
	}

	async getUserById(id: string): Promise<User> {
		throw `${this.getUserById.name} - Method not implemented`
	}

	async revokeAuthCode(code: string): Promise<boolean> {
		throw `${this.revokeAuthCode.name} - Method not implemented`
	}

	async saveAuthCode(input: IAuthInput, code: string): Promise<void> {
		throw `${this.saveAuthCode.name} - Method not implemented`
	}

	async validateAuthCode(code: string): Promise<boolean> {
		throw `${this.validateAuthCode.name} - Method not implemented`
	}
}
