import { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import swagger from './swagger'
import { env, Stage } from '@infra/config/env'
import auth from './auth'
import AuthService from '@domain/services/AuthService'
import cookie from './cookie'

interface PluginsOptions {
	authService: AuthService
}

export default fastifyPlugin(async (fastify: FastifyInstance, opts: PluginsOptions) => {
	await Promise.all([
		fastify.register(cookie),
		fastify.register(auth, { authService: opts.authService }),
		env.stage === Stage.local ? fastify.register(swagger) : null,
	])
})
