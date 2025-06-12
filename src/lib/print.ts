import { Constants } from '@/config/Constants'

const obtenerNombreFuncionAnterior = (d: number) => {
  try {
    const error = new Error()
    let r = ''
    if (error.stack != null) {
      const firefoxMatch = (error.stack.split('\n')[d].match(/^.*(?=@)/) ||
        [])[0]
      const chromeMatch = (
        (((error.stack.split('at ') || [])[1 + d] || '').match(
          /(^|\.| <| )(.*[^(<])( \()/
        ) || [])[2] || ''
      )
        .split('.')
        .pop()
      const safariMatch = error.stack.split('\n')[d]

      // firefoxMatch ? print('firefoxMatch', firefoxMatch) : void 0;
      // chromeMatch ? print('chromeMatch', chromeMatch) : void 0;
      // safariMatch ? print('safariMatch', safariMatch) : void 0;
      r = firefoxMatch || chromeMatch || safariMatch
    }
    return r
  } catch (e) {
    // eslint-disable-next-line no-console
    // print(`🚨`, e)
    return ''
  }
}

export const print = (...mensaje: any[]) => {
  // mensaje = mensaje.filter((value) => value && Object.keys(value).length != 0)
  mensaje = mensaje.filter((value) => value != undefined || value != null)
  const funcionAnterior: string = obtenerNombreFuncionAnterior(2)
  const ocultarDescripcion: boolean =
    funcionAnterior.includes('callee') ||
    funcionAnterior.includes('eval') ||
    funcionAnterior.includes('@') ||
    funcionAnterior === ''
  const entorno = Constants.appEnv

  if (entorno != 'production') {
    // eslint-disable-next-line no-console
    if (ocultarDescripcion) console.log(`🖨 `, ...mensaje)
    // eslint-disable-next-line no-console
    else console.log(`🖨 `, `${funcionAnterior}`, ...mensaje)
  }
}
