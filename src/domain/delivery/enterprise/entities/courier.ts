import { User, UserProps } from '@/domain/user/enterprise/entities/user'
import { CourierOrderList } from './courier-order-list'
import { Address } from './value-objects/address'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface CourierProps extends UserProps {
  orders: CourierOrderList
  address: Address
}

export class Courier extends User<CourierProps> {
  get orders() {
    return this.props.orders
  }

  get address() {
    return this.props.address
  }

  static create(props: CourierProps, id?: UniqueEntityID) {
    const courier = new Courier(
      {
        ...props,
        orders: props.orders ?? new CourierOrderList(),
      },
      id,
    )

    return courier
  }
}
