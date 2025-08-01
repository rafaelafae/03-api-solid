import { register } from "./register-controller";
import { authenticate } from "./authenticate-controller";
import { refresh } from "./refresh-controller";
import { profile } from "./profile-controller";
import { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt";

export async function usersRoutes(app: FastifyInstance) {
    app.post('/users', register)
    app.post('/sessions', authenticate)

    app.patch('/token/refresh', refresh)

    // Authenticated
    app.get('/me', { onRequest: [verifyJWT] }, profile)
}