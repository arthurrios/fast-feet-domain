import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Courier,
  CourierProps,
} from '@/domain/delivery/enterprise/entities/courier'
import { Address } from '@/domain/delivery/enterprise/entities/value-objects/address'
import { faker } from '@faker-js/faker'
import { getRandomNeighborhood } from './faker-utils/get-random-neighborhood'
import { CPF } from '@/domain/user/enterprise/entities/value-objects/cpf'
import { generateValidCpf } from './faker-utils/generate-valid-cpf'

export function makeCourier(
  override?: Partial<CourierProps>,
  id?: UniqueEntityID,
) {
  const courier = Courier.create(
    {
      name: faker.person.fullName(),
      cpf: CPF.create(generateValidCpf()),
      email: faker.internet.email(),
      password: faker.internet.password(),
      coordinate: {
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      },
      createdAt: new Date(),
      ...override,
    },
    id,
  )

  return courier
}
