import { AuthorizationService } from '@/core/services/authorization-service'
import { RecipientsRepository } from '../repository/recipient-repository'
import { UnauthorizedAdminOnlyError } from '@/core/errors/errors/unauthorized-admin-only-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface DeleteRecipientUseCaseRequest {
  requesterId: string
  recipientId: string
}

type DeleteRecipientUseCaseResponse = Either<
  UnauthorizedAdminOnlyError | ResourceNotFoundError,
  null
>

export class DeleteRecipientUseCase {
  constructor(
    private authorizationService: AuthorizationService,
    private recipientsRepository: RecipientsRepository,
  ) {}

  async execute({
    requesterId,
    recipientId,
  }: DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseResponse> {
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

    await this.recipientsRepository.delete(recipient)

    return right(null)
  }
}
