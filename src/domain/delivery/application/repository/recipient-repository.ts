import { CPF } from '@/domain/user/enterprise/entities/value-objects/cpf'
import { Recipient } from '../../enterprise/entities/recipient'

export interface RecipientsRepository {
  findById(id: string): Promise<Recipient | null>
  findByCPF(cpf: CPF): Promise<Recipient | null>
  create(recipient: Recipient): Promise<void>
}
