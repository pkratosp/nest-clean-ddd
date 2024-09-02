import {
  ConflictException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { PrismaService } from 'src/prisma/prisma-service'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: any) {
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
