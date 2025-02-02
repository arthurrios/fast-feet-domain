import { DomainEvents } from '@/core/events/domain-events'
import { OrdersRepository } from '@/domain/delivery/application/repository/orders-repository'
import { Order } from '@/domain/delivery/enterprise/entities/order'

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = []
  async findById(id: string): Promise<Order | null> {
    const order = this.items.find((item) => item.id.toString() === id)

    if (!order) {
      return null
    }

    return order
  }

  async create(order: Order): Promise<void> {
    this.items.push(order)

    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async save(order: Order): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(order.id))

    this.items[index] = order

    DomainEvents.dispatchEventsForAggregate(order.id)
  }
}
