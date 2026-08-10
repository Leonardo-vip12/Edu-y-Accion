import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { motion } from 'framer-motion'
import {
  HiMail, HiLocationMarker, HiGlobeAlt, HiUser, HiPaperAirplane, HiCheckCircle, HiPhone, HiOutlineChatAlt2,
} from 'react-icons/hi'
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok, FaWhatsapp } from 'react-icons/fa'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { sectionReveal, fadeInRight, fadeInUp, staggerContainer } from '../../animations/variants'
import { useT } from '../../contexts/LanguageContext'
import { EMAILJS_CONFIG, isEmailJSConfigured } from '../../config/emailjs'
import { validateEmail } from '../../utils/validation'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const EMAIL = 'sembrandohuellasperu@gmail.com'
const PHONE_DISPLAY = '+51 906 888 432'
const PHONE_WA = '51906888432'

const socialLinks = [
  { icon: FaFacebook, href: 'https://facebook.com/sembrandohuellasperu', label: 'Facebook' },
  { icon: FaInstagram, href: 'https://instagram.com/sembrandohuellasperu', label: 'Instagram' },
  { icon: FaYoutube, href: 'https://youtube.com/@sembrandohuellasperu', label: 'YouTube' },
  { icon: FaTiktok, href: 'https://tiktok.com/@sembrandohuellasperu', label: 'TikTok' },
]

function Field({ icon: Icon, type = 'text', name, value, onChange, placeholder, error, textarea = false, rows = 5 }) {
  const iconChipCls = textarea
    ? 'top-3.5'
    : 'top-1/2 -translate-y-1/2'
  const fieldCls = `w-full rounded-xl bg-white/[0.06] border text-white placeholder:text-green-200/40 focus:outline-none transition-all duration-200 ${
    error
      ? 'border-red-400/60 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
      : 'border-white/10 focus:border-green-400 focus:ring-2 focus:ring-green-400/20'
  }`

  return (
    <div>
      <div className="relative">
        <span className={`absolute left-3.5 w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-400/20 flex items-center justify-center pointer-events-none ${iconChipCls}`}>
          <Icon className="text-green-300" />
        </span>
        {textarea ? (
          <textarea
            name={name}
            rows={rows}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`${fieldCls} pl-[4.6rem] pt-[0.95rem] pr-4 pb-4 resize-none`}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`${fieldCls} py-3.5 pl-[4.6rem] pr-4`}
          />
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-red-400 text-xs font-medium pl-1">{error}</p>
      )}
    </div>
  )
}

function InfoItem({ icon: Icon, title, children }) {
  return (
    <div className="flex items-center gap-4 bg-white/[0.04] border border-white/10 rounded-2xl p-4 hover:border-green-400/30 hover:bg-white/[0.06] transition-all duration-300 group">
      <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-400/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <Icon className="text-green-300 text-xl" />
      </div>
      <div className="min-w-0">
        <h4 className="text-[11px] font-semibold uppercase tracking-widest text-green-200/50 mb-0.5">{title}</h4>
        {children}
      </div>
    </div>
  )
}

