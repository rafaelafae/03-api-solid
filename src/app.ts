import { checkInRoutes } from "./http/controllers/check-ins/routes";
import { gymsRoutes } from "./http/controllers/gyms/routes";
import { usersRoutes } from "./http/controllers/users/routes";
import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { ZodError } from "zod";
import { env } from "@/env";

export const app = fastify()

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
        cookieName: 'refreshToken',
        signed: false,
    },
    sign: {
        expiresIn: '10m',
        // Token gerado com tempo de expiração (10 minutos) para revalidar token 
        // Checa se existe um refresh token dentro do contexto da requisição, se sim, criar um novo)
    }
})

app.register(fastifyCookie)

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInRoutes)

app.setErrorHandler((error, _request, reply) => {

    if (error instanceof ZodError) {
        return reply
            .status(400)
            .send({ message: 'Validation error', issues: error.format() })
    }

    if (env.NODE_ENV !== 'production') {
        console.error(error)
    } else {
        //TODO: Here we should log to an external tool like datadog/newrelic/sentry
    }

    return reply
        .status(500)
        .send({ message: 'Internal server error.' })
})