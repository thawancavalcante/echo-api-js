import { FastifyInstance, RegisterOptions } from 'fastify'
import IRouter from '../../interfaces/IRoute'
import AuthController from '@application/controllers/AuthController'
import { StatusCode } from '../../utils/StatusCode'
import { LoginBody, LoginBodyType, RegisterBody, RegisterBodyType, TokensResponse, TokensResponseType } from './schema'
import AuthService from '@domain/services/AuthService'
import ICustomFastifyRequest from '@infra/api/interfaces/ICustomFastifyRequest'
import { cookieKey } from '@infra/api/utils/cookie'
import { HttpReasonPhrases } from '@infra/api/utils/HttpReasonPhrases'
import { ErrorResponse, ErrorResponseType } from '../schema'
import { CookieSerializeOptions } from '@fastify/cookie'

const refreshTokenCookieOptions: CookieSerializeOptions = {
	path: '/api/auth/',
	sameSite: true,
}

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
			async (req, reply) => {
				const tokens = await this.controller.regiter({
					email: req.body.email,
					password: req.body.password,
					username: req.body.username,
				})

				reply
					.setCookie(cookieKey.refreshToken, tokens.refreshToken, refreshTokenCookieOptions)
					.status(StatusCode.CREATED)
					.send(tokens as TokensResponseType)
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
			async (req, reply) => {
				const tokens = await this.controller.login({
					email: req.body.email,
					password: req.body.password,
				})

				reply
					.setCookie(cookieKey.refreshToken, tokens.refreshToken, refreshTokenCookieOptions)
					.status(StatusCode.OK)
					.send(tokens as TokensResponseType)
			},
		)

		fastify.post<{
			Reply: {
				[StatusCode.OK]: TokensResponseType
				[StatusCode.UNAUTHORIZED]: ErrorResponseType
			}
		}>(
			'/renew/access-token',
			{
				schema: {
					summary: 'Renew access token',
					tags: ['auth'],
					response: {
						[StatusCode.OK]: TokensResponse,
						[StatusCode.UNAUTHORIZED]: ErrorResponse,
					},
				},
			},
			async (req, reply) => {
				const refreshToken = req.cookies[cookieKey.refreshToken]
				if (!refreshToken) {
					return reply.code(StatusCode.UNAUTHORIZED).send({ message: HttpReasonPhrases.UNAUTHORIZED })
				}

				const tokens = await this.authService.renewAccessToken(refreshToken)

				reply
					.setCookie(cookieKey.refreshToken, tokens.refreshToken, {
						path: '/api/auth/',
						sameSite: true,
					})
					.status(StatusCode.OK)
					.send(tokens as TokensResponseType)
			},
		)

		fastify.post<{
			Reply: {
				[StatusCode.OK]: TokensResponseType
				[StatusCode.UNAUTHORIZED]: ErrorResponseType
			}
		}>(
			'/renew/refresh-token',
			{
				schema: {
					summary: 'Renew refresh token',
					tags: ['auth'],
					response: {
						[StatusCode.OK]: TokensResponse,
						[StatusCode.UNAUTHORIZED]: ErrorResponse,
					},
				},
			},
			async (req, reply) => {
				const refreshToken = req.cookies[cookieKey.refreshToken]
				if (!refreshToken) {
					return reply.code(StatusCode.UNAUTHORIZED).send({ message: HttpReasonPhrases.UNAUTHORIZED })
				}

				const tokens = await this.authService.renewRefreshToken(refreshToken)

				reply
					.setCookie(cookieKey.refreshToken, tokens.refreshToken, refreshTokenCookieOptions)
					.status(StatusCode.OK)
					.send(tokens as TokensResponseType)
			},
		)

		fastify.get(
			'/logout',
			{
				schema: {
					summary: 'Revoke token authentication permissions(logout)',
					tags: ['auth'],
					headers: {
						Authorization: true,
					},
				},
				onRequest: [fastify.authenticate],
			},
			async (req: ICustomFastifyRequest, reply) => {
				await this.controller.logout(req.userPayload.contextId, req.userPayload.userId)
				reply.clearCookie(cookieKey.refreshToken, refreshTokenCookieOptions).code(StatusCode.OK)
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
				console.log(this.authService.repository)
				reply.code(StatusCode.OK).send(req.userPayload)
			},
		)
	}
}
