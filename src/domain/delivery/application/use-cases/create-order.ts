import { Either, left, right } from '@/core/either'
import { Address } from '../../enterprise/entities/value-objects/address'
import { Order } from '../../enterprise/entities/order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CouriersRepository } from '../repository/courier-repository'
import { RecipientsRepository } from '../repository/recipient-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { OrdersRepository } from '../repository/orders-repository'
import { AuthorizationService } from '@/core/services/authorization-service'

interface CreateOrderUseCaseRequest {
  requesterId: string
  recipientId: string
  courierId?: string
  title: string
  description: string
  address: {
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
  }
}

type CreateOrderUseCaseResponse = Either<
  ResourceNotFoundError,
  { order: Order }
>

export class CreateOrderUseCase {
  constructor(
    private authorizationService: AuthorizationService,
    private couriersRepository: CouriersRepository,
    private recipientsRepository: RecipientsRepository,
    private ordersRepository: OrdersRepository,
  ) {}

  async execute({
    requesterId,
    recipientId,
    courierId,
    title,
    description,
    address,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const authResult = await this.authorizationService.verifyAdmin(
      new UniqueEntityID(requesterId),
    )

    if (authResult.isLeft()) {
      return left(authResult.value)
    }

    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError('recipient'))
    }

    if (courierId) {
      const courier = await this.couriersRepository.findById(courierId)

      if (!courier) {
        return left(new ResourceNotFoundError('courier'))
      }
    }

    const order = Order.create({
      recipientId: new UniqueEntityID(recipientId),
      courierId: courierId ? new UniqueEntityID(courierId) : null,
      title,
      description,
      address: Address.create(
        address.street,
        address.number,
        address.neighborhood,
        address.city,
        address.state,
        address.zipCode,
      ),
    })

    await this.ordersRepository.create(order)

    return right({ order })
  }
}
