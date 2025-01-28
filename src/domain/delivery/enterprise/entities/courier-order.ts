import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface CourierOrderProps {
  courierId: string
  orderId: string
}

export class CourierOrder extends Entity<CourierOrderProps> {
  get courierId() {
    return this.props.courierId
  }

  get orderId() {
    return this.props.orderId
  }

  static create(props: CourierOrderProps, id?: UniqueEntityID) {
    const courierOrder = new CourierOrder(props, id)

    return courierOrder
  }
}
