import { AggregateRoot } from "../entities/aggregate-root";
import { UniqueEntityID } from "../entities/unique-entity";
import { DomainEvent } from "../events/domain-event";
import { DomainEvents } from "./domain-events";
import { vi } from "vitest";

class CustomAggregateCreate implements DomainEvent {
  public ocurrentAt: Date;
  private aggregate: CustomAggregate; // eslint-disable-line

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate;
    this.ocurrentAt = new Date();
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id;
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null);

    aggregate.addDomainEvents(new CustomAggregateCreate(aggregate));

    return aggregate;
  }
}

describe("domain events", () => {
  it("should be able to dispatch and listin to events", async () => {
    const callbackSpy = vi.fn();

    // Subiscriber cadastrado(ouvindo o evento de resposta criada)
    DomainEvents.register(callbackSpy, CustomAggregateCreate.name);

    // estou criando uma resposta SEM SALVAR NO BD
    const aggregate = CustomAggregate.create();

    // Estou assegurando que o evento foi criado porem não foi disparado
    expect(aggregate.domainEvents).toHaveLength(1);

    // Estou salvando a resposta no banco de dados e assim disparando o evento
    DomainEvents.dispatchEventsForAggregate(aggregate.id);

    // o subiscriber ouve o evento e faz o que precisa ser feito com os dados
    expect(callbackSpy).toHaveBeenCalled();

    expect(aggregate.domainEvents).toHaveLength(0);
  });
});
