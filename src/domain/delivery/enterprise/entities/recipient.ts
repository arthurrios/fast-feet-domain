import { User, UserProps } from '@/domain/user/enterprise/entities/user'
import { RecipientOrderList } from './recipient-order-list'
import { Address } from './value-objects/address'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Role } from '@/domain/user/@types/role'

export interface RecipientProps {
  orders?: RecipientOrderList | null
  address: Address
}

export class Recipient {
  private _user: User
  private ordersList: RecipientOrderList
  private addressDetails: Address

  constructor(
    user: User,
    ordersList: RecipientOrderList,
    addressDetails: Address,
  ) {
    this._user = user
    this.ordersList = ordersList
    this.addressDetails = addressDetails
  }

  get orders() {
    return this.ordersList
  }

  get address() {
    return this.addressDetails
  }

  get user() {
    return this._user
  }

  static create(
    props: RecipientProps,
    userProps: Omit<UserProps, 'role' | 'createdAt'>,
    id?: UniqueEntityID,
  ): Recipient {
    const user = User.create(
      {
        ...userProps,
        role: Role.RECIPIENT,
        createdAt: new Date(),
      },
      id,
    )

    return new Recipient(
      user,
      props.orders ?? new RecipientOrderList(),
      props.address,
    )
  }
}
