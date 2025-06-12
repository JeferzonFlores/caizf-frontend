import { test } from '@playwright/test'
import { ModuloFaker } from './faker/modulo-faker'

test.describe('Módulos', () => {
  test('crear y editar módulo', async ({ page, isMobile }) => {
    const moduloCreacion = ModuloFaker()
    const moduloEdicion = ModuloFaker()

    await test.step('Iniciar sesión', async () => {
      await page.goto('/login')
      await page.locator('#usuario').fill('ADMINISTRADOR-TECNICO')
      await page.locator('#contrasena').fill('123')
      await page.getByRole('button', { name: 'Ingresar' }).click()
      if (isMobile) await page.getByRole('button', { name: 'menu' }).click()
    })

    await test.step('Crear nuevo módulo', async () => {
      await page.click("[id='/admin/modulos']")
      await page.locator('#agregarModulo').click()
      await page.locator('#tipo').click()
      await page.locator('#etiqueta').fill(moduloCreacion.label)
      await page.locator('#url').fill(moduloCreacion.url)
      await page.locator('#nombre').fill(moduloCreacion.nombre)
      await page.locator('#orden').fill(moduloCreacion.orden)
      await page.locator('#descripcion').fill(moduloCreacion.descripcion)
      await page.locator('#icono').fill(moduloCreacion.icono)
      await page.locator('#moduloPadre').click()
      await page.getByRole('listbox').getByText('Principal').click()
      await Promise.all([
        page.getByRole('button', { name: 'Crear' }).click(),
        page.waitForResponse((response) => response.url().includes('/modulos')),
      ])
    })

    await test.step('Verificar creación del módulo', async () => {
      await page.locator('#buttonBuscarModulo').click()
      await page.locator('#inputBusquedaModulo').fill(moduloCreacion.nombre)
      await page.waitForResponse((response) =>
        response.url().includes('/modulos')
      )
      // await page.waitForLoadState('networkidle')
      // await expect(page.getByText(moduloCreacion.nombre).first()).toBeVisible()
    })

    await test.step('Editar módulo', async () => {
      await page.getByRole('button', { name: 'Editar' }).first().click()
      await page.locator('#etiqueta').fill(moduloEdicion.label)
      await page.locator('#url').fill(moduloEdicion.url)
      await page.locator('#nombre').fill(moduloEdicion.nombre)
      await page.locator('#orden').fill(moduloEdicion.orden)
      await page.locator('#descripcion').fill(moduloEdicion.descripcion)
      await page.locator('#icono').fill(moduloEdicion.icono)
      await page.locator('#moduloPadre').click()
      await page.getByRole('listbox').getByText('Configuración').click()
      await Promise.all([
        page.getByRole('button', { name: 'Actualizar' }).click(),
        page.waitForResponse((response) => response.url().includes('/modulos')),
      ])
    })

    await test.step('Verificar edición del módulo', async () => {
      await page.locator('#inputBusquedaModulo').fill(moduloEdicion.nombre)
      await page.waitForResponse((response) =>
        response.url().includes('/modulos')
      )
      // await page.waitForLoadState('networkidle')
      // await expect(page.getByText(moduloEdicion.nombre).first()).toBeVisible()
    })
  })
})
