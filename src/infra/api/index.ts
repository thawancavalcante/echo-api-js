import Fastify from 'fastify'
import loggerConfig from './utils/logger'
import Router from './routes'
import { env } from '@infra/config/env'
import plugins from './plugins'
import InMemoryAuth from '@application/repositories/InMemoryAuth'
import AuthService from '@domain/services/AuthService'

export async function start() {
	const fastify = Fastify({
		logger: loggerConfig(),
	})

	const authRepository = new InMemoryAuth()
	const authService = new AuthService(authRepository)

	await fastify.register(plugins, { authService })

	await new Router(fastify, authService).register()

	fastify.listen({ port: env.port, host: env.host }, (err) => {
		if (err) {
			fastify.log.error(err)
			process.exit(1)
		}

		console.log(fastify.printRoutes())
	})
}
