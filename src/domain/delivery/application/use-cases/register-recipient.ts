import { Either, left, right } from '@/core/either'
import { User } from '@/domain/user/enterprise/entities/user'
import { Recipient } from '../../enterprise/entities/recipient'
import { RecipientAlreadyExistsError } from './errors/recipient-already-exists-error'
import { HashGenerator } from '@/core/cryptography/hash-generator'
import { RecipientsRepository } from '../repository/recipient-repository'
import { AuthorizationService } from '@/core/services/authorization-service'
import { CPF } from '@/domain/user/enterprise/entities/value-objects/cpf'
import { Address } from '../../enterprise/entities/value-objects/address'
import { UnauthorizedAdminOnlyError } from '@/core/errors/unauthorized-admin-only-error'

interface RegisterRecipientUseCaseRequest {
  requester: User
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
    requester,
    data,
  }: RegisterRecipientUseCaseRequest): Promise<RegisterRecipientUseCaseResponse> {
    const authResult = await this.authorizationService.verifyAdmin(requester.id)

    if (authResult.isLeft()) {
      return left(authResult.value)
    }

    const recipientWithSameCPF = await this.recipientsRepository.findByCPF(
      data.cpf,
    )

    if (recipientWithSameCPF) {
      return left(new RecipientAlreadyExistsError(data.cpf.toString()))
    }

    const hashedPassword = await this.hashGenerator.hash(data.password)

    const recipient = Recipient.create(
      { address: data.address },
      {
        ...data,
        password: hashedPassword,
      },
    )

    await this.recipientsRepository.create(recipient)

    return right({ recipient })
  }
}
