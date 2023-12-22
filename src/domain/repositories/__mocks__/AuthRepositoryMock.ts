import User from '@domain/entities/User'
import IAuthRepository, { ICreateUserData } from '@domain/repositories/IAuthRepository'
import { IAuthInput } from '@domain/useCases/interfaces/IAuth'

export default class AuthRepositoryMock implements IAuthRepository {
	async createUser(user: ICreateUserData): Promise<string> {
		throw 'Method not implemented'
	}

	async getUserByEmail(email: string): Promise<User | undefined> {
		throw 'Method not implemented'
	}

	async verifyEmailAlreadyUsed(email: string): Promise<boolean> {
		throw 'Method not implemented'
	}

	async decodeAuth(code: string): Promise<User> {
		throw 'Method not implemented'
	}

	async generateAuthCode(input: IAuthInput): Promise<string> {
		throw 'Method not implemented'
	}

	async getUserById(id: string): Promise<User> {
		throw 'Method not implemented'
	}

	async revoke(code: string): Promise<boolean> {
		throw 'Method not implemented'
	}

	async saveAuth(input: IAuthInput, code: string): Promise<void> {
		throw 'Method not implemented'
	}

	async validateAuth(code: string): Promise<boolean> {
		throw 'Method not implemented'
	}
}
