import { search } from "./search-controller";
import { nearby } from "./nearby-controller";
import { create } from "./create-controller";
import { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt";

export async function gymsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT) // Rotas daqui para baixo chamam antes a verificação de autenticação

    app.get('/gyms/search', search)

    app.get('/gyms/nearby', nearby)

    app.post('/gyms', create)
}
