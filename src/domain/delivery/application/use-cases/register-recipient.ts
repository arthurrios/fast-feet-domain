import { Either, left, right } from '@/core/either'
import { Recipient } from '../../enterprise/entities/recipient'
import { RecipientAlreadyExistsError } from './errors/recipient-already-exists-error'
import { HashGenerator } from '@/domain/user/application/cryptography/hash-generator'
import { RecipientsRepository } from '../repository/recipient-repository'
import { AuthorizationService } from '@/core/services/authorization-service'
import { CPF } from '@/domain/user/enterprise/entities/value-objects/cpf'
import { Address } from '../../enterprise/entities/value-objects/address'
import { UnauthorizedAdminOnlyError } from '@/core/errors/errors/unauthorized-admin-only-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface RegisterRecipientUseCaseRequest {
  requesterId: string
  data: {
    name: string
    email: string
    cpf: CPF
    password: string
    address: Address
  }
}

type RegisterRecipientUseCaseResponse = Either<
  RecipientAlreadyExistsError | UnauthorizedAdminOnlyError,
  { recipient: Recipient }
>

export class RegisterRecipientUseCase {
  constructor(
    private authorizationService: AuthorizationService,
    private recipientsRepository: RecipientsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    requesterId,
    data,
  }: RegisterRecipientUseCaseRequest): Promise<RegisterRecipientUseCaseResponse> {
    const authResult = await this.authorizationService.verifyAdmin(
      new UniqueEntityID(requesterId),
    )

    if (authResult.isLeft()) {
      return left(authResult.value)
    }

    const courierWithSameCPF = await this.recipientsRepository.findByCpf(
      data.cpf,
    )

    if (courierWithSameCPF) {
      return left(new RecipientAlreadyExistsError(data.cpf.toString()))
    }

    const hashedPassword = await this.hashGenerator.hash(data.password)

    const recipient = Recipient.create({
      ...data,
      password: hashedPassword,
    })

    await this.recipientsRepository.create(recipient)

    return right({ recipient })
  }
}
