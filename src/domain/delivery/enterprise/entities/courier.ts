import { User, UserProps } from '@/domain/user/enterprise/entities/user'
import { CourierOrderList } from './courier-order-list'
import { Address } from './value-objects/address'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Role } from '@/domain/user/@types/role'

export interface CourierProps {
  orders: CourierOrderList
  address: Address
}

export class Courier {
  private _user: User
  private ordersList: CourierOrderList
  private addressDetails: Address

  constructor(
    user: User,
    ordersList: CourierOrderList,
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
    props: CourierProps,
    userProps: UserProps,
    id?: UniqueEntityID,
  ): Courier {
    const user = User.create(
      {
        ...userProps,
        role: Role.COURIER,
        createdAt: new Date(),
      },
      id,
    )

    return new Courier(user, props.orders, props.address)
  }
}
