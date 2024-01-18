import { Static, Type } from '@sinclair/typebox'

export const ErrorResponse = Type.Object({
	message: Type.String(),
})

export type ErrorResponseType = Static<typeof ErrorResponse>
