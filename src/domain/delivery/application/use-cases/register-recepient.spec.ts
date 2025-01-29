import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { RegisterRecipientUseCase } from './register-recipient'
import { AuthorizationService } from '@/core/services/authorization-service'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Role } from '@/domain/user/@types/role'
import { makeUser } from 'test/factories/make-user'
import { makeRecipient } from 'test/factories/make-recipient'
import { CPF } from '@/domain/user/enterprise/entities/value-objects/cpf'
import { generateValidCpf } from 'test/factories/faker-utils/generate-valid-cpf'
import { authorizationServiceMock } from 'test/factories/mocks/authorization-service-mock'
import { UnauthorizedAdminOnlyError } from '@/core/errors/errors/unauthorized-admin-only-error'

let authorizationService: AuthorizationService
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let fakeHasher: FakeHasher
let sut: RegisterRecipientUseCase

describe('Register Recipient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    authorizationService = authorizationServiceMock('admin-id-123')
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterRecipientUseCase(
      authorizationService,
      inMemoryRecipientsRepository,
      fakeHasher,
    )
  })

  it('should register a new recipient succesfully', async () => {
    const adminId = new UniqueEntityID('admin-id-123')
    const adminUser = makeUser({ role: Role.ADMIN }, adminId)

    const { recipient, data } = makeRecipient({}, {}, new UniqueEntityID('1'))

    inMemoryRecipientsRepository.items.push(recipient)

    const result = await sut.execute({
      requester: adminUser,
      data,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientsRepository.items[0]).toMatchObject({
      _user: {
        _id: recipient.user.id,
      },
    })
  })
  it('should hash recipient password upon registration', async () => {
    const adminId = new UniqueEntityID('admin-id-123')
    const adminUser = makeUser({ role: Role.ADMIN }, adminId)

    const { data } = makeRecipient()

    const hashedPassword = await fakeHasher.hash(data.password)

    const result = await sut.execute({
      requester: adminUser,
      data,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientsRepository.items[0].user.password).toEqual(
      hashedPassword,
    )
  })
  it('should not register recipient if requester is not admin', async () => {
    const requesterId = new UniqueEntityID('requester-id-123')
    const requesterUser = makeUser({}, requesterId)

    const { data } = makeRecipient()

    const result = await sut.execute({
      requester: requesterUser,
      data,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedAdminOnlyError)
  })
  it('should not register recipient if cpf is already in use', async () => {
    const adminId = new UniqueEntityID('admin-id-123')
    const adminUser = makeUser({ role: Role.ADMIN }, adminId)

    const { data } = makeRecipient({}, { cpf: CPF.create(generateValidCpf()) })
    const { data: newRecipientData } = makeRecipient({}, { cpf: data.cpf })

    await sut.execute({
      requester: adminUser,
      data,
    })

    const result = await sut.execute({
      requester: adminUser,
      data: newRecipientData,
    })

    expect(result.isLeft()).toBe(true)
  })
})
