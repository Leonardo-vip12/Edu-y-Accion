import { describe, it, expect } from 'vitest'
import { validateEmail } from './validation'

describe('validateEmail', () => {
  it('acepta emails válidos', () => {
    expect(validateEmail('hola@sembrandohuellasperu.org')).toBe(true)
    expect(validateEmail('nombre.apellido+etiqueta@dominio.pe')).toBe(true)
  })

  it('rechaza emails inválidos', () => {
    expect(validateEmail('')).toBe(false)
    expect(validateEmail('sin-arroba')).toBe(false)
    expect(validateEmail('sin@dominio')).toBe(false)
    expect(validateEmail('con espacios@dominio.com')).toBe(false)
    expect(validateEmail('@inicio.com')).toBe(false)
  })
})