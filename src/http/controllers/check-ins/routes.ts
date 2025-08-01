import { create } from "./create-controller";
import { validate } from "./validate-controller";
import { history } from "./history-controller";
import { metrics } from "./metrics-controller";
import { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

export async function checkInRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT) // Rotas daqui para baixo chamam antes a verificação de autenticação

    app.get('/check-ins/history', history)
    app.get('/check-ins/metrics', metrics)

    app.post('/gyms/:gymId/check-ins', create)
    app.patch('/check-ins/:checkInId/validate', { onRequest: [verifyUserRole('ADMIN')] }, validate)
}
