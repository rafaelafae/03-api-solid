import { SearchGymsUseCase } from './search-gyms'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'

let gymsRepository: InMemoryGymRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymRepository()
        sut = new SearchGymsUseCase(gymsRepository)
    })

    it('should be able to search for gyms', async () => {

        await gymsRepository.create({
            title: "JavaScript Gym",
            description: "",
            phone: "",
            latitude: -23.5864064,
            longitude: -46.7206144,
        })

        await gymsRepository.create({
            title: "TypeScript Gym",
            description: "",
            phone: "",
            latitude: -23.5864064,
            longitude: -46.7206144,
        })


        const { gyms } = await sut.execute({
            query: 'JavaScript',
            page: 1,
        })

        expect(gyms)
            .toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'JavaScript Gym' }),
        ])
    })

    it('should be able to fetch paginated check-in history', async () => {
        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                title: `TypeScript Gym ${i}`,
                description: "",
                phone: "",
                latitude: -23.5864064,
                longitude: -46.7206144,
            })
        }

        const { gyms } = await sut.execute({
            query: 'TypeScript',
            page: 2,
        })

        expect(gyms)
            .toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'TypeScript Gym 21' }),
            expect.objectContaining({ title: 'TypeScript Gym 22' }),
        ])
    })
})