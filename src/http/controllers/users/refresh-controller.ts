import { FastifyRequest, FastifyReply } from "fastify";

export async function refresh(request: FastifyRequest, reply: FastifyReply) {

    await request.jwtVerify({ onlyCookie: true })

    const token = await reply.jwtSign({}, { // Primeiro TOKEN 
        sign: {
            sub: request.user.sub,
        },
    })

    const refreshToken = await reply.jwtSign({}, { // Segundo TOKEN para ser utilizado como  Refresh Token
        sign: {
            sub: request.user.sub,
            expiresIn: '7d', // o usuário só vai perder a autenticação se ficar 7 dias sem logar
        },
    })

    return reply
        .setCookie('refreshToken', refreshToken, {
            path: '/',
            secure: true,
            sameSite: true,
            httpOnly: true,
        })
        .status(200)
        .send({
            token,
        })
}