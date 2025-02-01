import { DomainEvents } from '@/core/events/domain-events'
import { CouriersRepository } from '@/domain/delivery/application/repository/courier-repository'
import { Courier } from '@/domain/delivery/enterprise/entities/courier'
import { CPF } from '@/domain/user/enterprise/entities/value-objects/cpf'

export class InMemoryCouriersRepository implements CouriersRepository {
  public items: Courier[] = []
  async findById(id: string): Promise<Courier | null> {
    const courier = this.items.find((item) => item.id.toString() === id)

    if (!courier) {
      return null
    }

    return courier
  }

  async findByCpf(cpf: CPF): Promise<Courier | null> {
    const courier = this.items.find((item) => item.cpf === cpf)

    if (!courier) {
      return null
    }

    return courier
  }

  async create(courier: Courier): Promise<void> {
    this.items.push(courier)

    DomainEvents.dispatchEventsForAggregate(courier.id)
  }

  async save(courier: Courier): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(courier.id))

    if (itemIndex >= 0) {
      this.items[itemIndex] = courier
      DomainEvents.dispatchEventsForAggregate(courier.id)
    }
  }
}
