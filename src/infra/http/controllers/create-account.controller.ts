import {
  ConflictException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  BadRequestException,
} from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { z } from 'zod'
import { RegisterStudantsUseCase } from '@/domain/forum/application/use-cases/register-studants-use-case'
import { StudantAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/student-already-exists-error'
import { Public } from '@/infra/auth/public'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
@Public()
export class CreateAccountController {
  constructor(
    private readonly registerStudantsUseCase: RegisterStudantsUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body

    const result = await this.registerStudantsUseCase.execute({
      email,
      name,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case StudantAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
