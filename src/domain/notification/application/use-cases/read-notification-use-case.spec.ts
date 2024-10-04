import { InMemoryNotificationRepository } from "test/repositories/in-memory-notification-repository";
import { ReadNotificationUseCase } from "./read-notification-use-case";
import { makeNotification } from "test/factories/make-notification";
import { UniqueEntityID } from "@/core/entities/unique-entity";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sut: ReadNotificationUseCase;

describe("Read notification", () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository();
    sut = new ReadNotificationUseCase(inMemoryNotificationRepository);
  });

  it("should be able read notification", async () => {
    const _makeNotification = makeNotification();

    inMemoryNotificationRepository.create(_makeNotification);

    const result = await sut.execute({
      notificationId: _makeNotification.id.toString(),
      recipientId: _makeNotification.recipientId.toString(),
    });

    expect(result.isRight()).toEqual(true);
    expect(inMemoryNotificationRepository.items[0].readAt).toEqual(
      expect.any(Date),
    );
  });

  it("should not be able to read a notification from another user", async () => {
    const _makeNotification = makeNotification({
      recipientId: new UniqueEntityID("recipientId-01"),
    });

    inMemoryNotificationRepository.create(_makeNotification);

    const result = await sut.execute({
      notificationId: _makeNotification.id.toString(),
      recipientId: "recipient-02",
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
