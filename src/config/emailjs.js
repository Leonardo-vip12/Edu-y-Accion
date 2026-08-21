export const EMAILJS_CONFIG = {
  serviceId: import.meta.env?.VITE_EMAILJS_SERVICE_ID || 'REEMPLAZA_CON_TU_SERVICE_ID',
  templateId: import.meta.env?.VITE_EMAILJS_TEMPLATE_ID || 'REEMPLAZA_CON_TU_TEMPLATE_ID',
  publicKey: import.meta.env?.VITE_EMAILJS_PUBLIC_KEY || 'REEMPLAZA_CON_TU_PUBLIC_KEY',
}

export const isEmailJSConfigured = (config = EMAILJS_CONFIG) =>
  !Object.values(config).some((v) => !v || v.startsWith('REEMPLAZA'))