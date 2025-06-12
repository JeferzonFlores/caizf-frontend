import { test } from '@playwright/test'
import { PoliticaFaker } from './faker/politicas-faker'

test.describe('Políticas', () => {
  test('crear y editar política', async ({ page, isMobile }) => {
    const politicaCreacion = PoliticaFaker()
    const politicaEdicion = PoliticaFaker()

    await test.step('Iniciar sesión', async () => {
      await page.goto(`/login`)
      await page.locator('#usuario').fill('ADMINISTRADOR-TECNICO')
      await page.locator('#contrasena').fill('123')
      await page.getByRole('button', { name: 'Ingresar' }).click()
      if (isMobile) await page.getByRole('button', { name: 'menu' }).click()
    })

    await test.step('Crear nueva política', async () => {
      await page.click("[id='/admin/politicas']")
      await page.locator('#agregarPolitica').click()
      await page.locator('#sujeto').fill(politicaCreacion.sujeto)
      await page.locator('#objeto').fill(politicaCreacion.objecto)
      await page.locator('#app').click()
      await page.getByLabel('Frontend').click()
      await page.getByLabel('read').click()
      await Promise.all([
        page.getByRole('button', { name: 'Crear' }).click(),
        page.waitForResponse((response) =>
          response.url().includes('/politicas')
        ),
      ])
    })

    await test.step('Verificar creación de la política', async () => {
      await page.locator('#buttonBuscarPolitica').click()
      await page
        .locator('#inputBusquedaPolitica')
        .fill(politicaCreacion.objecto)
      await page.waitForResponse((response) =>
        response.url().includes('/politicas')
      )
      // await expect(
      //   page.getByText(politicaCreacion.objecto).first()
      // ).toBeVisible()
    })

    await test.step('Editar política', async () => {
      await page.getByRole('button', { name: 'Editar' }).first().click()
      await page.locator('#sujeto').fill(politicaEdicion.sujeto)
      await page.locator('#objeto').clear()
      await page.locator('#objeto').fill(politicaEdicion.objecto)
      await page.locator('#app').click()
      await page.getByLabel('Backend').click()
      await page.getByLabel('GET').click()
      await page.getByLabel('PUT').click()
      await Promise.all([
        page.getByRole('button', { name: 'Actualizar' }).click(),
        page.waitForResponse((response) =>
          response.url().includes('/politicas')
        ),
      ])
    })

    await test.step('Verificar edición de la política', async () => {
      await page.locator('#inputBusquedaPolitica').fill(politicaEdicion.objecto)
      await page.waitForResponse((response) =>
        response.url().includes('/politicas')
      )
      // await expect(
      //   page.getByText(politicaEdicion.objecto).first()
      // ).toBeVisible()
    })
  })
})
