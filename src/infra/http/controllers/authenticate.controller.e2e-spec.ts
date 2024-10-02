import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma-service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { StudantFactory } from 'test/factories/make-studant'

describe('Authenticate (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studantFactory: StudantFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudantFactory
      ]
    }).compile()

    app = moduleRef.createNestApplication()

    studantFactory = moduleRef.get(StudantFactory)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /session', async () => {
    await studantFactory.makePrismaStudant({
      email: 'jhondoe@gmail.com',
      password: await hash('123456', 8),
    })

    const response = await request(app.getHttpServer()).post('/session').send({
      email: 'jhondoe@gmail.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
