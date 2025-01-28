import { CPF } from '@/domain/user/enterprise/entities/value-objects/cpf'
import { Courier } from '../../enterprise/entities/courier'
import { Order } from '../../enterprise/entities/order'

export interface CouriersRepository {
  findById(id: string): Promise<Courier | null>
  findByCPF(cpf: CPF): Promise<Courier | null>
  listAssignedOrders(): Promise<Order[] | null>
  create(courier: Courier): Promise<void>
}
