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

  async findByCPF(cpf: CPF): Promise<Courier | null> {
    const courier = this.items.find((item) => item.cpf === cpf)

    if (!courier) {
      return null
    }

    return courier
  }

  async create(courier: Courier): Promise<void> {
    DomainEvents.dispatchEventsForAggregate(courier.id)

    this.items.push(courier)
  }
}
