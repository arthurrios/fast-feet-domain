import { User, UserProps } from '@/domain/user/enterprise/entities/user'
import { RecipientOrderList } from './recipient-order-list'
import { Address } from './value-objects/address'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface RecipientProps extends UserProps {
  orders: RecipientOrderList
  address: Address
}

export class Recipient extends User<RecipientProps> {
  get orders() {
    return this.props.orders
  }

  get address() {
    return this.props.address
  }

  static create(props: RecipientProps, id?: UniqueEntityID) {
    const recipient = new Recipient(
      {
        ...props,
        orders: props.orders ?? new RecipientOrderList(),
      },
      id,
    )

    return recipient
  }
}
