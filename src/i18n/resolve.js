export function resolveTranslation(translations, lang, key, fallbackLang = 'es') {
  const keys = key.split('.')
  for (const l of [lang, fallbackLang]) {
    let val = translations[l]
    if (!val) continue
    for (const k of keys) {
      val = val[k]
      if (val == null) break
    }
    if (val != null) return val
  }
  return key
}