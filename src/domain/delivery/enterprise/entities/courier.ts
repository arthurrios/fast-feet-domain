import { CourierOrderList } from './courier-order-list'
import { Address } from './value-objects/address'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CPF } from '@/domain/user/enterprise/entities/value-objects/cpf'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { CourierRegisteredEvent } from '../events/courier-registered-event'
import { UserLinkedEntity } from '../../../../core/shared/entities/user-linked-entity'

export interface CourierProps {
  name: string
  cpf: CPF
  email: string
  password: string
  orders?: CourierOrderList | null
  address: Address
}

export class Courier
  extends AggregateRoot<CourierProps>
  implements UserLinkedEntity
{
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

  static create(props: CourierProps, id?: UniqueEntityID): Courier {
    const courier = new Courier(
      {
        ...props,
        orders: props.orders ?? new CourierOrderList(),
        address: props.address,
      },
      id,
    )

    courier.addDomainEvent(new CourierRegisteredEvent(courier))

    return courier
  }
}
