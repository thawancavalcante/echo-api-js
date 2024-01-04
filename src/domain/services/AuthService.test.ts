import AuthService from './AuthService'
import * as hashUtils from '@utils/hash'
import IAuthRepository from '@domain/repositories/IAuthRepository'
import AuthRepositoryMock from '@domain/repositories/__mocks__/AuthRepositoryMock'
jest.mock('@utils/id', () => ({ generateId: () => '123456789' }))

describe('AuthService', () => {
	let auth: AuthService
	let mockRepository: IAuthRepository

	beforeEach(() => {
		mockRepository = new AuthRepositoryMock()
		auth = new AuthService(mockRepository)
	})

	test('register - successful registration', async () => {
		const mockedId = 'mockedUserId'
		mockRepository.createUser = async () => {
			return mockedId
		}

		mockRepository.verifyEmailAlreadyUsed = async () => {
			return false
		}

		const registerInput = {
			email: 'newuser@example.com',
			password: 'password123',
			username: 'newuser',
		}

		const user = await auth.register(registerInput)

		expect(user.id).toBe(mockedId)
	})

	test('register - email already used', async () => {
		mockRepository.verifyEmailAlreadyUsed = async () => {
			return true
		}

		const registerInput = {
			email: 'test@example.com',
			password: 'password123',
			username: 'newuser',
		}

		await expect(auth.register(registerInput)).rejects.toEqual(
			'Your registration was not possible. Try again later.',
		)
	})

	test('login - successful login', async () => {
		const password = 'P4$$word!'
		const mockedUser = {
			id: 'mockedId',
			email: 'mocked@gmail.com',
			hashPassword: await hashUtils.generateHash(password),
			username: 'mocked',
		}

		mockRepository.getUserByEmail = async () => {
			return mockedUser
		}

		const loginInput = {
			email: mockedUser.email,
			password,
		}

		const user = await auth.login(loginInput)

		expect(user).toEqual({ id: mockedUser.id, email: mockedUser.email, username: mockedUser.username })
	})

	test('login - email not exists', async () => {
		mockRepository.getUserByEmail = async () => {
			return undefined
		}

		const loginInput = {
			email: 'nonexistent@example.com',
			password: 'password',
		}

		await expect(auth.login(loginInput)).rejects.toEqual('Email or password incorrect')
	})

	test('login - invalid password', async () => {
		const mockedUser = {
			id: 'mockedId',
			email: 'mocked@gmail.com',
			hashPassword: await hashUtils.generateHash('P4$$word!'),
			username: 'mocked',
		}

		mockRepository.getUserByEmail = async () => {
			return mockedUser
		}

		const loginInput = {
			email: mockedUser.email,
			password: 'wrong_password',
		}

		await expect(auth.login(loginInput)).rejects.toEqual('Email or password incorrect')
	})

	test('createTokens - get access token', async () => {
		const mockedCode = 'generated.code'
		const userId = 'mockedUserId'

		mockRepository.createRefreshToken = async () => {
			return 'refreshToken'
		}
		mockRepository.createAccessToken = async () => {
			return mockedCode
		}

		const tokens = await auth.createTokens(userId)

		expect(tokens.accessToken).toEqual(mockedCode)
	})

	test('validateTokensMismatch - valid tokens', async () => {
		const refreshToken = 'refresh.token'
		mockRepository.getRefreshToken = async () => {
			return refreshToken
		}

		mockRepository.decodeToken = async () => {
			const oneHour = 60 * 60 * 1000
			return {
				contextId: 'ctxId',
				expiresIn: new Date().valueOf() + oneHour,
				userId: 'usrId',
			}
		}

		await expect(auth['validateTokensMismatch']('access.token', refreshToken)).resolves.toBeUndefined()
	})

	test('validateTokensMismatch - invalid refresh token', async () => {
		mockRepository.getRefreshToken = async () => {
			return 'another.token'
		}

		mockRepository.decodeToken = async (token: string) => {
			const oneHour = 60 * 60 * 1000
			return {
				contextId: token,
				expiresIn: new Date().valueOf() + oneHour,
				userId: 'usrId',
			}
		}

		mockRepository.revokeRefreshToken = async () => {}

		await expect(auth['validateTokensMismatch']('access.token', 'refresh.token')).rejects.toEqual('401-Mismatch')
	})

	test('validateTokensMismatch - invalid context id', async () => {
		const refreshToken = 'refresh.token'
		mockRepository.getRefreshToken = async () => {
			return refreshToken
		}

		mockRepository.decodeToken = async (token: string) => {
			const oneHour = 60 * 60 * 1000
			return {
				contextId: token,
				expiresIn: new Date().valueOf() + oneHour,
				userId: 'usrId',
			}
		}

		mockRepository.revokeRefreshToken = async () => {}

		await expect(auth['validateTokensMismatch']('access.token', refreshToken)).rejects.toEqual('401-Mismatch')
	})

	test('validateTokensMismatch - invalid user id', async () => {
		const refreshToken = 'refresh.token'
		mockRepository.getRefreshToken = async () => {
			return refreshToken
		}

		mockRepository.decodeToken = async (token: string) => {
			const oneHour = 60 * 60 * 1000
			return {
				contextId: 'ctxid',
				expiresIn: new Date().valueOf() + oneHour,
				userId: token,
			}
		}

		mockRepository.revokeRefreshToken = async () => {}

		await expect(auth['validateTokensMismatch']('access.token', refreshToken)).rejects.toEqual('401-Mismatch')
	})
})
