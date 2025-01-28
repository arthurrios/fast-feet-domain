import { AuthorizationService } from '@/core/services/authorization-service'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, left, right } from '@/core/either'
import { UnauthorizedAdminOnlyError } from '@/core/errors/unauthorized-admin-only-error'

export function authorizationServiceMock(
  isAdminCheck: (id: UniqueEntityID) => boolean,
): AuthorizationService {
  return {
    verifyAdmin: vi.fn(
      async (
        id: UniqueEntityID,
      ): Promise<Either<UnauthorizedAdminOnlyError, void>> => {
        if (isAdminCheck(id)) {
          return right(undefined)
        }
        return left(new UnauthorizedAdminOnlyError())
      },
    ),
  } as unknown as AuthorizationService
}
