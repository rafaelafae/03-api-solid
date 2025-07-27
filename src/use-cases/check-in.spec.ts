import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from './check-in'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymRepository
let sut: CheckInUseCase

describe('Check In Use Case', () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymRepository()
        sut = new CheckInUseCase(checkInsRepository, gymsRepository)

        gymsRepository.items.push({
            id: 'gym-01',
            title: 'Academia JS',
            description: "",
            latitude: new Decimal(0),
            longitude: new Decimal(0),
            phone: "",
        })

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to check in', async () => {

        const { checkIn } = await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -23.5864064,
            userLongitude: -46.7206144,
        })

        expect(checkIn.id)
            .toEqual(expect.any(String))
    })

    it('should not be able to check in twice in the same day', async () => {

        vi.setSystemTime(new Date(2025, 6, 19, 8, 0, 0))

        await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -23.5864064,
            userLongitude: -46.7206144,
        })

        await expect(() =>
            sut.execute({
                userId: 'user-01',
                gymId: 'gym-01',
                userLatitude: -23.5864064,
                userLongitude: -46.7206144,
            }),
        ).rejects.toBeInstanceOf(Error)
    })

    it('should be able to check in twice in different days', async () => {

        vi.setSystemTime(new Date(2025, 6, 19, 8, 0, 0))

        await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -23.5864064,
            userLongitude: -46.7206144,
        })

        vi.setSystemTime(new Date(2025, 6, 20, 8, 0, 0))

        const { checkIn } = await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -23.5864064,
            userLongitude: -46.7206144,
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

})