import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Slug } from './value-objects/slug'
import { OrderStatus } from '../../@types/status'
import { Address } from './value-objects/address'
import { Optional } from '@/core/types/optional'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { OrderCreatedEvent } from '../events/order-created-event'
import { CourierAssignedEvent } from '../events/courier-assigned-event'

export interface OrderProps {
  recipientId: UniqueEntityID
  courierId?: UniqueEntityID | null
  title: string
  description: string
  slug: Slug
  address: Address
  status: OrderStatus
  createdAt: Date
  updatedAt?: Date | null
}

export class Order extends AggregateRoot<OrderProps> {
  get courierId() {
    return this.props.courierId
  }

  get recipientId() {
    return this.props.recipientId
  }

  get title() {
    return this.props.title
  }

  get description() {
    return this.props.description
  }

  get slug() {
    return this.props.slug
  }

  get address() {
    return this.props.address
  }

  get status() {
    return this.props.status
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)
    this.touch()
  }

  set description(description: string) {
    this.props.description = description
    this.touch()
  }

  static create(
    props: Optional<OrderProps, 'createdAt' | 'slug' | 'status' | 'courierId'>,
    id?: UniqueEntityID,
  ) {
    const order = new Order(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        status: props.status ?? OrderStatus.AWAITING,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    order.addDomainEvent(new OrderCreatedEvent(order))

    return order
  }

  assignCourier(courierId: UniqueEntityID) {
    if (!this.props.courierId?.equals(courierId)) {
      this.props.courierId = courierId
      this.addDomainEvent(new CourierAssignedEvent(courierId, this.id))
      this.touch()
    }
  }

  updateStatus(status: OrderStatus) {
    this.props.status = status
    this.touch()
  }
}
