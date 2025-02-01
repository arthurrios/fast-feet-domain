import { CPF } from '@/domain/user/enterprise/entities/value-objects/cpf'
import { Courier } from '../../enterprise/entities/courier'
import { UserLinkedEntityRepository } from '@/core/shared/repositories/user-linked-entity-repository'

export abstract class CouriersRepository extends UserLinkedEntityRepository<Courier> {
  abstract findById(id: string): Promise<Courier | null>
  abstract findByCpf(cpf: CPF): Promise<Courier | null>
  abstract create(courier: Courier): Promise<void>
}
