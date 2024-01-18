import AuthService from '@domain/services/AuthService'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { StatusCode } from '../utils/StatusCode'
import ICustomFastifyRequest from '../interfaces/ICustomFastifyRequest'
import { HttpReasonPhrases } from '../utils/HttpReasonPhrases'

declare module 'fastify' {
	interface FastifyInstance {
		authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>
	}
}

interface AuthenticateOptions {
	authService: AuthService
}

export default fastifyPlugin(
	async (fastify: FastifyInstance, { authService }: AuthenticateOptions) => {
		fastify.decorate('authenticate', async (request: ICustomFastifyRequest, reply: FastifyReply) => {
			const [type, accessToken] = (request.headers.authorization || '').split(' ')

			if (!accessToken) {
				throw HttpReasonPhrases.FORBIDDEN
			}

			try {
				const decodedAccessToken = await authService.validateToken(accessToken)
				if (!decodedAccessToken) {
					throw HttpReasonPhrases.FORBIDDEN
				}

				request.userPayload = decodedAccessToken
			} catch (e) {
				reply.code(StatusCode.FORBIDDEN).send(HttpReasonPhrases.FORBIDDEN)
			}
		})
	},
	{ dependencies: ['cookie'] },
)
