import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Slug } from './value-objects/slug'
import { OrderStatus } from '../../@types/status'
import { Address } from './value-objects/address'
import { Optional } from '@/core/types/optional'

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

export class Order extends Entity<OrderProps> {
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

  set status(status: OrderStatus) {
    this.props.status = status
    this.touch()
  }

  static create(
    props: Optional<OrderProps, 'createdAt' | 'slug' | 'status'>,
    id?: UniqueEntityID,
  ) {
    const order = new Order(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        status: props.status ?? OrderStatus.AWAITING_COURIER,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return order
  }
}
