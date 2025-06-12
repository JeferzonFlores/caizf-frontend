import { faker } from '@faker-js/faker/locale/es_MX'

interface UsuarioType {
  email: string
  password: string
}

export const UsuarioFaker = (): UsuarioType => {
  return {
    email: faker.internet.email(),
    password: faker.string.alphanumeric(15),
  }
}
