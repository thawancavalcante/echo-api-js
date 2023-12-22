import { compareHash, generateHash } from '@utils/hash'
import IAuthRepository from '@domain/repositories/IAuthRepository'
import { IRegisterInput, ILoginInput, IUserOutput, IAuthInput } from '@domain/useCases/interfaces/IAuth'
import User from '@domain/entities/User'

export default class Auth {
	constructor(readonly repository: IAuthRepository) {}

	async register(input: IRegisterInput): Promise<IUserOutput> {
		const emailAlreadyUsed = await this.repository.verifyEmailAlreadyUsed(input.email)

		if (emailAlreadyUsed) {
			throw 'Your registration was not possible. Try again later.'
		}

		const hashPassword = await generateHash(input.password)

		const userId = await this.repository.createUser({
			email: input.email,
			hashPassword,
			username: input.username,
		})

		return { id: userId, email: input.email, username: input.username }
	}

	async login(input: ILoginInput): Promise<IUserOutput> {
		const user = await this.repository.getUserByEmail(input.email)

		if (!user) {
			throw 'Email or password incorrect'
		}

		const comparePassword = await compareHash(input.password, user.hashPassword)
		if (!comparePassword) {
			throw 'Email or password incorrect'
		}

		return { id: user.id, email: user.email, username: user.username }
	}

	async generateAuthCode(input: IAuthInput): Promise<string> {
		const code = await this.repository.generateAuthCode(input)
		await this.repository.saveAuthCode(input, code)
		return code
	}

	async validateAuthCode(code: string): Promise<User> {
		const valid = await this.repository.validateAuthCode(code)
		if (!valid) throw 'Forbidden'
		const userInfo = await this.repository.decodeAuthCode(code)
		return userInfo
	}

	async renewAuthCode(code: string): Promise<string> {
		const decodedInfos = await this.validateAuthCode(code)
		const user = await this.repository.getUserById(decodedInfos.id)
		if (!user) {
			throw 'User not found'
		}
		const newCode = await this.generateAuthCode({
			id: user.id,
			email: user.email,
			username: user.username,
		})
		return newCode
	}

	async revokeAuthCode(code: string): Promise<boolean> {
		return this.repository.revokeAuthCode(code)
	}
}
