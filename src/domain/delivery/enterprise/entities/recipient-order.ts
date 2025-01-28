import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface RecipientOrderProps {
  recipientId: string
  orderId: string
}

export class RecipientOrder extends Entity<RecipientOrderProps> {
  get recipientId() {
    return this.props.recipientId
  }

  get orderId() {
    return this.props.orderId
  }

  static create(props: RecipientOrderProps, id?: UniqueEntityID) {
    const recipientOrder = new RecipientOrder(props, id)

    return recipientOrder
  }
}
