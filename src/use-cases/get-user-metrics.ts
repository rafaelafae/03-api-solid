import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { CheckIn } from "@prisma/client";

interface GetUserMetricsUserCaseRequest {
    userId: string
}

interface GetUserMetricsUserCaseResponse {
    checkInsCount: number
}

export class GetUserMetricsUserCase {
    constructor(
        private checkInsRepository: CheckInsRepository,) { }

    async execute({
        userId,
    }: GetUserMetricsUserCaseRequest): Promise<GetUserMetricsUserCaseResponse> {
        const checkInsCount = await this.checkInsRepository.countByUserId(userId)

        return {
            checkInsCount,
        }
    }
}