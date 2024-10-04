import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from "@nestjs/common";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { z } from "zod";
import { AuthenticateStudantUseCase } from "@/domain/forum/application/use-cases/authenticate-studant-use-case";
import { WrongCredentialsError } from "@/domain/forum/application/use-cases/errors/wrong-credentials-error";
import { Public } from "@/infra/auth/public";

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller("/session")
@Public()
export class AuthenticateController {
  constructor(
    private readonly authenticateStudantUseCase: AuthenticateStudantUseCase,
  ) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;

    const result = await this.authenticateStudantUseCase.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return {
      access_token: result.value.accessToken,
    };
  }
}
