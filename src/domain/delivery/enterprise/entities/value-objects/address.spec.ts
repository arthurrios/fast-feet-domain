import { Address } from './address'

describe('Address Value Object', () => {
  it('should return the correct string representation', () => {
    const address = Address.create(
      '123 Main St ',
      '456',
      ' Downtown ',
      ' New York ',
      ' NY ',
      ' 12345 ',
    )

    const expectedString = '123 Main St, 456, Downtown, New York, NY, 12345'
    expect(address.toString()).toBe(expectedString)
  })

  it('should handle diacritics and extra spaces correctly', () => {
    const address = Address.create(
      'Av. São João',
      '123',
      'Centro ',
      ' São Paulo ',
      ' SP ',
      '01000-000',
    )

    const expectedString = 'Av Sao Joao, 123, Centro, Sao Paulo, SP, 01000-000'
    expect(address.toString()).toBe(expectedString)
  })

  it('should handle invalid characters correctly', () => {
    const address = Address.create(
      '123#Main$St%',
      '789',
      'Neigh@bor&hood',
      'City!',
      'Sta^te*',
      '123-456',
    )

    const expectedString = '123MainSt, 789, Neighborhood, City, State, 123-456'
    expect(address.toString()).toBe(expectedString)
  })
})
