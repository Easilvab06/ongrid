<template>
  <div class="panel7">
    <div class="panel-content">
      <h2 class="panel-title">Redes Sociales</h2>
      <p class="panel-subtitle">Conéctate con nosotros en nuestras plataformas</p>

      <div class="social-card">
        <div class="boxshadow"></div>
        <div class="main">
          <div class="top"></div>
          <div class="left side"></div>
          <div class="right side"></div>

          <!-- Logo centrado en el polígono (visible en estado normal) -->
          <div class="logo-center">
            <div class="logo-wrapper">
              <img src="@/assets/logo8.png" alt="Soinsolar" class="logo-svg" />
            </div>
          </div>

          <div class="title">Soinsolar</div>
          <div class="button-container">
            <button class="button instagram" @click="openSocial('instagram')">
              <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" stroke="white" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
            </button>
            <button class="button facebook" @click="openSocial('facebook')">
              <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="none">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </button>
            <button class="button Whatsapp" @click="openSocial('Whatsapp')">
              <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="none">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Botón Añadir información -->
      <button v-if="!isSharedLink" class="contact-button" @click="showContactForm = true">
        Añadir información
      </button>

      <!-- Botón Nuestros Proyectos -->
      <button class="proyectos-button" @click="openProyectos">
        Nuestros Proyectos
      </button>

      <!-- Formulario de Contacto -->
      <div v-if="showContactForm" class="contact-form-overlay" @click="showContactForm = false">
        <div class="contact-form-container" @click.stop>
          <button class="close-button" @click="showContactForm = false">×</button>
          <div class="gold-form-container">
            <form class="gold-form" @submit.prevent="handleFormSubmit">
              <!-- 1. Datos del cliente -->
              <div class="form-section">
                <h3 class="section-title">👤 Datos del cliente</h3>
                <div class="gold-form-group">
                  <label class="gold-form-label" for="name">Nombre</label>
                  <input class="gold-form-input" type="text" id="name" v-model="formData.name" required />
                </div>
                <div class="gold-form-group">
                  <label class="gold-form-label" for="email">Correo</label>
                  <input class="gold-form-input" type="email" id="email" v-model="formData.email" required />
                </div>
                <div class="gold-form-group">
                  <label class="gold-form-label" for="phone">Teléfono / WhatsApp</label>
                  <input class="gold-form-input" type="tel" id="phone" v-model="formData.phone" required />
                </div>
                <div class="gold-form-group">
                  <label class="gold-form-label" for="city">Ciudad</label>
                  <input class="gold-form-input" type="text" id="city" v-model="formData.city" required />
                </div>
                <div class="gold-form-group">
                  <label class="gold-form-label" for="sistema">Sistema deseado</label>
                  <select class="gold-form-input" id="sistema" v-model="formData.sistema" required>
                    <option value="">Seleccionar...</option>
                    <option value="inyeccion-red">Inyección a red</option>
                    <option value="hibrido">Híbrido</option>
                  </select>
                </div>
              </div>

              <!-- 2. Información de consumo eléctrico -->
              <div class="form-section">
                <h3 class="section-title">⚡ Información de consumo eléctrico</h3>
                <div class="gold-form-group">
                  <label class="gold-form-label" for="consumo">Consumo mensual promedio (kWh)</label>
                  <input class="gold-form-input" type="number" id="consumo" v-model="formData.consumo" min="70" max="2827" required />
                </div>
                <div class="gold-form-group">
                  <label class="gold-form-label" for="factura">¿Tiene factura de energía?</label>
                  <select class="gold-form-input" id="factura" v-model="formData.factura" required>
                    <option value="">Seleccionar...</option>
                    <option value="si">Sí</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div v-if="formData.factura === 'si'" class="gold-form-group">
                  <label class="gold-form-label" for="factura-file">Adjuntar factura de energía</label>
                  <input
                    class="gold-form-input"
                    type="file"
                    id="factura-file"
                    ref="fileInput"
                    accept=".pdf,.jpg,.jpeg,.png"
                    @change="handleFileChange"
                  />
                  <p class="file-hint">Formatos aceptados: PDF, JPG, JPEG, PNG - Maximo 5MB</p>

                  <div v-if="imagePreview || formData.facturaFile" class="image-preview-container">
                    <p class="preview-label">{{ imagePreview ? 'Vista previa:' : 'Archivo cargado:' }}</p>
                    <img v-if="imagePreview" :src="imagePreview" alt="Vista previa" class="image-preview" />
                    <div v-if="!imagePreview && formData.facturaFile" class="pdf-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                    <p class="file-info">Archivo: {{ fileName }} - {{ fileSize }}</p>
                    <button type="button" class="download-button" @click="downloadFile" title="Descargar archivo para enviar por WhatsApp">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      Descargar {{ imagePreview ? 'Imagen' : 'PDF' }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- 3. Información del inmueble -->
              <div class="form-section">
                <h3 class="section-title">🏠 Información del inmueble</h3>
                <div class="gold-form-group">
                  <label class="gold-form-label" for="tipo-inmueble">Tipo de inmueble</label>
                  <select class="gold-form-input" id="tipo-inmueble" v-model="formData.tipoInmueble" required>
                    <option value="">Seleccionar...</option>
                    <option value="casa">Casa</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="oficina">Oficina</option>
                    <option value="comercial">Comercial</option>
                  </select>
                </div>
                <div class="gold-form-group">
                  <label class="gold-form-label" for="tipo-techo">Tipo de techo</label>
                  <select class="gold-form-input" id="tipo-techo" v-model="formData.tipoTecho" required>
                    <option value="">Seleccionar...</option>
                    <option value="teja">Teja</option>
                    <option value="plano">Plano</option>
                    <option value="losa">Losa</option>
                    <option value="metalico">Metálico</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div class="gold-form-group">
                  <label class="gold-form-label" for="area">Área disponible para paneles (m²)</label>
                  <input class="gold-form-input" type="number" id="area" v-model="formData.area" min="1" required />
                </div>
                <div class="gold-form-group">
                  <label class="gold-form-label" for="tipo-acometida">Tipo de acometida</label>
                  <select class="gold-form-input" id="tipo-acometida" v-model="formData.tipoAcometida" required>
                    <option value="">Seleccionar...</option>
                    <option value="monofasica">Monofásica</option>
                    <option value="bifasica">Bifásica</option>
                    <option value="trifasica">Trifásica</option>
                  </select>
                </div>
                <div class="gold-form-group">
                  <label class="gold-form-label" for="calibre-acometida">Calibre de acometida</label>
                  <input class="gold-form-input" type="text" id="calibre-acometida" v-model="formData.calibreAcometida" placeholder="Ej: 4/0 AWG" required />
                </div>
                <div class="gold-form-group">
                  <label class="gold-form-label" for="transformador">Transformador</label>
                  <input class="gold-form-input" type="text" id="transformador" v-model="formData.transformador" placeholder="Ej: 25 kVA" required />
                </div>
                <div class="gold-form-group">
                  <label class="gold-form-label" for="numero-matricula">Número de matrícula</label>
                  <input class="gold-form-input" type="text" id="numero-matricula" v-model="formData.numeroMatricula" placeholder="Ej: 123456789" required />
                </div>
              </div>

              <!-- 4. Autorizaciones -->
              <div class="form-section">
                <h3 class="section-title">📄 Autorizaciones</h3>
                <div class="gold-form-group checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="formData.politica" required />
                    <span class="checkmark"></span>
                    Acepto política de tratamiento de datos
                  </label>
                </div>
                <div class="gold-form-group checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="formData.contacto" required />
                    <span class="checkmark"></span>
                    Autorizo ser contactado por Soinsolar
                  </label>
                </div>
              </div>

              <button class="gold-form-button" type="submit" :disabled="isSubmitting">
                {{ isSubmitting ? 'Enviando...' : 'Enviar' }}
              </button>

              <button class="excel-export-button" type="button" @click="exportToExcel" :disabled="isExporting">
                {{ isExporting ? 'Exportando...' : '📊 Exportar a Excel' }}
              </button>

              <button class="clear-records-button" type="button" @click="clearRecords" :disabled="isClearing">
                {{ isClearing ? 'Limpiando...' : '🗑️ Limpiar Registros' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ TARJETA ASESOR — visible SOLO en enlace compartido ══════════════ -->
    <div v-if="isSharedLink && advisorName" class="advisor-card">
      <div class="advisor-inner">
        <div class="advisor-photo-ring">
          <img v-if="advisorPhoto" :src="advisorPhoto" :alt="advisorName" class="advisor-photo" />
          <div v-else class="advisor-photo advisor-photo-placeholder">
            {{ advisorName.charAt(0).toUpperCase() }}
          </div>
          <div class="advisor-verified">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        </div>
        <div class="advisor-text">
          <span class="advisor-label">Tu asesor Soinsolar</span>
          <span class="advisor-name">{{ advisorName }}</span>
          <span class="advisor-role">{{ advisorRole }}</span>
        </div>
        <div class="advisor-deco"></div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import * as XLSX from 'xlsx'
import { useCotizacionStore } from '../store/cotizacion.js'

// ── Fotos cargadas dinámicamente — no rompe si falta algún archivo ───────────
const allImages = import.meta.glob('@/assets/*.png', { eager: true, import: 'default' })
const getAsset = (filename) => {
  const key = Object.keys(allImages).find(k => k.endsWith('/' + filename))
  return key ? allImages[key] : null
}

const ADVISOR_PHOTOS = {
  mauricio:      () => getAsset('mauricio.png'),
  juan:          () => getAsset('juan.png'),
  juansebastian: () => getAsset('juan.png'),
  wilson:        () => getAsset('wilson.png'),
  aldair:        () => getAsset('aldair.png'),
  aladair:       () => getAsset('aldair.png'),
}

const ADVISOR_NAMES = {
  mauricio:      'Mauricio',
  juan:          'Juan',
  juansebastian: 'Juan Sebastián',
  wilson:        'Wilson',
  aldair:        'Aldair',
  aladair:       'Aldair',
  santiago:      'Santiago',
  mario:         'Mario',
}

// ── Roles por asesor — Wilson: Director Comercial, resto: Ing. Comercial ─────
const ADVISOR_ROLES = {
  wilson: '🏢 Director Comercial',
}

const DEFAULT_ROLE = '📐 Ing. Comercial'

const showContactForm = ref(false)
const isSubmitting    = ref(false)
const isExporting     = ref(false)
const isClearing      = ref(false)
const imagePreview    = ref(null)
const fileName        = ref('')
const fileSize        = ref('')
const fileInput       = ref(null)
const isSharedLink    = ref(false)

// Campo exclusivo para el asesor — separado del userName del cliente
const advisorKey = ref('')

const cotizacionStore = useCotizacionStore()

const advisorPhoto = computed(() => {
  const key = advisorKey.value.toLowerCase()
  const fn = ADVISOR_PHOTOS[key]
  return fn ? fn() : null
})

const advisorName = computed(() => {
  const key = advisorKey.value.toLowerCase()
  return ADVISOR_NAMES[key] || advisorKey.value || ''
})

// ── Rol dinámico según el asesor ─────────────────────────────────────────────
const advisorRole = computed(() => {
  const key = advisorKey.value.toLowerCase()
  return ADVISOR_ROLES[key] ?? DEFAULT_ROLE
})

onMounted(() => {
  cotizacionStore.cargarRegistros()
  const urlParams = new URLSearchParams(window.location.search)
  const isNew = urlParams.has('d')
  const isOld = urlParams.has('data')
  isSharedLink.value = isNew || isOld

  if (isNew || isOld) {
    try {
      let data
      if (isNew) {
        const _fromB64 = (b64) => decodeURIComponent(escape(atob(b64)))
        data = JSON.parse(_fromB64(urlParams.get('d')))
      } else {
        data = JSON.parse(decodeURIComponent(urlParams.get('data')))
      }
      // advisorName viene del campo dedicado al asesor, nunca del nombre del cliente
      advisorKey.value = data.advisorName || ''
    } catch (_) {}
  }
})

const formData = ref({
  name: '',
  email: '',
  phone: '',
  city: '',
  consumo: '',
  factura: '',
  facturaFile: null,
  facturaBase64: null,
  tipoInmueble: '',
  tipoTecho: '',
  area: '',
  tipoAcometida: '',
  calibreAcometida: '',
  transformador: '',
  numeroMatricula: '',
  sistema: '',
  politica: false,
  contacto: false
})

const openSocial = (platform) => {
  const urls = {
    instagram: 'https://www.instagram.com/soinsolar_renovables',
    facebook: 'https://www.facebook.com/Soinsolarenergy',
    Whatsapp: 'https://wa.me/573163799455',
  }
  window.open(urls[platform], '_blank')
}

const openProyectos = () => {
  window.open('https://soinsolar.com/sistemas-solares-tecnolog%C3%ADa-inyecci%C3%B3n-a-la-red', '_blank')
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const downloadFile = () => {
  if (formData.value.facturaFile) {
    const file = formData.value.facturaFile
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName.value
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    const fileType = file.type.startsWith('image/') ? 'Imagen' : 'PDF'
    alert(`${fileType} descargado! Ahora puedes enviarla por WhatsApp manualmente.`)
  }
}

const handleFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) {
    imagePreview.value = null; fileName.value = ''; fileSize.value = ''
    formData.value.facturaFile = null; formData.value.facturaBase64 = null
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    alert('ERROR: El archivo es demasiado grande. Maximo 5MB.')
    event.target.value = ''; imagePreview.value = null; fileName.value = ''; fileSize.value = ''
    formData.value.facturaFile = null; formData.value.facturaBase64 = null
    return
  }
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
  if (!allowedTypes.includes(file.type)) {
    alert('ERROR: Tipo de archivo no permitido. Solo se aceptan PDF, JPG, JPEG y PNG.')
    event.target.value = ''; imagePreview.value = null; fileName.value = ''; fileSize.value = ''
    formData.value.facturaFile = null; formData.value.facturaBase64 = null
    return
  }
  try {
    fileName.value = file.name
    fileSize.value = formatFileSize(file.size)
    formData.value.facturaFile = file
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => { imagePreview.value = e.target.result; formData.value.facturaBase64 = e.target.result }
      reader.onerror = () => alert('ERROR: Error al cargar la imagen. Intentalo de nuevo.')
      reader.readAsDataURL(file)
    } else if (file.type === 'application/pdf') {
      imagePreview.value = null; formData.value.facturaBase64 = null
    }
  } catch (error) {
    console.error('Error al procesar el archivo:', error)
    alert('ERROR: Error al cargar el archivo. Intentalo de nuevo.')
    event.target.value = ''; imagePreview.value = null; fileName.value = ''; fileSize.value = ''
    formData.value.facturaFile = null; formData.value.facturaBase64 = null
  }
}

const handleFormSubmit = async () => {
  isSubmitting.value = true
  try {
    let mensaje = `*NUEVA SOLICITUD SOINSOLAR*

*DATOS DEL CLIENTE*
----------------------------------
Nombre: ${formData.value.name}
Email: ${formData.value.email}
Telefono: ${formData.value.phone}
Ciudad: ${formData.value.city}

*CONSUMO ELECTRICO*
----------------------------------
Consumo mensual: ${formData.value.consumo} kWh
Factura disponible: ${formData.value.factura}`.trim()

    if (formData.value.facturaFile) {
      mensaje += `\nArchivo adjunto: ${fileName.value} (${fileSize.value})\n\n*NOTA IMPORTANTE:* El cliente adjunto una factura de energia.`
    }

    mensaje += `

*INFORMACION DEL INMUEBLE*
----------------------------------
Tipo: ${formData.value.tipoInmueble}
Tipo de techo: ${formData.value.tipoTecho}
Area disponible: ${formData.value.area} m2
Sistema deseado: ${formData.value.sistema}

Fecha: ${new Date().toLocaleDateString('es-CO')}
Hora: ${new Date().toLocaleTimeString('es-CO')}`

    const registro = {
      name: formData.value.name, email: formData.value.email, phone: formData.value.phone,
      city: formData.value.city, consumo: formData.value.consumo, factura: formData.value.factura,
      tipoInmueble: formData.value.tipoInmueble, tipoTecho: formData.value.tipoTecho,
      area: formData.value.area, tipoAcometida: formData.value.tipoAcometida,
      calibreAcometida: formData.value.calibreAcometida, transformador: formData.value.transformador,
      numeroMatricula: formData.value.numeroMatricula, sistema: formData.value.sistema,
      politica: formData.value.politica, contacto: formData.value.contacto
    }
    cotizacionStore.guardarRegistro(registro)

    const urlWhatsApp = `https://wa.me/573163799455?text=${encodeURIComponent(mensaje)}`
    window.open(urlWhatsApp, '_blank')

    setTimeout(() => {
      let mensajeExito = 'PERFECTO! WhatsApp se ha abierto con tu informacion.\n\n'
      if (formData.value.facturaFile) {
        const fileType = formData.value.facturaFile.type.startsWith('image/') ? 'imagen' : 'PDF'
        mensajeExito += `IMPORTANTE: Para enviar la factura:\n1. Descarga el archivo usando el boton "Descargar ${fileType.toUpperCase()}"\n2. En WhatsApp, adjunta el archivo descargado\n\n`
      }
      mensajeExito += 'Gracias por confiar en Soinsolar!'
      alert(mensajeExito)
    }, 1500)

    formData.value = {
      name: '', email: '', phone: '', city: '', consumo: '', factura: '',
      facturaFile: null, facturaBase64: null, tipoInmueble: '', tipoTecho: '',
      area: '', tipoAcometida: '', calibreAcometida: '', transformador: '',
      numeroMatricula: '', sistema: '', politica: false, contacto: false
    }
    imagePreview.value = null; fileName.value = ''; fileSize.value = ''
    if (fileInput.value) fileInput.value.value = ''
    setTimeout(() => { showContactForm.value = false }, 3000)
  } catch (error) {
    console.error('Error:', error)
    alert('ERROR: Hubo un error. Por favor, intenta contactarnos directamente por WhatsApp al 3163799455')
  } finally {
    isSubmitting.value = false
  }
}

const exportToExcel = async () => {
  isExporting.value = true
  try {
    const f = formData.value
    if (f.name && f.email && f.phone) {
      cotizacionStore.guardarRegistro({
        name: f.name, email: f.email, phone: f.phone, city: f.city, consumo: f.consumo,
        factura: f.factura, tipoInmueble: f.tipoInmueble, tipoTecho: f.tipoTecho,
        area: f.area, tipoAcometida: f.tipoAcometida, calibreAcometida: f.calibreAcometida,
        transformador: f.transformador, numeroMatricula: f.numeroMatricula,
        sistema: f.sistema, politica: f.politica, contacto: f.contacto
      })
    }
    const todos = cotizacionStore.obtenerRegistros()
    if (todos.length === 0) { alert('❌ No hay registros para exportar.'); return }
    const data = todos.map(r => ({
      'ID': r.id, 'Nombre': r.name, 'Email': r.email, 'Teléfono': r.phone, 'Ciudad': r.city,
      'Sistema deseado': r.sistema === 'inyeccion-red' ? 'Inyección a red' : r.sistema === 'hibrido' ? 'Híbrido' : r.sistema || '',
      'Consumo mensual (kWh)': r.consumo, 'Factura disponible': r.factura,
      'Tipo de inmueble': r.tipoInmueble, 'Tipo de techo': r.tipoTecho, 'Área disponible (m²)': r.area,
      'Tipo de acometida': r.tipoAcometida || '', 'Calibre de acometida': r.calibreAcometida || '',
      'Transformador': r.transformador || '', 'Número de matrícula': r.numeroMatricula || '',
      'Política de datos': r.politica ? 'Sí' : 'No', 'Autorización de contacto': r.contacto ? 'Sí' : 'No',
      'Fecha de solicitud': new Date(r.fecha).toLocaleDateString('es-CO'),
      'Hora de solicitud': new Date(r.fecha).toLocaleTimeString('es-CO')
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Cotizaciones Solar')
    XLSX.writeFile(wb, `cotizaciones_solar_${new Date().toISOString().split('T')[0]}.xlsx`)
    alert(`✅ Archivo Excel exportado exitosamente! Se exportaron ${todos.length} registros.`)
  } catch (error) {
    console.error('Error al exportar Excel:', error)
    alert('❌ Error al exportar el archivo Excel. Inténtalo de nuevo.')
  } finally {
    isExporting.value = false
  }
}

const clearRecords = async () => {
  if (confirm('¿Estás seguro de que quieres eliminar TODOS los registros? Esta acción no se puede deshacer.')) {
    isClearing.value = true
    try {
      cotizacionStore.limpiarRegistros()
      alert('✅ Todos los registros han sido eliminados exitosamente.')
    } catch (error) {
      console.error('Error al limpiar registros:', error)
      alert('❌ Error al limpiar los registros. Inténtalo de nuevo.')
    } finally {
      isClearing.value = false
    }
  }
}
</script>

<style scoped>
/* ── Logo centrado en el polígono ── */
.logo-center {
  position: absolute;
  top: 42%;
  left: 54%;
  transform: translate(-50%, -50%);
  z-index: 3;
  transition: all 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86);
  pointer-events: none;
}

.logo-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-ring { display: none; }
.ring1, .ring2, .ring3 { display: none; }

.logo-svg {
  position: relative;
  z-index: 2;
  width: 96px;
  height: 96px;
  display: block;
  animation: powerPulse 2s ease-in-out infinite;
  transition: all 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86);
}

@keyframes powerPulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}

.social-card:hover .logo-center {
  top: 14%;
  transform: translate(-50%, 0);
}

.social-card:hover .logo-wrapper {
  width: 64px;
  height: 64px;
}

.social-card:hover .logo-svg {
  width: 52px;
  height: 52px;
}

.social-card:hover .ring1 { width: 58px;  height: 58px; }
.social-card:hover .ring2 { width: 72px;  height: 72px; }
.social-card:hover .ring3 { width: 86px;  height: 86px; }
.social-card:hover .logo-bg-glow { width: 56px; height: 56px; }

/* ── Preview ── */
.image-preview-container {
  margin-top: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
}

.preview-label {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 10px;
}

.image-preview {
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 10px;
  display: block;
}

.pdf-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: rgba(220, 38, 38, 0.1);
  border-radius: 12px;
  margin-bottom: 10px;
}

