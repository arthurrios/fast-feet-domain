import { CPF } from '@/domain/user/enterprise/entities/value-objects/cpf'
import { Recipient } from '../../enterprise/entities/recipient'
import { UserLinkedEntityRepository } from '@/core/shared/repositories/user-linked-entity-repository'

export abstract class RecipientsRepository extends UserLinkedEntityRepository<Recipient> {
  abstract findById(id: string): Promise<Recipient | null>
  abstract findByCpf(cpf: CPF): Promise<Recipient | null>
  abstract create(recipient: Recipient): Promise<void>
}
