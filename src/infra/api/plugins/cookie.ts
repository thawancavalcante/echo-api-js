import { FastifyInstance } from 'fastify'

import fastifyCookie from '@fastify/cookie'
import fastifyPlugin from 'fastify-plugin'
import { env } from '@infra/config/env'

export default fastifyPlugin(
	async (fastify: FastifyInstance) => {
		await fastify.register(fastifyCookie, {
			secret: env.cookieSecret,
			parseOptions: {},
		})
	},
	{ name: 'cookie' },
)
