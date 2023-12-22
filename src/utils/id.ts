import ksuid from 'ksuid'

export async function generateId(): Promise<string> {
	const id = await ksuid.random()
	return id.string
}
