import { Either, left, right } from '@/core/either'
import { Order } from '../../enterprise/entities/order'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { OrdersRepository } from '../repository/orders-repository'
import { OrderStatus } from '../../@types/status'
import { NotAllowedError } from './errors/not-allowed-error'

interface UpdateOrderStatusUseCaseRequest {
  courierId?: string
  orderId: string
  status: OrderStatus
}

type UpdateOrderStatusUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { order: Order }
>

export class UpdateOrderStatusUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    courierId,
    orderId,
    status,
  }: UpdateOrderStatusUseCaseRequest): Promise<UpdateOrderStatusUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError('order'))
    }

    const courierIsNotAssignedCourier =
      courierId && order.courierId?.toValue() !== courierId

    if (status === OrderStatus.DELIVERED) {
      if (courierIsNotAssignedCourier) {
        return left(
          new NotAllowedError('Courier is not assigned to this order'),
        )
      }

      // if (/* photo not provided */) {
      //   return left(new NotAllowedError('Photo not provided'))
      // }
    }

    order.updateStatus(status)

    return right({ order })
  }
}
