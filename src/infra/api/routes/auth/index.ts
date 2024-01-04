import { FastifyInstance, RegisterOptions } from 'fastify'
import IRouter from '../IRoute'
import IAuthRepository from '@domain/repositories/IAuthRepository'
import AuthController from '@application/controllers/AuthController'
import { StatusCode } from '../../utils/StatusCode'
import { LoginBodyType, RegisterBodyType, TokensResponseType, loginSchema, registerSchema } from './schema'

export default class AuthRoutes implements IRouter {
	private readonly options: RegisterOptions = { prefix: 'auth' }
	private readonly controller: AuthController

	constructor(readonly fastify: FastifyInstance, readonly repository: IAuthRepository) {
		this.controller = new AuthController(repository)
	}

	async register(): Promise<void> {
		this.fastify.register((fastify) => this.routes(fastify), this.options)
	}

	async routes(fastify: FastifyInstance): Promise<void> {
		fastify.post<{ Body: RegisterBodyType; Reply: TokensResponseType }>(
			'/register',
			registerSchema,
			async (request, reply) => {
				const response = await this.controller.regiter({
					email: request.body.email,
					password: request.body.password,
					username: request.body.username,
				})

				reply.status(StatusCode.CREATED).send(response as TokensResponseType)
			},
		)

		fastify.post<{ Body: LoginBodyType }>('/login', loginSchema, async (request, reply) => {
			const response = await this.controller.login({ email: request.body.email, password: request.body.password })
			reply.status(StatusCode.OK).send(response as TokensResponseType)
		})

		fastify.get('/', async (req, res) => {
			console.log(this.repository)
		})
	}
}