export default function Contact() {
  const t = useT()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = t('contact.name_error')
    if (!form.email.trim()) newErrors.email = t('contact.email_error')
    else if (!validateEmail(form.email)) newErrors.email = t('contact.email_invalid')
    if (!form.message.trim()) newErrors.message = t('contact.message_error')

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSending(true)
    try {
      if (isEmailJSConfigured()) {
        await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          { from_name: form.name, reply_to: form.email, message: form.message },
          { publicKey: EMAILJS_CONFIG.publicKey },
        )
      } else {
        const subject = `Consulta de ${form.name} desde la web`
        window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(form.message)}`
      }
      setSubmitted(true)
    } catch {
      setErrors({ message: t('contact.send_error') })
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-900">
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0v40M0 20h40' stroke='%23ffffff' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
      }} />

      <div className="absolute -top-24 -left-24 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] bg-emerald-400/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 left-1/2 w-72 h-72 bg-green-600/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={sectionReveal}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-400/30 bg-green-400/10 backdrop-blur-sm text-green-300 text-xs font-semibold uppercase tracking-widest">
            <HiOutlineChatAlt2 className="w-4 h-4" />
            {t('contact.title')}
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white mt-5 mb-4 leading-tight">
            {t('contact.title')}
          </h2>
          <p className="text-green-100/60 max-w-xl mx-auto text-lg">
            {t('contact.subtitle')}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 rounded-full mx-auto mt-6" />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="rounded-3xl p-6 md:p-10 lg:p-12 bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-2xl shadow-green-950/50"
        >
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-start">
            <motion.div
              className="lg:col-span-3"
              variants={fadeInUp}
            >
              {submitted ? (
                <div className="bg-white/[0.05] backdrop-blur-sm rounded-2xl p-12 text-center border border-green-400/20 h-full flex flex-col items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-20 h-20 rounded-full bg-green-500/15 border border-green-400/30 flex items-center justify-center mb-6"
                  >
                    <HiCheckCircle className="text-6xl text-green-400" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">{t('contact.success_title')}</h3>
                  <p className="text-green-100/60 max-w-sm mx-auto">
                    {t('contact.success_message')}
                  </p>
                </div>
              ) : (
                <motion.form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  noValidate
                  variants={fadeInUp}
                >
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{t('contact.form_title')}</h3>
                    <p className="text-green-100/50 text-sm mb-6">
                      {t('contact.form_subtitle')}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <Field
                      icon={HiUser}
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder={t('contact.name_placeholder')}
                      error={errors.name}
                    />
                    <Field
                      icon={HiMail}
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder={t('contact.email_placeholder')}
                      error={errors.email}
                    />
                  </div>

                  <Field
                    icon={HiPaperAirplane}
                    textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder={t('contact.message_placeholder')}
                    error={errors.message}
                  />

                  <button
                    type="submit"
                    disabled={sending}
                    className="group relative w-full py-4 px-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold overflow-hidden shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <HiPaperAirplane className={`text-lg -rotate-45 ${sending ? 'animate-pulse' : 'group-hover:translate-x-1 group-hover:-translate-y-0.5'} transition-transform`} />
                    {sending ? t('contact.sending') : t('contact.send')}
                  </button>
                </motion.form>
              )}
            </motion.div>

            <motion.div
              className="lg:col-span-2 space-y-4"
              variants={fadeInRight}
            >
              <InfoItem icon={HiMail} title={t('contact.email_label')}>
                <a href={`mailto:${EMAIL}`} className="text-green-100/80 text-sm hover:text-green-300 transition-colors break-all">
                  {EMAIL}
                </a>
              </InfoItem>

              <InfoItem icon={HiPhone} title={t('contact.phone_label')}>
                <a href={`tel:${PHONE_WA}`} className="text-green-100/80 text-sm hover:text-green-300 transition-colors">
                  {PHONE_DISPLAY}
                </a>
              </InfoItem>

              <InfoItem icon={HiLocationMarker} title={t('contact.location_label')}>
                <p className="text-green-100/80 text-sm">Pucallpa, Ucayali, Perú</p>
              </InfoItem>

              <a
                href={`https://wa.me/${PHONE_WA}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-200 font-semibold hover:bg-emerald-500/25 hover:border-emerald-400/50 transition-all duration-300 group"
              >
                <FaWhatsapp className="w-5 h-5 text-emerald-300 group-hover:scale-110 transition-transform" />
                WhatsApp
              </a>

              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[11px] font-semibold uppercase tracking-widest text-green-200/50">
                    {t('contact.social_label')}
                  </h4>
                  <HiGlobeAlt className="text-green-300/60" />
                </div>
                <div className="flex gap-2.5">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.12, y: -3 }}
                      whileTap={{ scale: 0.92 }}
                      className="flex-1 p-2.5 rounded-xl bg-white/[0.06] hover:bg-green-500/20 border border-white/10 hover:border-green-400/40 text-green-100/70 hover:text-green-300 transition-all duration-200 flex items-center justify-center"
                      aria-label={social.label}
                      title={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </div>

              <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
                <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/10">
                  <HiLocationMarker className="text-green-300" />
                  <span className="text-sm font-semibold text-white">Zoológico Parque Natural de Pucallpa</span>
                </div>
                <div className="h-52 [&_.leaflet-container]:!h-full [&_.leaflet-control-zoom]:!hidden">
                  <MapContainer center={[-8.3833, -74.5333]} zoom={13} scrollWheelZoom={false} className="w-full h-full">
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[-8.3833, -74.5333]}>
                      <Popup>
                        Zoológico Parque Natural de Pucallpa <br /> Sede del Circuito Interpretativo Vivencial
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}