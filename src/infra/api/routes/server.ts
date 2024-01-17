import { FastifyInstance, RegisterOptions } from 'fastify'
import IRouter from '../interfaces/IRoute'
import { StatusCode } from '../utils/StatusCode'

export default class ServerRoutes implements IRouter {
	private readonly options: RegisterOptions = {}

	constructor(readonly fastify: FastifyInstance) {}

	async register() {
		this.fastify.register(this.routes, this.options)
	}

	async routes(fastify: FastifyInstance) {
		fastify.get(
			'/health',
			{
				schema: {
					summary: 'see autheticated user data',
					tags: ['server'],
					headers: {
						Authorization: true,
					},
				},
				onRequest: [fastify.authenticate],
			},
			async (request, reply) => {
				reply.code(StatusCode.OK)
			},
		)
	}
}
