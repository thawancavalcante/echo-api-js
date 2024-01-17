import 'dotenv/config'

export enum Stage {
	local = 'local',
	test = 'test',
	prod = 'prod',
}

interface IEnv {
	port: number
	host: string
	stage: Stage
	secret: string
	cookieSecret: string
}

function setup(): IEnv {
	const STAGE = process.env.STAGE || Stage.local
	const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000
	const HOST = process.env.HOST || 'localhost'
	const JWT_SECRET = process.env.JWT_SECRET
	const COOKIE_SECRET = process.env.COOKIE_SECRET

	if (!JWT_SECRET) {
		throw new Error('JWT_SECRET environment variable not found')
	}

	if (!COOKIE_SECRET) {
		throw new Error('COOKIE_SECRET environment variable not found')
	}

	if (!Object.values(Stage).includes(STAGE as Stage)) {
		throw new Error('Invalid STAGE environment variable')
	}
	return {
		port: PORT,
		host: HOST,
		stage: STAGE as Stage,
		secret: JWT_SECRET,
		cookieSecret: COOKIE_SECRET,
	}
}

export const env = setup()
