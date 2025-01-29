import { Either, left, right } from '@/core/either'
import { User } from '@/domain/user/enterprise/entities/user'
import { Courier } from '../../enterprise/entities/courier'
import { CourierAlreadyExistsError } from './errors/courier-already-exists-error'
import { HashGenerator } from '@/core/cryptography/hash-generator'
import { CouriersRepository } from '../repository/courier-repository'
import { AuthorizationService } from '@/core/services/authorization-service'
import { CPF } from '@/domain/user/enterprise/entities/value-objects/cpf'
import { Address } from '../../enterprise/entities/value-objects/address'
import { UnauthorizedAdminOnlyError } from '@/core/errors/errors/unauthorized-admin-only-error'

interface RegisterCourierUseCaseRequest {
  requester: User
  data: {
    name: string
    email: string
    cpf: CPF
    password: string
    address: Address
  }
}

type RegisterCourierUseCaseResponse = Either<
  CourierAlreadyExistsError | UnauthorizedAdminOnlyError,
  { courier: Courier }
>

export class RegisterCourierUseCase {
  constructor(
    private authorizationService: AuthorizationService,
    private couriersRepository: CouriersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    requester,
    data,
  }: RegisterCourierUseCaseRequest): Promise<RegisterCourierUseCaseResponse> {
    const authResult = await this.authorizationService.verifyAdmin(requester.id)

    if (authResult.isLeft()) {
      return left(authResult.value)
    }

    const courierWithSameCPF = await this.couriersRepository.findByCPF(data.cpf)

    if (courierWithSameCPF) {
      return left(new CourierAlreadyExistsError(data.cpf.toString()))
    }

    const hashedPassword = await this.hashGenerator.hash(data.password)

    const courier = Courier.create(
      { address: data.address },
      {
        ...data,
        password: hashedPassword,
      },
    )

    await this.couriersRepository.create(courier)

    return right({ courier })
  }
}
