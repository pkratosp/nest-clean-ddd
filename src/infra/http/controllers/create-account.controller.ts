import {
  ConflictException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/database/prisma/prisma-service'
import { z } from 'zod'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body

    const findEmail = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    })

    if (findEmail) {
      throw new ConflictException('E-mail ja existe')
    }

    const passwordHash = await hash(password, 8)

    await this.prismaService.user.create({
      data: {
        email,
        name,
        password: passwordHash,
      },
    })
  }
}
