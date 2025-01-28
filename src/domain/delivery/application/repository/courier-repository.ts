import { CPF } from '@/domain/user/enterprise/entities/value-objects/cpf'
import { Courier } from '../../enterprise/entities/courier'

export interface CouriersRepository {
  findById(id: string): Promise<Courier | null>
  findByCPF(cpf: CPF): Promise<Courier | null>
  create(courier: Courier): Promise<void>
}
