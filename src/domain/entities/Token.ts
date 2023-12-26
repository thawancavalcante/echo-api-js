export interface Tokens {
	accessToken?: string
	refreshToken: string
}

export interface TokenPayload {
	contextId: string
	userId: string
	expiresIn: number
}
