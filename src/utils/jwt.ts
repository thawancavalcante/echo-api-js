import { env } from '@infra/config/env'
import { SignerOptions, createSigner, createVerifier } from 'fast-jwt'

export async function encode(payload: object, jwtHeaders?: SignerOptions): Promise<string> {
	const signer = createSigner({ key: async () => env.secret, ...jwtHeaders })
	return signer(payload)
}

const verifier = createVerifier({ key: async () => env.secret })
export async function decode(token: string): Promise<object> {
	return verifier(token)
}
