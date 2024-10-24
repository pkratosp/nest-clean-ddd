import { EnvService } from "@/infra/env/env.service";
import { Injectable, OnModuleDestroy } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
    constructor(private readonly envService: EnvService) {
        super({
            port: envService.get('REDIS_PORT'),
            db: envService.get('REDIS_BD'),
            host: envService.get('REDIS_HOST'),
        })
    }

    onModuleDestroy() {
        return this.disconnect()
    }
}