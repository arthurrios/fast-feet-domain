import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Courier,
  CourierProps,
} from '@/domain/delivery/enterprise/entities/courier'
import { CourierOrderList } from '@/domain/delivery/enterprise/entities/courier-order-list'
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
      orders: new CourierOrderList(),
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

  return courier
}
