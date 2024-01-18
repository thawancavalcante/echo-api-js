import { Static, Type } from '@sinclair/typebox'

export const TokensResponse = Type.Object({
	accessToken: Type.String(),
})

export type TokensResponseType = Static<typeof TokensResponse>

export const RegisterBody = Type.Object({
	username: Type.String(),
	email: Type.String({ format: 'email' }),
	password: Type.String({ minLength: 8 }),
})

export type RegisterBodyType = Static<typeof RegisterBody>

export const LoginBody = Type.Object({
	email: Type.String({ format: 'email' }),
	password: Type.String({ minLength: 8 }),
})

export type LoginBodyType = Static<typeof LoginBody>
