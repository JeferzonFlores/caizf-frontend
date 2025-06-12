export const numeroAleatorio = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min

export const convertirFecha = (fecha: string) => {
  const [dia, mes, año] = fecha.split('/')
  return `${año}-${mes}-${dia}`
}
