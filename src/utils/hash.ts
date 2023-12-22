import * as bcrypt from 'bcrypt'

export async function generateHash(password: string, saltRounds = 10): Promise<string> {
	return bcrypt.hash(password, saltRounds)
}

export async function compareHash(password: string, hashPassword: string): Promise<boolean> {
	return bcrypt.compare(password, hashPassword)
}
