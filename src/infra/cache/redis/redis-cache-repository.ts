import { Injectable } from "@nestjs/common";
import { CacheRepository } from "../cacheRepository";
import { RedisService } from "./redis-service";

@Injectable()
export class RedisCacheRepository implements CacheRepository {
    constructor(private readonly redisService: RedisService) {}

    async delete(key: string): Promise<void> {
        await this.redisService.del(key)
    }

    async get(key: string): Promise<string | null> {
        return await this.redisService.get(key)
    }

    async set(key: string, value: string): Promise<void> {
        await this.redisService.set(key, value, 'EX', 60 * 15) // 15 minutos
    }
}