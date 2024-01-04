import { Stage, env } from '@infra/config/env'

export default function loggerConfig() {
	if (env.stage === Stage.test) {
		return false
	}

	if (env.stage === Stage.local) {
		return {
			transport: {
				target: 'pino-pretty',
				options: {
					translateTime: 'HH:MM:ss',
					ignore: 'pid,hostname',
				},
			},
		}
	}

	return true
}
