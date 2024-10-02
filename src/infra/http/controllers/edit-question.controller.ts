import { EditQuestionUseCase } from "@/domain/forum/application/use-cases/edit-question-use-case";
import { BadRequestException, Body, Controller, HttpCode, Param, Put } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";

const editQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string(),
})

const bodyValidationSchema = new ZodValidationPipe(editQuestionBodySchema)

type EditQuestionBodySchemaType = z.infer<typeof editQuestionBodySchema>

@Controller('/questions/:id')
export class EditQuestionController {
    constructor(private readonly editQuestionUseCase: EditQuestionUseCase) {}

    @Put()
    @HttpCode(204)
    async execute(
        @Body(bodyValidationSchema) body: EditQuestionBodySchemaType,
        @CurrentUser() user: UserPayload,
        @Param('id') id: string
    ) {
        const { sub } = user

        const result = await this.editQuestionUseCase.execute({
            attachmentsIds: [],
            authorId: sub,
            content: body.content,
            questionId: id,
            title: body.title
        }) 

        if(result.isLeft()) {
            throw new BadRequestException()
        }
    }
}