import { Body, Controller, Post, UseGuards, UsePipes } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "src/auth/current-user-decorator";
import { UserPayload } from "src/auth/jwt.strategy";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { PrismaService } from "src/prisma/prisma-service";
import { z } from "zod";

const createQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string(),
})
const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class CreateQuestionController {
    constructor(
        private readonly prismaService: PrismaService
    ) {}

    @Post()
    async handle(
        @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
        @CurrentUser() user: UserPayload,
    ) {
        const { content, title } = body
    
        await this.prismaService.questions.create({
            data: {
                authorId: user.sub,
                title,
                content,
                slug: this.convertToSlug(title)
            }
        })
    }

    private convertToSlug(title: string): string {
        return title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
      }
} 