.file-info { font-size: 12px; color: #1e293b; font-weight: 600; margin: 0 0 12px 0; }
.file-hint { font-size: 12px; color: #64748b; margin-top: 8px; font-style: italic; }

.download-button {
  width: 100%;
  padding: 12px 20px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}
.download-button:hover { background: linear-gradient(135deg, #059669, #047857); transform: translateY(-2px); }

/* ── Panel ── */
.panel7 {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 48px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(245, 176, 39, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideInUp 0.6s ease-out;
  min-height: 500px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  grid-column: span 2;
  font-family: 'Montserrat', sans-serif;
}

.panel7:hover {
  transform: translateY(-8px);
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(245, 176, 39, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 1);
}

.panel-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.panel-title {
  font-size: 36px;
  font-weight: 700;
  background: linear-gradient(135deg, #F5B027, #1f2c51);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  text-align: center;
}

.panel-subtitle {
  font-size: 18px;
  color: #64748b;
  margin: 0;
  text-align: center;
  font-weight: 500;
}

/* ── Social Card ── */
.social-card {
  position: relative;
  height: 300px;
  width: 230px;
}

.social-card .boxshadow {
  position: absolute;
  height: 100%;
  width: 100%;
  border: 1px solid #F5B027;
  transform: scale(0.8);
  box-shadow: rgba(245, 176, 39, 0.3) 0px 30px 70px 0px;
  transition: all 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86);
}

.social-card .main {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(135deg,
    rgba(156, 163, 175, 0.95) 0%,
    rgba(255, 255, 255, 0.98) 50%,
    rgba(245, 176, 39, 0.9) 100%);
  background-size: 300% 300%;
  animation: gradientShift 12s ease-in-out infinite;
  position: relative;
  -webkit-clip-path: polygon(0 40px, 40px 0, calc(100% - 40px) 0, 100% 40px, 100% calc(100% - 40px), calc(100% - 40px) 100%, 40px 100%, 0 calc(100% - 40px));
  clip-path: polygon(0 40px, 40px 0, calc(100% - 40px) 0, 100% 40px, 100% calc(100% - 40px), calc(100% - 40px) 100%, 40px 100%, 0 calc(100% - 40px));
  box-shadow:
    rgba(156, 163, 175, 0.6) 0px 7px 29px 0px,
    rgba(245, 176, 39, 0.4) 0px 0px 40px 0px,
    inset 0 0 30px rgba(255, 255, 255, 0.2);
  transition: all 0.4s cubic-bezier(0.785, 0.135, 0.15, 0.86);
  filter: drop-shadow(0 0 40px rgba(156, 163, 175, 0.3));
}

.social-card .main .top {
  position: absolute;
  top: 0px;
  left: 0;
  width: 0px;
  height: 0px;
  z-index: 2;
  border-top: 115px solid rgba(245, 176, 39, 0.9);
  border-left: 115px solid transparent;
  border-right: 115px solid transparent;
  transition: all 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86);
}

.social-card .main .side {
  position: absolute;
  width: 100%;
  top: 0;
  transform: translateX(-50%);
  height: 101%;
  background: rgba(245, 176, 39, 0.9);
  -webkit-clip-path: polygon(0% 0%, 50% 0, 95% 45%, 100% 100%, 0% 100%);
  clip-path: polygon(0% 0%, 50% 0, 95% 45%, 100% 100%, 0% 100%);
  transition: all 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86) 1s;
}

.social-card .main .left { left: 0; }
.social-card .main .right { right: 0; transform: translateX(50%) scale(-1, 1); }

.social-card .main .title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 90px;
  font-weight: bold;
  font-size: 18px;
  opacity: 0;
  z-index: 4;
  transition: all 0.2s ease-out 0s;
  color: #1e293b;
  white-space: nowrap;
}

.social-card .main .button-container {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}

.social-card .main .button-container .button {
  position: absolute;
  transform: translateX(-50%);
  padding: 8px 14px;
  -webkit-clip-path: polygon(0 0, 100% 0, 81% 100%, 21% 100%);
  clip-path: polygon(0 0, 100% 0, 81% 100%, 21% 100%);
  background: rgba(245, 176, 39, 0.9);
  border: none;
  color: white;
  display: grid;
  place-content: center;
  transition: all 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86);
  cursor: pointer;
}

.social-card .main .button-container .button .svg {
  width: 20px;
  height: 20px;
  transition: all 0.2s cubic-bezier(0.785, 0.135, 0.15, 0.86);
}

.social-card .main .button-container .button:nth-child(1) { bottom: 300px; transition-delay: 0.4s; }
.social-card .main .button-container .button:nth-child(2) { bottom: 300px; transition-delay: 0.6s; }
.social-card .main .button-container .button:nth-child(3) { bottom: 300px; transition-delay: 0.8s; }

.social-card .main .button-container .button:hover .svg { transform: scale(1.2); }
.social-card .main .button-container .button:active .svg { transform: scale(0.7); }
.social-card .main .button-container .button.instagram:hover .svg { stroke: #8b5cf6; }
.social-card .main .button-container .button.facebook:hover .svg { fill: #3b82f6; }
.social-card .main .button-container .button.Whatsapp:hover .svg { fill: #25d366; }

/* ── Hover states ── */
.social-card:hover .main { transform: scale(1.1); }
.social-card:hover .main .top { top: -50px; }
.social-card:hover .main .left { left: -50px; transition: all 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86) 0.1s; }
.social-card:hover .main .right { right: -50px; transition: all 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86) 0.1s; }
.social-card:hover .main .title { opacity: 1; transition: all 0.2s ease-out 1.3s; }
.social-card:hover .main .button-container .button:nth-child(1) { bottom: 110px; transition-delay: 0.8s; }
.social-card:hover .main .button-container .button:nth-child(2) { bottom: 58px;  transition-delay: 0.6s; }
.social-card:hover .main .button-container .button:nth-child(3) { bottom: 6px;   transition-delay: 0.4s; }

/* ── Keyframes ── */
@keyframes slideInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes gradientShift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* ── Buttons ── */
.contact-button {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: linear-gradient(135deg, #F5B027, #1f2c51);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(245, 176, 39, 0.4);
  transition: all 0.3s ease;
  z-index: 10;
}

.contact-button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(245, 176, 39, 0.6); }

.proyectos-button {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: linear-gradient(135deg, #F5B027, #1f2c51);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(245, 176, 39, 0.4);
  transition: all 0.3s ease;
  z-index: 10;
}

.proyectos-button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(245, 176, 39, 0.6); }

@media (max-width: 768px) {
  .panel-title { font-size: 28px; }
  .panel-subtitle { font-size: 16px; }
  .contact-button, .proyectos-button {
    position: relative; bottom: auto; left: auto; right: auto;
    transform: none; margin-top: 40px; display: block;
    width: fit-content; margin-left: auto; margin-right: auto;
  }
  .proyectos-button { margin-bottom: 20px; }
}

/* ── Form overlay ── */
.contact-form-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.contact-form-container {
  position: relative;
  background: white;
  border-radius: 20px;
  padding: 20px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.close-button {
  position: fixed;
  top: 20px; right: 20px;
  background: #ffffff;
  border: 4px solid #F5B027;
  border-radius: 50%;
  width: 60px; height: 60px;
  display: flex; align-items: center; justify-content: center;
  font-size: 28px; font-weight: bold;
  cursor: pointer;
  color: #F5B027;
  z-index: 10001;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  animation: pulse 2s infinite;
}

.close-button:hover {
  background: #F5B027; color: white; border-color: #F5B027;
  transform: scale(1.2); animation: none;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* ── Gold Form ── */
.gold-form-container { display: flex; justify-content: center; align-items: center; padding: 10px; }

.gold-form {
  width: 100%;
  max-width: 650px;
  padding: 35px;
  background: linear-gradient(135deg, #F5B027 0%, #E89B1C 50%, #F5B027 100%);
  border-radius: 24px;
  box-shadow:
    0 25px 50px rgba(245, 176, 39, 0.3),
    0 15px 35px rgba(139, 90, 43, 0.2),
    inset 0 2px 10px rgba(255, 255, 255, 0.3),
    inset 0 -2px 10px rgba(139, 90, 43, 0.2);
  display: flex; flex-direction: column; gap: 30px;
  position: relative; overflow: hidden;
}

.gold-form::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 4px;
  background: linear-gradient(90deg, #1f2c51, #F5B027, #1f2c51);
  border-radius: 24px 24px 0 0;
}

.form-section {
  border-bottom: 2px solid rgba(255, 255, 255, 0.4);
  padding-bottom: 25px; margin-bottom: 25px; position: relative;
}
.form-section:last-child { border-bottom: none; margin-bottom: 0; }
.form-section::after {
  content: ''; position: absolute; bottom: -1px; left: 0;
  width: 60px; height: 2px;
  background: linear-gradient(90deg, #1f2c51, #F5B027); border-radius: 1px;
}

.section-title {
  font-size: 18px; font-weight: 800; color: #1e293b;
  margin: 0 0 20px 0; text-align: left; letter-spacing: -0.5px;
  display: flex; align-items: center; gap: 10px;
}

.checkbox-group { display: flex; align-items: flex-start; gap: 12px; padding: 15px; background: rgba(255, 255, 255, 0.1); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.2); }
.checkbox-label { display: flex; align-items: flex-start; gap: 12px; font-size: 15px; color: #1e293b; font-weight: 600; cursor: pointer; position: relative; line-height: 1.5; flex: 1; }
.checkbox-label input[type="checkbox"] { position: absolute; opacity: 0; cursor: pointer; }
.checkmark { width: 24px; height: 24px; background: white; border: 3px solid #1e293b; border-radius: 6px; position: relative; transition: all 0.3s; flex-shrink: 0; margin-top: 2px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.checkbox-label input[type="checkbox"]:checked + .checkmark { background: #10b981; border-color: #10b981; }
.checkbox-label input[type="checkbox"]:checked + .checkmark::after { content: '✓'; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 14px; font-weight: bold; }

.gold-form-group { position: relative; margin-bottom: 20px; }
.gold-form-label { display: block; color: #1e293b; font-size: 14px; font-weight: 700; margin-bottom: 10px; }

.gold-form-input {
  width: 100%; padding: 16px 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.95);
  border-radius: 14px; font-weight: 600; font-size: 16px; color: #1e293b;
  transition: all 0.3s; box-sizing: border-box;
}

.gold-form-input:focus {
  outline: none; border-color: #10b981; background: white;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1), 0 8px 20px rgba(0,0,0,0.15);
  transform: translateY(-1px);
}

.gold-form-button {
  width: 100%; padding: 18px 24px;
  background: white; border: 2px solid #1f2c51; border-radius: 16px;
  color: #1f2c51; font-size: 16px; font-weight: 800;
  letter-spacing: 1px; text-transform: uppercase; cursor: pointer;
  transition: all 0.3s;
}
.gold-form-button:disabled { opacity: 0.6; cursor: not-allowed; }
.gold-form-button:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 12px 35px rgba(31,44,81,0.4); }

.excel-export-button {
  width: 100%; padding: 18px 24px;
  background: linear-gradient(135deg, #10b981, #059669);
  border: 2px solid #10b981; border-radius: 16px;
  color: white; font-size: 16px; font-weight: 800;
  letter-spacing: 1px; text-transform: uppercase; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  transition: all 0.3s;
}
.excel-export-button:disabled { opacity: 0.6; cursor: not-allowed; }
.excel-export-button:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 12px 35px rgba(16,185,129,0.4); }

.clear-records-button {
  width: 100%; padding: 18px 24px;
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  border: 2px solid #dc2626; border-radius: 16px;
  color: white; font-size: 16px; font-weight: 800;
  letter-spacing: 1px; text-transform: uppercase; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  transition: all 0.3s;
}
.clear-records-button:disabled { opacity: 0.6; cursor: not-allowed; }
.clear-records-button:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 12px 35px rgba(220,38,38,0.4); }

@media (max-width: 768px) {
  .gold-form { padding: 25px; max-width: 100%; }
  .section-title { font-size: 16px; }
  .gold-form-input { padding: 14px 16px; font-size: 15px; }
  .gold-form-button, .excel-export-button, .clear-records-button { padding: 16px 20px; font-size: 15px; }
  .image-preview { max-width: 100%; }
}

/* ══ TARJETA ASESOR ══════════════════════════════════════════════════════════ */
.advisor-card {
  margin-top: 24px;
  border-radius: 24px;
  overflow: hidden;
  background: linear-gradient(135deg, #1a2444 0%, #253565 45%, #1a2444 100%);
  box-shadow: 0 20px 50px rgba(0,0,0,0.32), 0 0 0 1px rgba(245,176,39,0.28), inset 0 1px 0 rgba(255,255,255,0.06);
  animation: advisorIn 0.55s cubic-bezier(0.34,1.15,0.64,1) both;
}
@keyframes advisorIn {
  from { opacity:0; transform: translateY(20px) scale(0.97); }
  to   { opacity:1; transform: translateY(0) scale(1); }
}
.advisor-inner {
  display: flex; align-items: center; gap: 24px;
  padding: 28px 32px; position: relative; overflow: hidden;
}
.advisor-deco {
  position: absolute; right: -50px; top: 50%; transform: translateY(-50%);
  width: 200px; height: 200px; border-radius: 50%;
  background: radial-gradient(circle, rgba(245,176,39,0.14) 0%, transparent 68%);
  pointer-events: none;
}
.advisor-photo-ring { position: relative; flex-shrink: 0; }
.advisor-photo {
  width: 88px; height: 88px; border-radius: 50%; object-fit: cover; display: block;
  border: 3px solid #F5B027;
  box-shadow: 0 0 0 6px rgba(245,176,39,0.18), 0 10px 28px rgba(0,0,0,0.45);
  animation: photoPulse 3.5s ease-in-out infinite;
}
.advisor-photo-placeholder {
  width: 88px; height: 88px; border-radius: 50%;
  background: linear-gradient(135deg, #F5B027, #e89b1c);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Montserrat', sans-serif; font-size: 36px; font-weight: 900; color: #1a2444;
}
@keyframes photoPulse {
  0%,100% { box-shadow: 0 0 0 6px rgba(245,176,39,0.18), 0 10px 28px rgba(0,0,0,0.45); }
  50%      { box-shadow: 0 0 0 11px rgba(245,176,39,0.10), 0 10px 34px rgba(0,0,0,0.55); }
}
.advisor-verified {
  position: absolute; bottom: 1px; right: 1px;
  width: 27px; height: 27px; border-radius: 50%;
  background: linear-gradient(135deg, #F5B027 0%, #e89b1c 100%);
  display: flex; align-items: center; justify-content: center;
  border: 2.5px solid #1a2444; box-shadow: 0 3px 10px rgba(0,0,0,0.40);
}
.advisor-text { display: flex; flex-direction: column; gap: 5px; z-index: 1; }
.advisor-label {
  font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 700;
  letter-spacing: 2.5px; text-transform: uppercase; color: #F5B027;
}
.advisor-name {
  font-family: 'Montserrat', sans-serif; font-size: 26px; font-weight: 900;
  color: #ffffff; letter-spacing: -0.5px; line-height: 1.1;
}
.advisor-role {
  font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 500;
  color: rgba(255,255,255,0.50);
}
@media (max-width: 480px) {
  .advisor-inner { padding: 20px 22px; gap: 18px; }
  .advisor-photo, .advisor-photo-placeholder { width: 72px; height: 72px; }
  .advisor-name { font-size: 21px; }
}
</style>