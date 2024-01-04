import Fastify from 'fastify'
import loggerConfig from './utils/logger'
import Router from './routes'
import { env } from '@infra/config/env'
import plugins from './plugins'

export async function start() {
	const fastify = Fastify({
		logger: loggerConfig(),
	})

	await fastify.register(plugins)
	await new Router(fastify).register()

	fastify.listen({ port: env.port, host: env.host }, (err, address) => {
		if (err) {
			fastify.log.error(err)
			process.exit(1)
		}

		console.log(fastify.printRoutes())
	})
}
