import User from '@domain/entities/User'
import { IAuthInput } from '@domain/useCases/interfaces/IAuth'

export default interface IAuthRepository {
	verifyEmailAlreadyUsed(email: string): Promise<boolean>
	getUserByEmail(email: string): Promise<User | undefined>
	getUserById(id: string): Promise<User | undefined>
	createUser(user: ICreateUserData): Promise<string>
	generateAuthCode(input: IAuthInput): Promise<string>
	saveAuthCode(input: IAuthInput, code: string): Promise<void>
	validateAuthCode(code: string): Promise<boolean>
	decodeAuthCode(code: string): Promise<User | undefined>
	revokeAuthCode(code: string): Promise<boolean>
}

export interface ICreateUserData {
	email: string
	username: string
	hashPassword: string
}
