import { UsersRepository } from '@/domain/user/application/repositories/users-repository'
import { Either, left, right } from '../either'
import { UnauthorizedAdminOnlyError } from '../errors/unauthorized-admin-only-error'
import { UniqueEntityID } from '../entities/unique-entity-id'

export class AuthorizationService {
  constructor(private usersRepository: UsersRepository) {}

  async verifyAdmin(
    id: UniqueEntityID,
  ): Promise<Either<UnauthorizedAdminOnlyError, void>> {
    const user = await this.usersRepository.findById(id.toValue())

    if (!user || !user.isAdmin) {
      console.warn(
        `Authorization denied. User with ID: ${id.toValue()} attempted to access an admin-only resource.`,
      )
      return left(new UnauthorizedAdminOnlyError())
    }

    console.log(
      `Authorization successful. Admin with ID: ${id.toValue()} accessed the resource.`,
    )
    return right(undefined)
  }
}
