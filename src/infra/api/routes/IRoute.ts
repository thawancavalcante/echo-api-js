import { FastifyInstance } from 'fastify'

export default abstract class IRouter {
	constructor(readonly fastify: FastifyInstance) {
		this.fastify = fastify
	}
	abstract register(): Promise<void>
	abstract routes(fastify: FastifyInstance): Promise<void>
}
