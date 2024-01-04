import { FastifyInstance, RegisterOptions } from 'fastify'
import IRouter from './IRoute'
import AuthRoutes from './auth'
import ApiRoutes from './api'
import InMemoryAuth from '@application/repositories/InMemoryAuth'

export default class Router implements IRouter {
	private readonly options: RegisterOptions = { prefix: 'api' }
	private readonly authRoutes: AuthRoutes
	private readonly apiRoutes: ApiRoutes

	constructor(readonly fastify: FastifyInstance) {
		this.apiRoutes = new ApiRoutes(fastify)

		const authRepo = new InMemoryAuth()
		this.authRoutes = new AuthRoutes(fastify, authRepo)
	}

	async register() {
		this.fastify.register(() => this.routes(), this.options)
	}

	async routes() {
		this.apiRoutes.register()
		this.authRoutes.register()
	}
}
