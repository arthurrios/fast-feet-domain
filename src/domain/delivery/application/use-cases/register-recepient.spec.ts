import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { RegisterRecipientUseCase } from './register-recipient'
import { AuthorizationService } from '@/core/services/authorization-service'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeRecipient } from 'test/factories/make-recipient'
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

    const recipient = makeRecipient()

    const result = await sut.execute({
      requesterId: adminId.toString(),
      data: recipient,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      recipient: inMemoryRecipientsRepository.items[0],
    })
  })

  it('should not register recipient if requester is not admin', async () => {
    const requesterId = new UniqueEntityID('requester-id-123')

    const recipient = makeRecipient()

    const result = await sut.execute({
      requesterId: requesterId.toString(),
      data: recipient,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedAdminOnlyError)
  })
  it('should not register recipient if cpf is already in use', async () => {
    const adminId = new UniqueEntityID('admin-id-123')

    const recipient = makeRecipient()

    inMemoryRecipientsRepository.items.push(recipient)
    const newRecipient = makeRecipient({ cpf: recipient.cpf })

    const result = await sut.execute({
      requesterId: adminId.toString(),
      data: newRecipient,
    })

    expect(result.isLeft()).toBe(true)
  })
})
