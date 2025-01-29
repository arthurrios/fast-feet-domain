import { RecipientsRepository } from '@/domain/delivery/application/repository/recipient-repository'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient'
import { CPF } from '@/domain/user/enterprise/entities/value-objects/cpf'

export class InMemoryRecipientsRepository implements RecipientsRepository {
  public items: Recipient[] = []
  async findById(id: string): Promise<Recipient | null> {
    const recipient = this.items.find((item) => item.user.id.toString() === id)

    if (!recipient) {
      return null
    }

    return recipient
  }

  async findByCPF(cpf: CPF): Promise<Recipient | null> {
    const recipient = this.items.find((item) => item.user.cpf === cpf)

    if (!recipient) {
      return null
    }

    return recipient
  }

  async create(recipient: Recipient): Promise<void> {
    this.items.push(recipient)
  }
}
