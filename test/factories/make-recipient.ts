import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Recipient,
  RecipientProps,
} from '@/domain/delivery/enterprise/entities/recipient'
import { UserProps } from '@/domain/user/enterprise/entities/user'
import { makeUser } from './make-user'
import { Role } from '@/domain/user/@types/role'
import { RecipientOrderList } from '@/domain/delivery/enterprise/entities/recipient-order-list'
import { Address } from '@/domain/delivery/enterprise/entities/value-objects/address'
import { faker } from '@faker-js/faker'
import { getRandomNeighborhood } from './faker-utils/get-random-neighborhood'

export function makeRecipient(
  recipientOverride?: Partial<RecipientProps>,
  userOverride?: Partial<UserProps>,
  id?: UniqueEntityID,
) {
  const user = makeUser({ role: Role.RECIPIENT, ...userOverride })

  const defaultRecipientProps: RecipientProps = {
    orders: new RecipientOrderList(),
    address: Address.create(
      faker.location.streetAddress(),
      faker.number.int().toString(),
      getRandomNeighborhood(),
      faker.location.city(),
      faker.location.state(),
      faker.location.zipCode(),
    ),
    ...recipientOverride,
  }

  const recipientProps = { ...defaultRecipientProps, ...recipientOverride }

  const recipient = Recipient.create(recipientProps, user, id)

  return {
    recipient,
    data: {
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      password: faker.internet.password(),
      address: defaultRecipientProps.address,
    },
  }
}
