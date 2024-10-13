## Descrição do projeto
Projeto feito com nestjs usando DDD, este projeto é uma aplicação de forum, onde os usuários podem realizar perguntas com anexos e as responder com anexos, o projeto também inclui notificações, para notificar um usuário quando ocorrer uma resposta na sua pergunta.


## Funcionalidades do projeto

- [x] Deve ser possivel cadastrar uma pergunta
- [x] Deve ser possivel cadastrar uma resposta
- [x] Deve ser possivel escolher a melhor resposta de uma pergunta
- [x] Deve ser possivel comentar em uma resposta
- [x] Deve ser possivel comentar em uma pergunta
- [x] Deve ser possivel deletar o comentario de uma pergunta
- [x] Deve ser possivel deletar o comentario de uma resposta
- [x] Deve ser possivel deletar uma resposta
- [x] Deve ser possivel deletar uma pergunta
- [x] Deve ser possivel editar uma pergunta
- [x] Deve ser possivel editar uma resposta
- [x] Deve ser possivel visualizar resposta de uma questão
- [x] Deve ser possivel buscar perguntas recentes
- [x] Deve ser possivel receber uma notificação de uma resposta
- [x] Deve ser possivel ler uma notificação
- [x] Deve ser possivel anexar arquivos na resposta
- [x] Deve ser possivel anexar arquivos na pergunta

## Iniciar a aplicação
Para inciar a aplicação é necessário possuir o docker instalado, caso já possua o docker execute os comandos abaixo

Rode o comando para executar o banco de dados
```sh
docker compose up -d
```

sera executado em ambiente de desenvolvimento
```sh
npm run start:dev
```

## Para criar chaves publicas e privadas

Observação, caso esteja no windows é necessário instalar a lib openssl pelo chocolatey, caso não tenha instalado rode o comando abaixo para instalar a lib

```sh
choco install openssl
```

gera a chave privada
```sh
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
```


gera a chave publica
```sh
openssl rsa -pubout -in private_key.pem -out public_key.pem
```

## Para gerar um base64 das chaves publicas e privadas

Observação, caso esteja no windows é necessário instalar a lib base64 pelo chocolatey, caso não tenha instalado rode o comando abaixo

```sh
choco install base64
```

```sh
base64 -i private_key.pem -o private_key-base64.txt
```

```sh
base64 -i public_key.pem -o public_key-base64.txt
```


## Diagrama de Entidade Relacionamento do projeto
![ERD prisma](prisma-erd.svg)

## Outros comandos

```sh
# formata o projeto
npm run format
```

```sh
# formata o projeto e verifca regras do lint
npm run lint
```

```sh
# executa testes unitarios
npm run test
```

```sh
# executa testes end two end
npm run test:e2e
```

```sh
# executa um relatorio de testes
npm run test:cov
```

```sh
# executa os testes unitarios em modo watch
npm run test:watch
```

```sh
# builda o projeto para produção
npm run build
```

```sh
# executa o projeto em produção após o projeto buildado
npm run start:prod
```


## Ferramentas utilizadas

- Nestjs
- Prisma
- Zod
- dayjs
- vitest
- bcryptjs
- passport-jwt
- eslint
- supertest
- zod-validation-error
- express