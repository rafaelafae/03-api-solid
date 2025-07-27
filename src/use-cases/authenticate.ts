import { UsersRepository } from "@/repositories/users-repositories";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";

interface AutenthicateUserCaseRequest {
    email: string
    password: string
}

interface AutenthicateUseCaseResponse {
    user: User
}

export class AuthenticateUseCase {
    constructor(
        private userRepository: UsersRepository
    ) { }

    async execute({
        email,
        password
    }: AutenthicateUserCaseRequest): Promise<AutenthicateUseCaseResponse> {
        const user = await this.userRepository.findByEmail(email)

        if (!user) {
            throw new InvalidCredentialsError()
        }

        const doesPasswordMatches = await compare(password, user.password_hash)

        if (!doesPasswordMatches) {
            throw new InvalidCredentialsError()
        }

        return {
            user,
        }
    }
}