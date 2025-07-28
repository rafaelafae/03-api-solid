import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'
import { expect, describe, it, beforeEach } from 'vitest'


let gymsRepository: InMemoryGymRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {

    beforeEach(() => {
        gymsRepository = new InMemoryGymRepository()
        sut = new CreateGymUseCase(gymsRepository)
    })

    it('should be able to register', async () => {

        const { gym } = await sut.execute({
            title: 'Academia JS',
            description: "",
            phone: "",
            latitude: -23.5864064,
            longitude: -46.7206144,
        })

        expect(gym.id)
            .toEqual(expect.any(String))
    })
})