import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Register E2E', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to register', async () => {
        const response = await request(app.server).post('/users').send({
            name: 'Jhon Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })

        expect(response.statusCode).toEqual(201)
    })
})