import { FastifyInstance, RegisterOptions } from 'fastify'
import IRouter from '../../interfaces/IRoute'
import AuthController from '@application/controllers/AuthController'
import { StatusCode } from '../../utils/StatusCode'
import { LoginBody, LoginBodyType, RegisterBody, RegisterBodyType, TokensResponse, TokensResponseType } from './schema'
import AuthService from '@domain/services/AuthService'
import ICustomFastifyRequest from '@infra/api/interfaces/ICustomFastifyRequest'
import { cookieKey } from '@infra/api/utils/cookie'

//TODO: need's a error handler
export default class AuthRoutes implements IRouter {
	private readonly options: RegisterOptions = { prefix: 'auth' }
	private readonly controller: AuthController

	constructor(readonly fastify: FastifyInstance, readonly authService: AuthService) {
		this.controller = new AuthController(authService)
	}

	async register(): Promise<void> {
		this.fastify.register((fastify) => this.routes(fastify), this.options)
	}

	async routes(fastify: FastifyInstance): Promise<void> {
		fastify.post<{ Body: RegisterBodyType; Reply: TokensResponseType }>(
			'/register',
			{
				schema: {
					summary: 'Register a new user',
					tags: ['auth'],
					body: RegisterBody,
					response: {
						[StatusCode.CREATED]: TokensResponse,
					},
				},
			},
			async (request, reply) => {
				const response = await this.controller.regiter({
					email: request.body.email,
					password: request.body.password,
					username: request.body.username,
				})

				reply
					.setCookie(cookieKey.refreshToken, response.refreshToken)
					.status(StatusCode.CREATED)
					.send(response as TokensResponseType)
			},
		)

		fastify.post<{ Body: LoginBodyType }>(
			'/login',
			{
				schema: {
					summary: 'Login with an exist user',
					tags: ['auth'],
					body: LoginBody,
					response: {
						[StatusCode.OK]: TokensResponse,
					},
				},
			},
			async (request, reply) => {
				const response = await this.controller.login({
					email: request.body.email,
					password: request.body.password,
				})

				reply
					.setCookie(cookieKey.refreshToken, response.refreshToken)
					.status(StatusCode.OK)
					.send(response as TokensResponseType)
			},
		)

		fastify.get(
			'/me',
			{
				schema: {
					summary: 'See autheticated user payload',
					tags: ['auth'],
					headers: {
						Authorization: true,
					},
				},
				onRequest: [fastify.authenticate],
			},
			async (req: ICustomFastifyRequest, reply) => {
				reply.code(StatusCode.OK).send(req.userPayload)
			},
		)
	}
}
