import { Address } from './value-objects/address'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Entity } from '@/core/entities/entity'
import { CPF } from '@/domain/user/enterprise/entities/value-objects/cpf'
import { UserLinkedEntity } from '../../../../core/shared/entities/user-linked-entity'
import { Coordinate } from 'test/utils/get-distance-between-coordinates'

export interface RecipientProps {
  name: string
  cpf: CPF
  email: string
  password: string
  coordinate: Coordinate
  createdAt: Date
  updatedAt?: Date | null
}

export class Recipient
  extends Entity<RecipientProps>
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

  get coordinate() {
    return this.props.coordinate
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

  set coordinate(coordinate: Coordinate) {
    this.props.coordinate = coordinate
    this.touch()
  }

  static create(props: RecipientProps, id?: UniqueEntityID): Recipient {
    const recipient = new Recipient(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return recipient
  }
}
