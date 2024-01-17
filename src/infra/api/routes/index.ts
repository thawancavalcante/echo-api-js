import { FastifyInstance, RegisterOptions } from 'fastify'
import IRouter from '../interfaces/IRoute'
import AuthRoutes from './auth'
import ServerRoutes from './server'
import AuthService from '@domain/services/AuthService'

export default class Router implements IRouter {
	private readonly options: RegisterOptions = { prefix: 'api' }
	private readonly authRoutes: AuthRoutes
	private readonly serverRoutes: ServerRoutes

	constructor(readonly fastify: FastifyInstance, readonly authService: AuthService) {
		this.serverRoutes = new ServerRoutes(fastify)
		this.authRoutes = new AuthRoutes(fastify, authService)
	}

	async register() {
		this.fastify.register(() => this.routes(), this.options)
	}

	async routes() {
		await Promise.all([this.serverRoutes.register(), this.authRoutes.register()])
	}
}
