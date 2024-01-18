import fastifyPlugin from 'fastify-plugin'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { FastifyInstance } from 'fastify'

export default fastifyPlugin(async (fastify: FastifyInstance) => {
	await fastify.register(fastifySwagger, {
		mode: 'dynamic',
		openapi: {
			info: {
				title: 'Echo api',
				version: '1.0.0',
			},
			// TODO: adjust cookie schema to add refresh token
			// components: {
			// 	securitySchemes: {
			// 		[cookie.refreshToken]: {
			// 			type: 'apiKey',
			// 			in: 'cookie',
			// 			name: cookie.refreshToken,
			// 		},
			// 	},
			// },
		},
	})

	await fastify.register(fastifySwaggerUI, {
		routePrefix: '/api/docs',
		initOAuth: {},
		uiConfig: {
			docExpansion: 'full',
			deepLinking: false,
		},
		staticCSP: true,
	})
})
