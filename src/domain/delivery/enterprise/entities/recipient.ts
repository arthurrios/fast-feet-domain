import { RecipientOrderList } from './recipient-order-list'
import { Address } from './value-objects/address'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Entity } from '@/core/entities/entity'
import { CPF } from '@/domain/user/enterprise/entities/value-objects/cpf'

export interface RecipientProps {
  name: string
  cpf: CPF
  email: string
  password: string
  orders?: RecipientOrderList | null
  address: Address
}

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.props.name
  }

  get cpf() {
    return this.props.cpf
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get orders() {
    return this.props.orders
  }

  get address() {
    return this.props.address
  }

  static create(props: RecipientProps, id?: UniqueEntityID): Recipient {
    const recipient = new Recipient(
      {
        ...props,
        orders: props.orders ?? new RecipientOrderList(),
        address: props.address,
      },
      id,
    )

    return recipient
  }
}
