import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Env } from "src/env";
import { z } from "zod";

const tokenSchema = z.object({
    sub: z.string().uuid()
})

type TokenSchema = z.infer<typeof tokenSchema>


@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService<Env, true>) {
        const publicKey = configService.get('JWT_PUBLIC_KEY', { infer: true })

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: Buffer.from(publicKey, 'base64'),
            algorithms: ['RS256']
        })
    }

    async validate(payload: TokenSchema) {
        return tokenSchema.parse(payload)
    }
}