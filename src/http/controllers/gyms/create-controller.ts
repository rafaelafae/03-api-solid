import { makeCreateGymUseCase } from "@/use-cases/factories/make-create-gym-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {

    const createGymBodySchemaBodySchema = z.object({
        title: z.string(),
        description: z.string().nullable(),
        phone: z.string().nullable(),
        latitude: z.coerce.number().refine(value => {
            return Math.abs(value) <= 90
        }),
        longitude: z.coerce.number().refine(value => {
            return Math.abs(value) <= 180
        }),
    })

    const { title, description, phone, latitude, longitude } = createGymBodySchemaBodySchema.parse(request.body)

    const createGymUseCase = makeCreateGymUseCase()

    await createGymUseCase.execute({
        title,
        description,
        phone,
        latitude,
        longitude
    })

    return reply.status(201).send()
}