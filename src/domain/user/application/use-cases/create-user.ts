import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { Either, left, right } from '@/core/either'
import { User } from '../../enterprise/entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { HashGenerator } from '@/core/cryptography/hash-generator'
import { Role } from '../../@types/role'

interface CreateUserUseCaseRequest {
  name: string
  email: string
  cpf: CPF
  password: string
  role: Role
}

type CreateUserUseCaseResponse = Either<UserAlreadyExistsError, { user: User }>

export class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    cpf,
    password,
    role,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const userWithSameCPF = await this.usersRepository.findByCPF(cpf)

    if (userWithSameCPF) {
      return left(new UserAlreadyExistsError(cpf.toString()))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const user = User.create({
      cpf,
      email,
      name,
      password: hashedPassword,
      role,
    })

    await this.usersRepository.create(user)

    return right({ user })
  }
}
