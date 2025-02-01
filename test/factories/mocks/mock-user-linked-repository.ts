import { UserLinkedEntityRepository } from '@/core/shared/repositories/user-linked-entity-repository'
import { UserLinkedEntity } from '@/core/shared/entities/user-linked-entity'
import { CPF } from '@/domain/user/enterprise/entities/value-objects/cpf'

export class MockUserLinkedRepository
  implements UserLinkedEntityRepository<UserLinkedEntity>
{
  public items: UserLinkedEntity[] = []
  public saveCalls: UserLinkedEntity[] = []

  async findByCpf(cpf: CPF): Promise<UserLinkedEntity | null> {
    return this.items.find((item) => item.cpf.equals(cpf)) || null
  }

  async save(entity: UserLinkedEntity): Promise<void> {
    this.saveCalls.push(entity)
    const index = this.items.findIndex((item) => item.cpf.equals(entity.cpf))
    if (index >= 0) {
      this.items[index] = entity
    }
  }
}
