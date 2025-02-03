import { Either, left, right } from '@/core/either'
import { Address } from '../../enterprise/entities/value-objects/address'
import { CouriersRepository } from '../repository/courier-repository'
import { UnauthorizedAdminOnlyError } from '@/core/errors/errors/unauthorized-admin-only-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Courier } from '../../enterprise/entities/courier'
import { CPF } from '@/domain/user/enterprise/entities/value-objects/cpf'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AuthorizationService } from '@/core/services/authorization-service'

interface EditCourierUseCaseRequest {
  requesterId: string
  courierId: string
  name: string
  cpf: CPF
  email: string
  address: Address
}

type EditCourierUseCaseResponse = Either<
  UnauthorizedAdminOnlyError | ResourceNotFoundError,
  { courier: Courier }
>

export class EditCourierUseCase {
  constructor(
    private authorizationService: AuthorizationService,
    private couriersRepository: CouriersRepository,
  ) {}

  async execute({
    requesterId,
    courierId,
    address,
    email,
    name,
    cpf,
  }: EditCourierUseCaseRequest): Promise<EditCourierUseCaseResponse> {
    const authResult = await this.authorizationService.verifyAdmin(
      new UniqueEntityID(requesterId),
    )

    if (authResult.isLeft()) {
      return left(authResult.value)
    }

    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError('courier'))
    }

    courier.name = name
    courier.cpf = cpf
    courier.email = email
    courier.address = address

    await this.couriersRepository.save(courier)

    return right({ courier })
  }
}
