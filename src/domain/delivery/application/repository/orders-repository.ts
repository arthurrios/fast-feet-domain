import { PaginationParams } from '@/core/repositories/pagination-params'
import { Order } from '../../enterprise/entities/order'

export interface OrdersRepository {
  findById(id: string): Promise<Order | null>
  findManyByCourierId(
    courierId: string,
    params: PaginationParams,
  ): Promise<Order[]>
  create(order: Order): Promise<void>
  save(order: Order): Promise<void>
}
