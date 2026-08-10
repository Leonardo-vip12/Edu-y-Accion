export const EMAILJS_CONFIG = {
  serviceId: 'REEMPLAZA_CON_TU_SERVICE_ID',
  templateId: 'REEMPLAZA_CON_TU_TEMPLATE_ID',
  publicKey: 'REEMPLAZA_CON_TU_PUBLIC_KEY',
}

export const isEmailJSConfigured = (config = EMAILJS_CONFIG) =>
  !Object.values(config).some((v) => !v || v.startsWith('REEMPLAZA'))