import User from '@domain/entities/User'
import { IAuthInput } from '@domain/useCases/interfaces/IAuth'

export default interface IAuthRepository {
	verifyEmailAlreadyUsed(email: string): Promise<boolean>
	getUserByEmail(email: string): Promise<User | undefined>
	getUserById(id: string): Promise<User | undefined>
	createUser(user: ICreateUserData): Promise<string>
	generateAuthCode(input: IAuthInput): Promise<string>
	saveAuth(input: IAuthInput, code: string): Promise<void>
	validateAuth(code: string): Promise<boolean>
	decodeAuth(code: string): Promise<User>
	revoke(code: string): Promise<boolean>
}

export interface ICreateUserData {
	email: string
	username: string
	hashPassword: string
}
