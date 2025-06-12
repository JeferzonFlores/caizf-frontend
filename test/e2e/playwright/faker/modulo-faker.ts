import { faker } from '@faker-js/faker/locale/es_MX'

interface ModuloType {
  nombre: string
  label: string
  url: string
  orden: string
  descripcion: string
  icono: string
}

export const ModuloFaker = (): ModuloType => {
  const department = faker.commerce.department()
  const icons = ['ckeck', 'users', 'card', 'setting', 'pencil']
  return {
    label: department,
    nombre: department.toLowerCase(),
    url: 'admin/' + department + '/' + faker.word.adverb(),
    orden: faker.string.numeric(),
    descripcion: faker.lorem.sentence(),
    icono: faker.helpers.arrayElement(icons),
  }
}
