export class Address {
  public readonly street: string
  public readonly number: string
  public readonly neighborhood: string
  public readonly city: string
  public readonly state: string
  public readonly zipCode: string

  private constructor(
    street: string,
    number: string,
    neighborhood: string,
    city: string,
    state: string,
    zipCode: string,
  ) {
    this.street = street
    this.number = number
    this.neighborhood = neighborhood
    this.city = city
    this.state = state
    this.zipCode = zipCode
  }

  static create(
    street: string,
    number: string,
    neighborhood: string,
    city: string,
    state: string,
    zipCode: string,
  ) {
    const normalize = (text: string) =>
      text
        .normalize('NFKD') // Normalize diacritics
        .trim()
        .replace(/\s+/g, ' ') // Normalize whitespace
        .replace(/[^\w\s-]/g, '') // Remove invalid characters

    return new Address(
      normalize(street),
      number.trim(),
      normalize(neighborhood),
      normalize(city),
      normalize(state),
      zipCode.trim(),
    )
  }

  toString(): string {
    return `${this.street}, ${this.number}, ${this.neighborhood}, ${this.city}, ${this.state}, ${this.zipCode}`
  }
}
