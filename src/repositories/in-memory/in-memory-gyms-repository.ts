import { getDistanceBetweenCordinates } from "@/utils/get-distance-between-coordinates";
import { GymsRepository, SearchManyNearbyParams } from "../gyms-repository";
import { Gym, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";

export class InMemoryGymRepository implements GymsRepository {

    public items: Gym[] = []

    async findById(id: string) {
        const gym = this.items.find(item => item.id === id)

        if (!gym) {
            return null
        }
        return gym
    }

    async searchManyNearby(params: SearchManyNearbyParams) {
        return this.items
            .filter(item => {
                const distance = getDistanceBetweenCordinates(
                    {
                        latitude: params.latitude,
                        longitude: params.longitude,
                    },
                    {
                        latitude: item.latitude.toNumber(),
                        longitude: item.longitude.toNumber(),
                    }
                )

                return distance < 10
            })
    }

    async searchMany(query: string, page: number) {
        return this.items
            .filter((item) => item.title.includes(query))
            .slice((page - 1) * 20, page * 20)
    }

    async create(data: Prisma.GymCreateInput): Promise<Gym> {
        const gym = {
            id: data.id ?? randomUUID(),
            title: data.title,
            description: data.description ?? null,
            phone: data.phone ?? null,
            latitude: new Prisma.Decimal(data.latitude.toString()),
            longitude: new Prisma.Decimal(data.longitude.toString()),
            created_at: new Date(),
        }

        this.items.push(gym)

        return gym
    }
}
