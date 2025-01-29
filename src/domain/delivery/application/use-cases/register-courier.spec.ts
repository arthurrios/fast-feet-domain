import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { RegisterCourierUseCase } from './register-courier'
import { AuthorizationService } from '@/core/services/authorization-service'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Role } from '@/domain/user/@types/role'
import { makeUser } from 'test/factories/make-user'
import { makeCourier } from 'test/factories/make-courier'
import { CPF } from '@/domain/user/enterprise/entities/value-objects/cpf'
import { generateValidCpf } from 'test/factories/faker-utils/generate-valid-cpf'
import { authorizationServiceMock } from 'test/factories/mocks/authorization-service-mock'
import { UnauthorizedAdminOnlyError } from '@/core/errors/errors/unauthorized-admin-only-error'

let authorizationService: AuthorizationService
let inMemoryCouriersRepository: InMemoryCouriersRepository
let fakeHasher: FakeHasher
let sut: RegisterCourierUseCase

describe('Register Courier', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    authorizationService = authorizationServiceMock('admin-id-123')
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterCourierUseCase(
      authorizationService,
      inMemoryCouriersRepository,
      fakeHasher,
    )
  })

  it('should register a new courier succesfully', async () => {
    const adminId = new UniqueEntityID('admin-id-123')
    const adminUser = makeUser({ role: Role.ADMIN }, adminId)

    const { courier, data } = makeCourier({}, {}, new UniqueEntityID('1'))

    inMemoryCouriersRepository.items.push(courier)

    const result = await sut.execute({
      requester: adminUser,
      data,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCouriersRepository.items[0]).toMatchObject({
      _user: {
        _id: courier.user.id,
      },
    })
  })
  it('should hash courier password upon registration', async () => {
    const adminId = new UniqueEntityID('admin-id-123')
    const adminUser = makeUser({ role: Role.ADMIN }, adminId)

    const { data } = makeCourier()

    const hashedPassword = await fakeHasher.hash(data.password)

    const result = await sut.execute({
      requester: adminUser,
      data,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCouriersRepository.items[0].user.password).toEqual(
      hashedPassword,
    )
  })
  it('should not register courier if requester is not admin', async () => {
    const requesterId = new UniqueEntityID('requester-id-123')
    const requesterUser = makeUser({}, requesterId)

    const { data } = makeCourier()

    const result = await sut.execute({
      requester: requesterUser,
      data,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedAdminOnlyError)
  })
  it('should not register courier if cpf is already in use', async () => {
    const adminId = new UniqueEntityID('admin-id-123')
    const adminUser = makeUser({ role: Role.ADMIN }, adminId)

    const { data } = makeCourier({}, { cpf: CPF.create(generateValidCpf()) })
    const { data: newCourierData } = makeCourier({}, { cpf: data.cpf })

    await sut.execute({
      requester: adminUser,
      data,
    })

    const result = await sut.execute({
      requester: adminUser,
      data: newCourierData,
    })

    expect(result.isLeft()).toBe(true)
  })
})
