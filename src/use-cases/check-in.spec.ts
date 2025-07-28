import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberCheckIns } from './errors/max-number-of-check-ins-error'
import { CheckInUseCase } from './check-in'
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymRepository
let sut: CheckInUseCase

describe('Check In Use Case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymRepository()
        sut = new CheckInUseCase(checkInsRepository, gymsRepository)

        await gymsRepository.create({
            id: 'gym-01',
            title: 'Academia JS',
            description: "",
            phone: "",
            latitude: -23.5864064,
            longitude: -46.7206144,
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
        ).rejects.toBeInstanceOf(MaxNumberCheckIns)
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

    it('should not be able to check in on distant gym', async () => {

        gymsRepository.items.push({
            id: 'gym-02',
            title: 'Academia JS',
            description: "",
            latitude: new Decimal(-23.5864064),
            longitude: new Decimal(-46.7206144),
            phone: "",
        })

        await expect(() =>
            sut.execute({
                userId: 'user-0',
                gymId: 'gym-02',
                userLatitude: -23.591448,
                userLongitude: -46.6898191,
            }),
        ).rejects
            .toBeInstanceOf(MaxDistanceError)

    })

})