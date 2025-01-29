import { RecipientOrderList } from './recipient-order-list'
import { Address } from './value-objects/address'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Entity } from '@/core/entities/entity'

export interface RecipientProps {
  orders?: RecipientOrderList | null
  address: Address
}

export class Recipient extends Entity<RecipientProps> {
  get orders() {
    return this.props.orders
  }

  get address() {
    return this.props.address
  }

  static create(props: RecipientProps, id?: UniqueEntityID): Recipient {
    return new Recipient(
      {
        orders: props.orders ?? new RecipientOrderList(),
        address: props.address,
      },
      id,
    )
  }
}
