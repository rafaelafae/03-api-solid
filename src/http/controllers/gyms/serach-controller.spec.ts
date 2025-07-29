import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Search Gym E2E', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to search gym by title', async () => {

        const { token } = await createAndAuthenticateUser(app, true)

        await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
            title: 'JavaScript Gym',
            description: 'Some description',
            phone: '11999999999',
            latitude: -23.5864064,
            longitude: -46.7206144,
        })

        await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
            title: 'TypeScript Gym',
            description: 'Some description',
            phone: '11999999999',
            latitude: -23.5864064,
            longitude: -46.7206144,
        })

        const response = await request(app.server)
            .get('/gyms/search')
            .query({
                query: 'JavaScript',
            })
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.statusCode).toEqual(201)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'JavaScript Gym'
            }),
        ])
    })
})