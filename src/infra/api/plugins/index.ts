import { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import swagger from './swagger'
import { env, Stage } from '@infra/config/env'

export default fastifyPlugin(async (fastify: FastifyInstance) => {
	await Promise.all([env.stage === Stage.local ? fastify.register(swagger) : null])
})
