import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Courier,
  CourierProps,
} from '@/domain/delivery/enterprise/entities/courier'
import { UserProps } from '@/domain/user/enterprise/entities/user'
import { makeUser } from './make-user'
import { Role } from '@/domain/user/@types/role'
import { CourierOrderList } from '@/domain/delivery/enterprise/entities/courier-order-list'
import { Address } from '@/domain/delivery/enterprise/entities/value-objects/address'
import { faker } from '@faker-js/faker'
import { getRandomNeighborhood } from './faker-utils/get-random-neighborhood'

export function makeCourier(
  courierOverride?: Partial<CourierProps>,
  userOverride?: Partial<UserProps>,
  id?: UniqueEntityID,
) {
  const user = makeUser({ role: Role.COURIER, ...userOverride })

  const defaultCourierProps: CourierProps = {
    orders: new CourierOrderList(),
    address: Address.create(
      faker.location.streetAddress(),
      faker.number.int().toString(),
      getRandomNeighborhood(),
      faker.location.city(),
      faker.location.state(),
      faker.location.zipCode(),
    ),
    ...courierOverride,
  }

  const courierProps = { ...defaultCourierProps, ...courierOverride }

  const courier = Courier.create(courierProps, user, id)

  return {
    courier,
    data: {
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      password: faker.internet.password(),
      address: defaultCourierProps.address,
    },
  }
}
