import { Either, right } from '@/core/either'
import { Order } from '../../enterprise/entities/order'
import { NotAllowedError } from './errors/not-allowed-error'
import { OrdersRepository } from '../repository/orders-repository'

interface FetchCourierOrdersUseCaseRequest {
  courierId: string
  page: number
}

type FetchCourierOrdersUseCaseResponse = Either<
  NotAllowedError,
  { orders: Order[] }
>

export class FetchCourierOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    courierId,
    page,
  }: FetchCourierOrdersUseCaseRequest): Promise<FetchCourierOrdersUseCaseResponse> {
    const orders = await this.ordersRepository.findManyByCourierId(courierId, {
      page,
    })

    return right({ orders })
  }
}
