import { CheckIn, Gym, Prisma } from '@prisma/client'

export interface SearchManyNearbyParams {
    latitude: number
    longitude: number
}

export interface GymsRepository {
    findById(id: string): Promise<Gym | null>
    searchManyNearby(params: SearchManyNearbyParams): Promise<Gym[]>
    searchMany(query: string, page: number): Promise<Gym[]>
    create(data: Prisma.GymCreateInput): Promise<Gym>
}