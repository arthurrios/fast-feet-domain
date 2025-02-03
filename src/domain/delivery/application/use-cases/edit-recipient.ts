import { Either, left, right } from '@/core/either'
import { RecipientsRepository } from '../repository/recipient-repository'
import { UnauthorizedAdminOnlyError } from '@/core/errors/errors/unauthorized-admin-only-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Recipient } from '../../enterprise/entities/recipient'
import { CPF } from '@/domain/user/enterprise/entities/value-objects/cpf'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AuthorizationService } from '@/core/services/authorization-service'
import { Address } from '../../enterprise/entities/value-objects/address'

interface EditRecipientUseCaseRequest {
  requesterId: string
  recipientId: string
  name: string
  cpf: string
  email: string
  address: {
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
  }
}

type EditRecipientUseCaseResponse = Either<
  UnauthorizedAdminOnlyError | ResourceNotFoundError,
  { recipient: Recipient }
>

export class EditRecipientUseCase {
  constructor(
    private authorizationService: AuthorizationService,
    private recipientsRepository: RecipientsRepository,
  ) {}

  async execute({
    requesterId,
    recipientId,
    address,
    email,
    name,
    cpf,
  }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseResponse> {
    const authResult = await this.authorizationService.verifyAdmin(
      new UniqueEntityID(requesterId),
    )

    if (authResult.isLeft()) {
      return left(authResult.value)
    }

    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError('recipient'))
    }

    const addressData = Address.create(
      address.street,
      address.number,
      address.neighborhood,
      address.city,
      address.state,
      address.zipCode,
    )

    recipient.name = name
    recipient.cpf = CPF.create(cpf)
    recipient.email = email
    recipient.address = addressData

    await this.recipientsRepository.save(recipient)

    return right({ recipient })
  }
}
