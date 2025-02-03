import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { RegisterCourierUseCase } from './register-courier'
import { AuthorizationService } from '@/core/services/authorization-service'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeCourier } from 'test/factories/make-courier'
import { authorizationServiceMock } from 'test/factories/mocks/authorization-service-mock'
import { UnauthorizedAdminOnlyError } from '@/core/errors/errors/unauthorized-admin-only-error'
import { generateValidCpf } from 'test/factories/faker-utils/generate-valid-cpf'
import { CPF } from '@/domain/user/enterprise/entities/value-objects/cpf'

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

    const courier = makeCourier()

    const result = await sut.execute({
      requesterId: adminId.toString(),
      data: {
        name: courier.name,
        email: courier.email,
        cpf: courier.cpf.getRaw(),
        password: courier.password,
        address: {
          city: courier.address.city,
          neighborhood: courier.address.neighborhood,
          number: courier.address.number,
          state: courier.address.state,
          street: courier.address.street,
          zipCode: courier.address.zipCode,
        },
      },
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      courier: inMemoryCouriersRepository.items[0],
    })
  })

  it('should not register courier if requester is not admin', async () => {
    const requesterId = new UniqueEntityID('requester-id-123')

    const courier = makeCourier()

    const result = await sut.execute({
      requesterId: requesterId.toString(),
      data: {
        name: courier.name,
        email: courier.email,
        cpf: courier.cpf.getRaw(),
        password: courier.password,
        address: {
          city: courier.address.city,
          neighborhood: courier.address.neighborhood,
          number: courier.address.number,
          state: courier.address.state,
          street: courier.address.street,
          zipCode: courier.address.zipCode,
        },
      },
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedAdminOnlyError)
  })
  it('should not register courier if cpf is already in use', async () => {
    const adminId = new UniqueEntityID('admin-id-123')

    const courier = makeCourier({ cpf: CPF.create(generateValidCpf()) })

    inMemoryCouriersRepository.items.push(courier)
    const newCourier = makeCourier({ cpf: courier.cpf })

    const result = await sut.execute({
      requesterId: adminId.toString(),
      data: {
        name: newCourier.name,
        email: newCourier.email,
        cpf: newCourier.cpf.getRaw(),
        password: newCourier.password,
        address: {
          city: newCourier.address.city,
          neighborhood: newCourier.address.neighborhood,
          number: newCourier.address.number,
          state: newCourier.address.state,
          street: newCourier.address.street,
          zipCode: newCourier.address.zipCode,
        },
      },
    })

    console.log(result.value)

    expect(result.isLeft()).toBe(true)
  })
})
