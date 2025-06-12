import { expect, test } from '@playwright/test'
import { loadSegipData, SegipPruebaType } from './utils/testData'
import { UsuarioFaker } from './faker/usuario-faker'
import { convertirFecha } from './utils/generador'

test.describe('Bloqueo y desbloqueo de Cuenta', () => {
  let usuariosSegipPrueba: SegipPruebaType[]
  const { email, password } = UsuarioFaker()

  test.beforeAll(() => {
    usuariosSegipPrueba = loadSegipData()
  })

  test('Proceso completo de bloqueo y desbloqueo', async ({
    page,
    request,
  }) => {
    test.skip(
      usuariosSegipPrueba.length === 0,
      'No hay datos de prueba disponibles'
    )

    const usuarios = usuariosSegipPrueba.filter(
      (value) => value.Observacion == null
    )
    const indice = Math.floor(Math.random() * usuarios.length)

    const usuarioSegip = usuarios[indice]

    test.skip(!usuarioSegip, 'No se encontró un usuario válido para la prueba')

    await test.step('Creación de cuenta', async () => {
      await page.goto('/login')
      await page.getByRole('link', { name: 'Regístrate' }).click()
      await page.locator('#nroDocumento').fill(usuarioSegip.NumeroDocumento)
      await page.locator('#nombres').fill(usuarioSegip.Nombres)
      await page
        .locator('#primerApellido')
        .fill(usuarioSegip.PrimerApellido ?? '')
      await page
        .locator('#segundoApellido')
        .fill(usuarioSegip.SegundoApellido ?? '')
      await page
        .locator('#fechaNacimiento')
        .fill(convertirFecha(usuarioSegip.FechaNacimiento))
      await page.locator('#correoElectronico').fill(email)
      await page.locator('#password').fill(password)
      await page.locator('#confirmarPassword').fill(password)
      await page.getByRole('button', { name: 'Registrarse' }).click()
    })

    let data: any
    await test.step('Esperar respuesta de creación de cuenta', async () => {
      const response = await page.waitForResponse((response1) =>
        response1.url().includes(`/usuarios/crear-cuenta`)
      )
      data = await response.json()
    })

    await test.step('Activación de cuenta', async () => {
      await page.waitForLoadState('networkidle')
      const respuestaCodigo = await request.get(
        `${process.env.BASE_SERVER_URL}/usuarios/test/codigo/${data.datos.id}`
      )
      const codigoData = await respuestaCodigo.json()
      await page.goto(`/activacion?q=${codigoData.datos.codigoActivacion}`)
      const locator = page.getByText(`Cuenta Activa`)
      await expect(locator).toContainText(`Cuenta Activa`)
    })

    await test.step('Bloqueo de cuenta por varios intentos', async () => {
      let mensaje = ''
      await page.goto('/login')
      do {
        await page.locator('#usuario').fill(usuarioSegip.NumeroDocumento)
        await page.locator('#contrasena').fill(`${password}fake`)
        const response = await Promise.all([
          page.getByRole('button', { name: 'Ingresar' }).click(),
          page.waitForResponse((response1) => response1.url().includes('auth')),
        ])
        await page.waitForLoadState('networkidle')
        const responseData = await response[1].json()
        mensaje = responseData.mensaje
      } while (
        !mensaje.includes(
          'Usuario bloqueado debido a demasiados intentos fallidos de inicio de sesión. Revisa tu correo electrónico.'
        )
      )
    })

    await test.step('Desbloqueo de cuenta', async () => {
      const codigoDesbloqueoResponse = await request.get(
        `${process.env.BASE_SERVER_URL}/usuarios/test/codigo/${data.datos.id}`
      )
      const codigoDesbloqueoData = await codigoDesbloqueoResponse.json()
      await page.goto(
        `/desbloqueo?q=${codigoDesbloqueoData.datos.codigoDesbloqueo}`
      )
      const ok = page.getByText('Cuenta desbloqueada exitosamente.')
      await expect(ok).toContainText('Cuenta desbloqueada exitosamente.')
      await page.getByRole('button', { name: 'Ir al inicio' }).click()
    })
  })
})
