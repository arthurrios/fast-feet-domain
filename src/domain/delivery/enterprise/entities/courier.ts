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
  address: Address
  createdAt: Date
  updatedAt?: Date | null
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

  get address() {
    return this.props.address
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

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  set cpf(cpf: CPF) {
    this.props.cpf = cpf
    this.touch()
  }

  set email(email: string) {
    this.props.email = email
    this.touch()
  }

  set address(address: Address) {
    this.props.address = address
    this.touch()
  }

  static create(props: CourierProps, id?: UniqueEntityID): Courier {
    const courier = new Courier(
      {
        ...props,
        address: props.address,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    courier.addDomainEvent(new CourierRegisteredEvent(courier))

    return courier
  }
}
