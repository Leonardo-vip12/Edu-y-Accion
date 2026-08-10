import { describe, it, expect } from 'vitest'
import { resolveTranslation } from './resolve'

const translations = {
  es: { nav: { inicio: 'Inicio' }, solo_es: 'Texto solo en ES' },
  en: { nav: { inicio: 'Home' } },
}

describe('resolveTranslation', () => {
  it('resuelve en el idioma solicitado', () => {
    expect(resolveTranslation(translations, 'en', 'nav.inicio')).toBe('Home')
    expect(resolveTranslation(translations, 'es', 'nav.inicio')).toBe('Inicio')
  })

  it('cae al idioma fallback (es) si la clave no existe', () => {
    expect(resolveTranslation(translations, 'en', 'solo_es')).toBe('Texto solo en ES')
  })

  it('devuelve la clave si no existe en ningún idioma', () => {
    expect(resolveTranslation(translations, 'fr', 'no.existe.clave')).toBe('no.existe.clave')
  })

  it('es inmune a idiomas no definidos', () => {
    expect(resolveTranslation(translations, 'fr', 'nav.inicio')).toBe('Inicio')
  })
})