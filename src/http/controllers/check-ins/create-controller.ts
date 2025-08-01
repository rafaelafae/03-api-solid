import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {

    const createCheckInParamsSchema = z.object({
        gymId: z.string().uuid(),
    })

    const createCheckInSchemaBodySchema = z.object({
        latitude: z.coerce.number().refine(value => {
            return Math.abs(value) <= 90
        }),
        longitude: z.coerce.number().refine(value => {
            return Math.abs(value) <= 180
        }),
    })

    const { gymId } = createCheckInParamsSchema.parse(request.params)
    const { latitude, longitude } = createCheckInSchemaBodySchema.parse(request.body)

    const checkInUseCase = makeCheckInUseCase()

    await checkInUseCase.execute({
        gymId,
        userId: request.user.sub,
        userLatitude: latitude,
        userLongitude: longitude,
    })

    return reply.status(201).send()
}