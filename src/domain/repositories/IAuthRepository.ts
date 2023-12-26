import { TokenPayload } from '@domain/entities/Token'
import User from '@domain/entities/User'

export default interface IAuthRepository {
	verifyEmailAlreadyUsed(email: string): Promise<boolean>
	getUserByEmail(email: string): Promise<User | undefined>
	getUserById(id: string): Promise<User | undefined>
	createUser(user: ICreateUserData): Promise<string>
	createRefreshToken(userId: string, contextId: string): Promise<string>
	createAccessToken(userId: string, contextId: string): Promise<string>
	decodeToken(token: string): Promise<TokenPayload>
	revokeRefreshToken(contextId: string): Promise<void>
	getRefreshToken(contextId: string): Promise<string>
	updateRefreshToken(currentTokenPayload: TokenPayload): Promise<string>
}

export interface ICreateUserData {
	email: string
	username: string
	hashPassword: string
}
