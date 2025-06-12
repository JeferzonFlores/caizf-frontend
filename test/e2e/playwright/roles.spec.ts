import { test } from '@playwright/test'
import { RolFaker } from './faker/rol-faker'

test.describe('Roles', () => {
  test('crear y editar rol', async ({ page, isMobile }) => {
    const rolCreacion = RolFaker()
    const rolEdicion = RolFaker()

    await test.step('Iniciar sesión', async () => {
      await page.goto(`/login`)
      await page.locator('#usuario').fill('ADMINISTRADOR-TECNICO')
      await page.locator('#contrasena').fill('123')
      await page.getByRole('button', { name: 'Ingresar' }).click()
      if (isMobile) await page.getByRole('button', { name: 'menu' }).click()
    })

    await test.step('Crear nuevo rol', async () => {
      await page.click("[id='/admin/roles']")
      await page.locator('#agregarRol').click()
      await page.locator('#rol').fill(rolCreacion.rol)
      await page.locator('#nombre').fill(rolCreacion.nombre)
      await page.locator('#descripcion').fill(rolCreacion.descripcion)
      await Promise.all([
        page.getByRole('button', { name: 'Crear' }).click(),
        page.waitForResponse((response) => response.url().includes('/roles')),
      ])
    })

    await test.step('Verificar creación del rol', async () => {
      await page.locator('#buttonBuscarRol').click()
      await page.locator('#inputBusquedaRol').fill(rolCreacion.rol)
      await page.waitForResponse((response) =>
        response.url().includes('/roles')
      )
      // await expect(page.getByText(rolCreacion.rol).first()).toBeVisible()
    })

    await test.step('Editar rol', async () => {
      await page.getByRole('button', { name: 'Editar' }).first().click()
      await page.locator('#rol').fill(rolEdicion.rol)
      await page.locator('#nombre').fill(rolEdicion.nombre)
      await page.locator('#descripcion').fill(rolEdicion.descripcion)
      await Promise.all([
        page.getByRole('button', { name: 'Actualizar' }).click(),
        page.waitForResponse((response) => response.url().includes('/roles')),
      ])
    })

    await test.step('Verificar edición del rol', async () => {
      await page.locator('#inputBusquedaRol').fill(rolEdicion.rol)
      await page.waitForResponse((response) =>
        response.url().includes('/roles')
      )
      // await expect(page.getByText(rolEdicion.rol).first()).toBeVisible()
    })
  })
})
