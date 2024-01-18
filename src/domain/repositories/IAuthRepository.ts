import { ContextPayload } from '@domain/entities/Context'
import { TokenPayload } from '@domain/entities/Token'
import User from '@domain/entities/User'

export default interface IAuthRepository {
	verifyEmailAlreadyUsed(email: string): Promise<boolean>
	getUserByEmail(email: string): Promise<User | undefined>
	getUserById(id: string): Promise<User | undefined>
	createUser(user: ICreateUserData): Promise<string>
	createRefreshToken(contextId: string, userId: string, expiresIn?: number): Promise<string>
	createAccessToken(contextId: string, userId: string): Promise<string>
	decodeToken(token: string): Promise<TokenPayload>
	createContext(payload: ContextPayload): Promise<string>
	getContext(contextId: string): Promise<ContextPayload>
	revokeContext(contextId: string): Promise<void>
	shouldRenewRefreshToken(currentExpiresIn: number): Promise<boolean>
}

export interface ICreateUserData {
	email: string
	username: string
	hashPassword: string
}
