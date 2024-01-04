import { StatusCode } from '@infra/api/utils/StatusCode'
import { Static, Type } from '@sinclair/typebox'

export const TokensResponse = Type.Object({
	accessToken: Type.String(),
	refreshToken: Type.String(),
})

export type TokensResponseType = Static<typeof TokensResponse>

export const RegisterBody = Type.Object({
	username: Type.String(),
	email: Type.String({ format: 'email' }),
	password: Type.String({ minLength: 8 }),
})

export type RegisterBodyType = Static<typeof RegisterBody>

export const registerSchema = {
	schema: {
		summary: 'Register a new user',
		tags: ['auth'],
		body: RegisterBody,
		response: {
			[StatusCode.CREATED]: TokensResponse,
		},
	},
}

export const LoginBody = Type.Object({
	email: Type.String({ format: 'email' }),
	password: Type.String({ minLength: 8 }),
})

export type LoginBodyType = Static<typeof LoginBody>

export const loginSchema = {
	schema: {
		summary: 'Login with a exist user',
		tags: ['auth'],
		body: LoginBody,
		response: {
			[StatusCode.OK]: TokensResponse,
		},
	},
}
