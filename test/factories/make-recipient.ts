import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Recipient,
  RecipientProps,
} from '@/domain/delivery/enterprise/entities/recipient'
import { RecipientOrderList } from '@/domain/delivery/enterprise/entities/recipient-order-list'
import { Address } from '@/domain/delivery/enterprise/entities/value-objects/address'
import { faker } from '@faker-js/faker'
import { getRandomNeighborhood } from './faker-utils/get-random-neighborhood'
import { CPF } from '@/domain/user/enterprise/entities/value-objects/cpf'
import { generateValidCpf } from './faker-utils/generate-valid-cpf'

export function makeRecipient(
  override?: Partial<RecipientProps>,
  id?: UniqueEntityID,
) {
  const recipient = Recipient.create(
    {
      name: faker.person.fullName(),
      cpf: CPF.create(generateValidCpf()),
      email: faker.internet.email(),
      password: faker.internet.password(),
      orders: new RecipientOrderList(),
      address: Address.create(
        faker.location.streetAddress(),
        faker.number.int().toString(),
        getRandomNeighborhood(),
        faker.location.city(),
        faker.location.state(),
        faker.location.zipCode(),
      ),
      ...override,
    },
    id,
  )

  return recipient
}
