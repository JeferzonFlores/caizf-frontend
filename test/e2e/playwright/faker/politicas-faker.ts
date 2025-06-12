import { faker } from '@faker-js/faker/locale/es_MX'

interface PoliticaType {
  sujeto: string
  objecto: string
}

export const PoliticaFaker = (): PoliticaType => {
  return {
    sujeto: faker.person.jobType().toUpperCase().replace(/ /g, '_'),
    objecto: `admin/${faker.word.adjective()}/${faker.word.adverb()}`,
  }
}
