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
	refreshTokenExpiresInDays: number
	accessTokenExpiresInHours: number
}

function setup(): IEnv {
	const STAGE = process.env.STAGE || Stage.local
	const PORT = parseIntOrDefault(process.env.PORT, 3000)
	const HOST = process.env.HOST || 'localhost'
	const JWT_SECRET = process.env.JWT_SECRET
	const COOKIE_SECRET = process.env.COOKIE_SECRET
	const REFRESH_TOKEN_EXPIRES_IN_DAYS = parseIntOrDefault(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS, 15)
	const ACCESS_TOKEN_EXPIRES_IN_HOURS = parseIntOrDefault(process.env.ACCESS_TOKEN_EXPIRES_IN_HOURS, 1)

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
		refreshTokenExpiresInDays: REFRESH_TOKEN_EXPIRES_IN_DAYS,
		accessTokenExpiresInHours: ACCESS_TOKEN_EXPIRES_IN_HOURS,
	}
}

function parseIntOrDefault(value: string | undefined, defaultValue: number): number {
	if (!value) {
		return defaultValue
	}

	return parseInt(value, 10)
}

export const env = setup()
