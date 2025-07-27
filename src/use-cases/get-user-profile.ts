import { UsersRepository } from "@/repositories/users-repositories";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";

interface GetUserProfileUseCaseRequest {
    userId: string
}

interface GetUserProfileUseCaseResponse {
    user: User
}

export class GetUserProfileUseCase {
    constructor(
        private userRepository: UsersRepository
    ) { }

    async execute({
        userId
    }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
        const user = await this.userRepository.findById(userId)

        if (!user) {
            throw new ResourceNotFoundError()
        }

        return {
            user,
        }
    }
}