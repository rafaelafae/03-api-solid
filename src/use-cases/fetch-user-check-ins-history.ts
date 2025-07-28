import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { CheckIn } from "@prisma/client";

interface FetchCheckInUserHistoryUseCaseRequest {
    userId: string
    page: number,
}

interface FetchCheckInUserHistoryUseCaseResponse {
    checkIns: CheckIn[]
}

export class FetchCheckInUserHistoryUseCase {
    constructor(
        private checkInsRepository: CheckInsRepository,) { }

    async execute({
        userId,
        page,
    }: FetchCheckInUserHistoryUseCaseRequest): Promise<FetchCheckInUserHistoryUseCaseResponse> {
        const checkIns = await this.checkInsRepository.findManyByUserId(userId, page)

        return {
            checkIns,
        }
    }
}