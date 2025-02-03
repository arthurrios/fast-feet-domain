import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Order, OrderProps } from '@/domain/delivery/enterprise/entities/order'
import { Slug } from '@/domain/delivery/enterprise/entities/value-objects/slug'
import { Address } from '@/domain/delivery/enterprise/entities/value-objects/address'
import { getRandomNeighborhood } from './faker-utils/get-random-neighborhood'

export function makeOrder(override: Partial<OrderProps>, id?: UniqueEntityID) {
  const title = faker.lorem.sentence()

  const order = Order.create(
    {
      recipientId: new UniqueEntityID(),
      title,
      description: faker.lorem.paragraph(),
      slug: Slug.create(title),
      coordinate: {
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      },

      ...override,
    },
    id,
  )

  return order
}
