import { AppModule } from "@/infra/app.module"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import { StudantFactory } from "test/factories/make-studant"
import request from 'supertest'
import { DatabaseModule } from "@/infra/database/prisma/database.module"

describe('Upload attachment (E2E)', async () => {

    let app: INestApplication
    let studantFactory: StudantFactory
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule,DatabaseModule],
            providers: [
                StudantFactory
            ]
        }).compile()

        app = moduleRef.createNestApplication()
        studantFactory = moduleRef.get(StudantFactory)
        jwt = moduleRef.get(JwtService)

        await app.init()
    })

    it('[POST] /attachments', async () => {

        const user = await studantFactory.makePrismaStudant()

        const token = jwt.sign({ sub: user.id.toString() })

        const result = await request(app.getHttpServer())
            .post('/attachments')
            .set('Authorization', `Bearer ${token}`)
            .attach('file', './test/e2e/upload-test-e2e.jpeg')

        expect(result.statusCode).toEqual(201)

    })

})