import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check In Use Case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new ValidateCheckInUseCase(checkInsRepository)

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to validate check-in', async () => {

        const createdCheckIn = await checkInsRepository.create(
            {
                user_id: 'user-01',
                gym_id: 'gym-01',
            }
        )

        const { checkIn } = await sut.execute({
            checkInId: createdCheckIn.id,
        })

        expect(checkIn.validated_at)
            .toEqual(expect.any(Date))
        expect(checkInsRepository.items[0].validated_at)
            .toEqual(expect.any(Date))
    })

    it('should not be able to validate an existent check-in', async () => {

        await expect(() =>
            sut.execute({
                checkInId: 'inexistent-check-in',
            }),
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    })

    it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
        vi.setSystemTime(new Date(2024, 0, 1, 13, 40))

        const createdCheckIn = await checkInsRepository.create(
            {
                user_id: 'user-01',
                gym_id: 'gym-01',
            }
        )

        const twentyOneMinutes = 1000 * 60 * 21

        vi.advanceTimersByTime(twentyOneMinutes)

        await expect(() =>
            sut.execute({
                checkInId: createdCheckIn.id,
            })
        ).rejects.toBeInstanceOf(LateCheckInValidationError)
    })
})