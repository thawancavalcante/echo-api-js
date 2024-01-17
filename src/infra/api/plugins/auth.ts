import AuthService from '@domain/services/AuthService'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { StatusCode } from '../utils/StatusCode'
import ICustomFastifyRequest from '../interfaces/ICustomFastifyRequest'

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
			const refreshToken = request.cookies.rt
			const [type, accessToken] = (request.headers.authorization || '').split(' ')
			if (!accessToken) {
				throw 'Forbidden'
			}

			try {
				const decodedAccessToken = await authService.validateAccessToken(accessToken, refreshToken)
				if (!decodedAccessToken) {
					throw 'Forbidden'
				}

				request.userPayload = decodedAccessToken
			} catch (e) {
				reply.code(StatusCode.FORBIDDEN).send(e.message)
			}
		})
	},
	{ dependencies: ['cookie'] },
)
