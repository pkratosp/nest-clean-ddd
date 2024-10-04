import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryStudantsRepository } from "test/repositories/in-memory-studants-repository";
import { RegisterStudantsUseCase } from "./register-studants-use-case";

let inMemoryStudantsRepository: InMemoryStudantsRepository;
let fakeHahser: FakeHasher;
let sut: RegisterStudantsUseCase;

describe("Register studant", () => {
  beforeEach(() => {
    inMemoryStudantsRepository = new InMemoryStudantsRepository();
    fakeHahser = new FakeHasher();
    sut = new RegisterStudantsUseCase(inMemoryStudantsRepository, fakeHahser);
  });

  it("should be able to register a new studante", async () => {
    const register = await sut.execute({
      email: "jhondoe@email.com",
      name: "jhon doe",
      password: "12345",
    });

    expect(register.isRight()).toEqual(true);
    expect(register.value).toEqual({
      studant: inMemoryStudantsRepository.items[0],
    });
  });

  //   should hash student password upon registration

  it("should hash studant password upon registration", async () => {
    const register = await sut.execute({
      name: "jhon doe",
      email: "jhondoe@email.com",
      password: "12345",
    });

    const hashdePassword = await fakeHahser.generate("12345");

    expect(register.isRight()).toEqual(true);
    expect(inMemoryStudantsRepository.items[0].password).toEqual(
      hashdePassword,
    );
  });
});
