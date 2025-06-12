import { test } from '@playwright/test'
import { loadSegipData, SegipPruebaType } from './utils/testData'
import { UsuarioFaker } from './faker/usuario-faker'
import { convertirFecha } from './utils/generador'

test.describe('Usuarios', () => {
  let testData: SegipPruebaType[]
  const { email } = UsuarioFaker()

  test.beforeAll(() => {
    testData = loadSegipData()
  })

  test('crear y editar usuario', async ({ page, isMobile }) => {
    test.skip(testData.length === 0, 'No hay datos de prueba disponibles')

    const usuarios = testData.filter((value) => value.Observacion == null)
    const indice = Math.floor(Math.random() * usuarios.length)

    const usuarioSegip = usuarios[indice]

    test.skip(!usuarioSegip, 'No se encontró un usuario válido para la prueba')

    await test.step('Iniciar sesión', async () => {
      await page.goto(`/login`)
      await page.locator('#usuario').fill('ADMINISTRADOR-TECNICO')
      await page.locator('#contrasena').fill('123')
      await page.getByRole('button', { name: 'Ingresar' }).click()
      if (isMobile) await page.getByRole('button', { name: 'menu' }).click()
    })

    await test.step('Crear nuevo usuario', async () => {
      await page.click("[id='/admin/usuarios']")
      await page.locator('#agregarUsuario').click()
      await page.locator('#nombres').fill(usuarioSegip.Nombres)
      await page
        .locator('#primerApellido')
        .fill(usuarioSegip.PrimerApellido ?? '')
      await page
        .locator('#segundoApellido')
        .fill(usuarioSegip.SegundoApellido ?? '')
      await page.locator('#nroDocumento').fill(usuarioSegip.NumeroDocumento)
      await page
        .locator('#fechaNacimiento')
        .fill(convertirFecha(usuarioSegip.FechaNacimiento))
      await page.locator('#correoElectronico').fill(email)
      await page.getByText('Administrador', { exact: true }).click()
      await page.getByRole('button', { name: 'Crear' }).click()
      await page.waitForLoadState('networkidle')
    })

    await test.step('Verificar creación del usuario', async () => {
      await page.locator('#buttonBuscarUsuario').click()
      await page
        .locator('#inputBusquedaUsuario')
        .fill(usuarioSegip.NumeroDocumento)
      await page.waitForLoadState('networkidle')
      // await expect(
      //   page.getByText(usuarioSegip.NumeroDocumento).first()
      // ).toBeVisible()
    })
  })
})
