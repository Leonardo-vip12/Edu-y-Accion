import { describe, it, expect } from 'vitest'
import { isEmailJSConfigured } from './emailjs'

describe('isEmailJSConfigured', () => {
  it('devuelve false si quedan placeholders', () => {
    expect(
      isEmailJSConfigured({
        serviceId: 'REEMPLAZA_CON_TU_SERVICE_ID',
        templateId: 'REEMPLAZA_CON_TU_TEMPLATE_ID',
        publicKey: 'REEMPLAZA_CON_TU_PUBLIC_KEY',
      }),
    ).toBe(false)
  })

  it('devuelve false si falta alguna clave', () => {
    expect(
      isEmailJSConfigured({ serviceId: 'abc', templateId: '', publicKey: 'xyz' }),
    ).toBe(false)
  })

  it('devuelve true con todas las claves configuradas', () => {
    expect(
      isEmailJSConfigured({ serviceId: 'abc', templateId: 'def', publicKey: 'xyz' }),
    ).toBe(true)
  })
})