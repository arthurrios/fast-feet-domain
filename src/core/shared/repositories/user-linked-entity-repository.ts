import { CPF } from '@/domain/user/enterprise/entities/value-objects/cpf'
import { UserLinkedEntity } from '../entities/user-linked-entity'

export abstract class UserLinkedEntityRepository<T extends UserLinkedEntity> {
  abstract findByCpf(cpf: CPF): Promise<T | null>
  abstract save(entity: T): Promise<void>
}
