import { InMemoryNotificationRepository } from "test/repositories/in-memory-notification-repository";
import { SendNotificationUseCase } from "./send-notification-use-case";

let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sut: SendNotificationUseCase;

describe("Send notification", () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository();
    sut = new SendNotificationUseCase(inMemoryNotificationRepository);
  });

  it("should be able send notification", async () => {
    const result = await sut.execute({
      content: "conteudo da notificação",
      title: "titulo da notificação",
      recipientId: "1",
    });

    expect(result.isRight()).toEqual(true);
    expect(inMemoryNotificationRepository.items[0]).toEqual(
      result.value?.notification,
    );
  });
});
