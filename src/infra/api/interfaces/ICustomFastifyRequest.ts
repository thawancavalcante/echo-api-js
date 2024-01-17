import { TokenPayload } from '@domain/entities/Token'
import { FastifyRequest } from 'fastify'

export default interface ICustomFastifyRequest extends FastifyRequest {
	userPayload: TokenPayload
}
