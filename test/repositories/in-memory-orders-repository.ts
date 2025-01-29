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
  }
}
