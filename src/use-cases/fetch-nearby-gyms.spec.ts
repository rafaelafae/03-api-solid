import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymRepository
let sut: FetchNearbyGymsUseCase

describe('Search Gyms Nearby Use Case', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymRepository()
        sut = new FetchNearbyGymsUseCase(gymsRepository)
    })

    it('should be able to search nearby gyms', async () => {

        await gymsRepository.create({
            title: "Near Gym",
            description: "",
            phone: "",
            latitude: -23.5864064,
            longitude: -46.7206144,
        })

        await gymsRepository.create({
            title: "Far Gym",
            description: "",
            phone: "",
            latitude: -23.4951658,
            longitude: -47.4387023,
        })


        const { gyms } = await sut.execute({
            userLatitude: -23.591448,
            userLongitude: -46.6898191,
        })

        expect(gyms)
            .toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Near Gym' }),
        ])
    })
})