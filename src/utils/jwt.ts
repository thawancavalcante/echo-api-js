import { SignerOptions, createSigner, createVerifier } from 'fast-jwt'

//TODO: get that secret from .env
const secret = 'secreti'

export async function encode(payload: object, jwtHeaders?: SignerOptions): Promise<string> {
	const signer = createSigner({ key: async () => secret, ...jwtHeaders })
	return signer(payload)
}

const verifier = createVerifier({ key: async () => secret })
export async function decode(token: string): Promise<object> {
	return verifier(token)
}
