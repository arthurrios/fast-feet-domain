import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { OrderStatus } from '../../@types/status'
import { UpdateOrderStatusUseCase } from './update-order-status'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: UpdateOrderStatusUseCase

describe('Update Order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    sut = new UpdateOrderStatusUseCase(inMemoryOrdersRepository)
  })
  it('should be able to update an order status', async () => {
    const order = makeOrder({
      title: 'Order 1',
      courierId: new UniqueEntityID('1'),
    })

    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      courierId: '1',
      orderId: order.id.toString(),
      status: OrderStatus.PICKED_UP,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      order: expect.objectContaining({
        status: OrderStatus.PICKED_UP,
      }),
    })
    expect(inMemoryOrdersRepository.items[0]).toMatchObject({
      status: OrderStatus.PICKED_UP,
    })
  })
  it('should not be able to update an order status if the order does not exist', async () => {
    const result = await sut.execute({
      courierId: '1',
      orderId: '1',
      status: OrderStatus.PICKED_UP,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
  it('should not be able to update an order status to PICKED_UP if the courier is not provided', async () => {
    const order = makeOrder({
      title: 'Order 1',
      courierId: new UniqueEntityID('1'),
    })

    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      status: OrderStatus.PICKED_UP,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
  it('should not be able to update an order status to DELIVERED if the courier is not assigned to the order', async () => {
    const order = makeOrder({
      title: 'Order 1',
      courierId: new UniqueEntityID('1'),
    })

    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      courierId: '2',
      orderId: order.id.toString(),
      status: OrderStatus.DELIVERED,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
