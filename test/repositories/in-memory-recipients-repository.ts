import { DomainEvents } from '@/core/events/domain-events'
import { RecipientsRepository } from '@/domain/delivery/application/repository/recipient-repository'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient'
import { CPF } from '@/domain/user/enterprise/entities/value-objects/cpf'

export class InMemoryRecipientsRepository implements RecipientsRepository {
  public items: Recipient[] = []
  async findById(id: string): Promise<Recipient | null> {
    const recipient = this.items.find((item) => item.id.toString() === id)

    if (!recipient) {
      return null
    }

    return recipient
  }

  async findByCpf(cpf: CPF): Promise<Recipient | null> {
    const recipient = this.items.find((item) => item.cpf === cpf)

    if (!recipient) {
      return null
    }

    return recipient
  }

  async create(recipient: Recipient): Promise<void> {
    this.items.push(recipient)
  }

  async save(recipient: Recipient): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(recipient.id),
    )

    if (itemIndex >= 0) {
      this.items[itemIndex] = recipient
      DomainEvents.dispatchEventsForAggregate(recipient.id)
    }
  }

  async delete(recipient: Recipient): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(recipient.id),
    )

    this.items.splice(itemIndex, 1)
  }
}
