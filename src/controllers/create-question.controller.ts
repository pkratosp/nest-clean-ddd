import { Body, Controller, Post, UseGuards, UsePipes } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { z } from "zod";

const createQuestionBodySchema = z.object({

})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class CreateQuestionController {
    constructor() {}

    @Post()
    @UsePipes(new ZodValidationPipe(createQuestionBodySchema))
    async handle(@Body() body: CreateQuestionBodySchema) {
        const {} = body
    }
} 