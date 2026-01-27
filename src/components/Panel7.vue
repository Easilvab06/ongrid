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
          <div class="title">Soinsolar</div>
          <div class="button-container">
            <button class="button instagram" @click="openSocial('instagram')">
              <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="white" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
            </button>
            <button class="button facebook" @click="openSocial('facebook')">
              <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="none">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </button>
            <button class="button Whatsapp" @click="openSocial('Whatsapp')">
              <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="none">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Botón Contáctanos -->
      <button class="contact-button" @click="showContactForm = true">
        Contáctanos
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
                  
                  <!-- Vista previa para imágenes y PDFs -->
                  <div v-if="imagePreview || formData.facturaFile" class="image-preview-container">
                    <p class="preview-label">{{ imagePreview ? 'Vista previa:' : 'Archivo cargado:' }}</p>
                    
                    <!-- Vista previa de imagen -->
                    <img v-if="imagePreview" :src="imagePreview" alt="Vista previa" class="image-preview" />
                    
                    <!-- Icono para PDF -->
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
                    
                    <!-- Botón de descarga directa -->
                    <button 
                      type="button" 
                      class="download-button" 
                      @click="downloadFile"
                      title="Descargar archivo para enviar por WhatsApp"
                    >
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
              </div>



              <!-- 5. Autorizaciones -->
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

              <!-- Botón para exportar a Excel -->
              <button class="excel-export-button" type="button" @click="exportToExcel" :disabled="isExporting">
                {{ isExporting ? 'Exportando...' : '📊 Exportar a Excel' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as XLSX from 'xlsx'
import { useCotizacionStore } from '../store/cotizacion.js'

const showContactForm = ref(false)
const isSubmitting = ref(false)
const isExporting = ref(false)
const imagePreview = ref(null)
const fileName = ref('')
const fileSize = ref('')
const fileInput = ref(null)

const cotizacionStore = useCotizacionStore()

onMounted(() => {
  cotizacionStore.cargarRegistros()
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
    imagePreview.value = null
    fileName.value = ''
    fileSize.value = ''
    formData.value.facturaFile = null
    formData.value.facturaBase64 = null
    return
  }

  // Validar tamaño del archivo (5MB máximo)
  if (file.size > 5 * 1024 * 1024) {
    alert('ERROR: El archivo es demasiado grande. Maximo 5MB.')
    event.target.value = ''
    imagePreview.value = null
    fileName.value = ''
    fileSize.value = ''
    formData.value.facturaFile = null
    formData.value.facturaBase64 = null
    return
  }

  // Validar tipo de archivo
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
  if (!allowedTypes.includes(file.type)) {
    alert('ERROR: Tipo de archivo no permitido. Solo se aceptan PDF, JPG, JPEG y PNG.')
    event.target.value = ''
    imagePreview.value = null
    fileName.value = ''
    fileSize.value = ''
    formData.value.facturaFile = null
    formData.value.facturaBase64 = null
    return
  }

  try {
    // Guardar información del archivo
    fileName.value = file.name
    fileSize.value = formatFileSize(file.size)
    formData.value.facturaFile = file

    // Convertir a base64 para vista previa (solo para imágenes)
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        imagePreview.value = e.target.result
        formData.value.facturaBase64 = e.target.result
        console.log('Imagen cargada exitosamente')
      }
      
      reader.onerror = (error) => {
        console.error('Error al leer el archivo:', error)
        alert('ERROR: Error al cargar la imagen. Intentalo de nuevo.')
      }
      
      reader.readAsDataURL(file)
    } else if (file.type === 'application/pdf') {
      // Para PDFs, solo guardamos el archivo sin vista previa
      imagePreview.value = null
      formData.value.facturaBase64 = null
      console.log('PDF cargado exitosamente')
    }

  } catch (error) {
    console.error('Error al procesar el archivo:', error)
    alert('ERROR: Error al cargar el archivo. Intentalo de nuevo.')
    event.target.value = ''
    imagePreview.value = null
    fileName.value = ''
    fileSize.value = ''
    formData.value.facturaFile = null
    formData.value.facturaBase64 = null
  }
}

const handleFormSubmit = async () => {
  isSubmitting.value = true

  try {
    // Crear mensaje formateado para WhatsApp (sin caracteres especiales problemáticos)
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

    // Agregar información de la factura si existe
    if (formData.value.facturaFile) {
      mensaje += `
Archivo adjunto: ${fileName.value} (${fileSize.value})

*NOTA IMPORTANTE:* El cliente adjunto una factura de energia.`
    }

    mensaje += `

*INFORMACION DEL INMUEBLE*
----------------------------------
Tipo: ${formData.value.tipoInmueble}
Tipo de techo: ${formData.value.tipoTecho}
Area disponible: ${formData.value.area} m2



Fecha: ${new Date().toLocaleDateString('es-CO')}
Hora: ${new Date().toLocaleTimeString('es-CO')}`

    // Enviar mensaje por WhatsApp al nuevo número
    const numeroWhatsApp = '573163799455'
    const mensajeCodificado = encodeURIComponent(mensaje)
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`
    
    // Guardar registro en el store
    const registro = {
      name: formData.value.name,
      email: formData.value.email,
      phone: formData.value.phone,
      city: formData.value.city,
      consumo: formData.value.consumo,
      factura: formData.value.factura,
      tipoInmueble: formData.value.tipoInmueble,
      tipoTecho: formData.value.tipoTecho,
      area: formData.value.area,
      politica: formData.value.politica,
      contacto: formData.value.contacto
    }

    cotizacionStore.guardarRegistro(registro)

    // Abrir WhatsApp
    window.open(urlWhatsApp, '_blank')

    // Mostrar mensaje de éxito con instrucciones
    setTimeout(() => {
      let mensajeExito = 'PERFECTO! WhatsApp se ha abierto con tu informacion.\n\n'
      
      if (formData.value.facturaFile) {
        const fileType = formData.value.facturaFile.type.startsWith('image/') ? 'imagen' : 'PDF'
        mensajeExito += `IMPORTANTE: Para enviar la factura:\n`
        mensajeExito += `1. Descarga el archivo usando el boton "Descargar ${fileType.toUpperCase()}"\n`
        mensajeExito += `2. En WhatsApp, adjunta el archivo descargado\n\n`
      }
      
      mensajeExito += 'También puedes llamarnos al: ' + formData.value.phone + '\n\n'
      mensajeExito += 'Gracias por confiar en Soinsolar!'
      
      alert(mensajeExito)
    }, 1500)

    // Limpiar formulario
    formData.value = {
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
      sistema: '',
      baterias: '',
      cobertura: 100,
      presupuesto: '',
      tiempo: '',
      politica: false,
      contacto: false
    }

    // Limpiar vista previa
    imagePreview.value = null
    fileName.value = ''
    fileSize.value = ''
    
    // Limpiar input de archivo
    if (fileInput.value) {
      fileInput.value.value = ''
    }

    // Cerrar modal
    setTimeout(() => {
      showContactForm.value = false
    }, 3000)

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
    // Obtener todos los registros del store
    const registros = cotizacionStore.obtenerRegistros()

    if (registros.length === 0) {
      alert('❌ No hay registros para exportar. Complete al menos un formulario primero.')
      return
    }

    // Crear datos para Excel
    const data = registros.map(registro => ({
      'ID': registro.id,
      'Nombre': registro.name,
      'Email': registro.email,
      'Teléfono': registro.phone,
      'Ciudad': registro.city,
      'Consumo mensual (kWh)': registro.consumo,
      'Factura disponible': registro.factura,
      'Tipo de inmueble': registro.tipoInmueble,
      'Tipo de techo': registro.tipoTecho,
      'Área disponible (m²)': registro.area,
      'Política de datos': registro.politica ? 'Sí' : 'No',
      'Autorización de contacto': registro.contacto ? 'Sí' : 'No',
      'Fecha de solicitud': new Date(registro.fecha).toLocaleDateString('es-CO'),
      'Hora de solicitud': new Date(registro.fecha).toLocaleTimeString('es-CO')
    }))

    // Crear libro de Excel
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Cotizaciones Solar')

    // Generar archivo y descargar
    const fileName = `cotizaciones_solar_todas_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, fileName)

    alert(`✅ Archivo Excel exportado exitosamente! Se exportaron ${registros.length} registros.`)
  } catch (error) {
    console.error('Error al exportar Excel:', error)
    alert('❌ Error al exportar el archivo Excel. Inténtalo de nuevo.')
  } finally {
    isExporting.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&display=swap');

/* Estilos para vista previa de imagen y PDF */
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

.pdf-icon svg {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.file-info {
  font-size: 12px;
  color: #1e293b;
  font-weight: 600;
  margin: 0 0 12px 0;
}

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

.download-button:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
}

.download-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.download-button svg {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.file-hint {
  font-size: 12px;
  color: #64748b;
  margin-top: 8px;
  font-style: italic;
}

/* Resto de estilos originales */
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

.social-card .main .left {
  left: 0;
}

.social-card .main .right {
  right: 0;
  transform: translateX(50%) scale(-1, 1);
}

.social-card .main .title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 90px;
  font-weight: bold;
  font-size: 18px;
  opacity: 0;
  z-index: -1;
  transition: all 0.2s ease-out 0s;
  color: #1e293b;
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
  padding: 5px 10px;
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
  width: 15px;
  transition: all 0.2s cubic-bezier(0.785, 0.135, 0.15, 0.86);
}

.social-card .main .button-container .button:nth-child(1) {
  bottom: 300px;
  transition-delay: 0.4s;
}

.social-card .main .button-container .button:nth-child(2) {
  bottom: 300px;
  transition-delay: 0.6s;
}

.social-card .main .button-container .button:nth-child(3) {
  bottom: 300px;
  transition-delay: 0.8s;
}

.social-card .main .button-container .button:hover .svg {
  transform: scale(1.2);
}

.social-card .main .button-container .button:active .svg {
  transform: scale(0.7);
}

.social-card .main .button-container .button.instagram:hover .svg {
  stroke: #8b5cf6;
}

.social-card .main .button-container .button.facebook:hover .svg {
  fill: #3b82f6;
}

.social-card .main .button-container .button.Whatsapp:hover .svg {
  fill: #25d366;
}

.social-card:hover .main {
  transform: scale(1.1);
}

.social-card:hover .main .top {
  top: -50px;
}

.social-card:hover .main .left {
  left: -50px;
  transition: all 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86) 0.1s;
}

.social-card:hover .main .right {
  right: -50px;
  transition: all 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86) 0.1s;
}

.social-card:hover .main .title {
  opacity: 1;
  transition: all 0.2s ease-out 1.3s;
}

.social-card:hover .main .button-container .button:nth-child(1) {
  bottom: 80px;
  transition-delay: 0.8s;
}

.social-card:hover .main .button-container .button:nth-child(2) {
  bottom: 40px;
  transition-delay: 0.6s;
}

.social-card:hover .main .button-container .button:nth-child(3) {
  bottom: 0;
  transition-delay: 0.4s;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

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

.contact-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 176, 39, 0.6);
}

.contact-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
  top: 20px;
  right: 20px;
  background: #ffffff;
  border: 4px solid #F5B027;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  color: #F5B027;
  z-index: 10001;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  animation: pulse 2s infinite;
}

.close-button:hover {
  background: #F5B027;
  color: white;
  border-color: #F5B027;
  transform: scale(1.2);
  box-shadow: 0 8px 25px rgba(245, 176, 39, 0.6);
  animation: none;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.gold-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

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
  display: flex;
  flex-direction: column;
  gap: 30px;
  position: relative;
  overflow: hidden;
}

.gold-form::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #1f2c51, #F5B027, #1f2c51);
  border-radius: 24px 24px 0 0;
}

.form-section {
  border-bottom: 2px solid rgba(255, 255, 255, 0.4);
  padding-bottom: 25px;
  margin-bottom: 25px;
  position: relative;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.form-section::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #1f2c51, #F5B027);
  border-radius: 1px;
}

.section-title {
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 20px 0;
  text-align: left;
  letter-spacing: -0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 10px;
}

.checkbox-group {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 15px;
  color: #1e293b;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  line-height: 1.5;
  flex: 1;
}

.checkbox-label input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  width: 24px;
  height: 24px;
  background: white;
  border: 3px solid #1e293b;
  border-radius: 6px;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  margin-top: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.checkmark::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: #1f2c51;
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate(-50%, -50%);
}

.checkbox-label input[type="checkbox"]:checked + .checkmark {
  background: #10b981;
  border-color: #10b981;
  transform: scale(1.05);
}

.checkbox-label input[type="checkbox"]:checked + .checkmark::before {
  width: 12px;
  height: 12px;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
  font-weight: bold;
  animation: checkmarkPulse 0.3s ease-out;
}

@keyframes checkmarkPulse {
  0% { transform: translate(-50%, -50%) scale(0); }
  50% { transform: translate(-50%, -50%) scale(1.2); }
  100% { transform: translate(-50%, -50%) scale(1); }
}

.gold-form-group {
  position: relative;
  margin-bottom: 20px;
}

.gold-form-label {
  display: block;
  color: #1e293b;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 10px;
  text-transform: none;
  letter-spacing: 0.3px;
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.gold-form-input,
.gold-form-textarea,
.gold-form select {
  width: 100%;
  padding: 16px 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.95);
  border-radius: 14px;
  font-weight: 600;
  font-size: 16px;
  color: #1e293b;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.1),
    inset 0 1px 3px rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
}

.gold-form-input::placeholder,
.gold-form-textarea::placeholder {
  color: #94a3b8;
  font-weight: 500;
}

.gold-form-textarea {
  height: 100px;
  resize: vertical;
  min-height: 80px;
}

.gold-form select {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 40px;
  appearance: none;
}

.gold-form-input:focus,
.gold-form-textarea:focus,
.gold-form select:focus {
  outline: none;
  border-color: #10b981;
  background: white;
  box-shadow:
    0 0 0 3px rgba(16, 185, 129, 0.1),
    0 8px 20px rgba(0, 0, 0, 0.15),
    inset 0 1px 3px rgba(255, 255, 255, 0.8);
  transform: translateY(-1px);
}

.gold-form-input:focus + .gold-form-label,
.gold-form-textarea:focus + .gold-form-label,
.gold-form select:focus + .gold-form-label {
  color: #1f2c51;
  font-weight: 800;
}

.gold-form-button {
  width: 100%;
  padding: 18px 24px;
  background: white;
  border: 2px solid #1f2c51;
  border-radius: 16px;
  color: #1f2c51;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow:
    0 8px 25px rgba(31, 44, 81, 0.2),
    0 4px 15px rgba(31, 44, 81, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.gold-form-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.gold-form-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.gold-form-button:hover:not(:disabled)::before {
  left: 100%;
}

.gold-form-button:hover:not(:disabled) {
  box-shadow:
    0 12px 35px rgba(31, 44, 81, 0.4),
    0 6px 20px rgba(31, 44, 81, 0.3),
    inset 0 1px 3px rgba(255, 255, 255, 0.3);
  transform: translateY(-3px);
}

.gold-form-button:active:not(:disabled) {
  transform: translateY(-1px);
  box-shadow:
    0 4px 15px rgba(31, 44, 81, 0.3),
    0 2px 10px rgba(31, 44, 81, 0.2),
    inset 0 1px 3px rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .gold-form {
    padding: 25px;
    max-width: 100%;
  }

  .section-title {
    font-size: 16px;
  }

  .gold-form-input,
  .gold-form-textarea,
  .gold-form select {
    padding: 14px 16px;
    font-size: 15px;
  }

  .gold-form-button {
    padding: 16px 20px;
    font-size: 15px;
  }

  .image-preview {
    max-width: 100%;
  }
  
  .pdf-icon {
    padding: 15px;
  }
  
  .pdf-icon svg {
    width: 60px;
    height: 60px;
  }
}

/* Excel Export Button Styles */
.excel-export-button {
  width: 100%;
  padding: 18px 24px;
  background: linear-gradient(135deg, #10b981, #059669);
  border: 2px solid #10b981;
  border-radius: 16px;
  color: white;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow:
    0 8px 25px rgba(16, 185, 129, 0.2),
    0 4px 15px rgba(16, 185, 129, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.excel-export-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.excel-export-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.excel-export-button:hover:not(:disabled)::before {
  left: 100%;
}

.excel-export-button:hover:not(:disabled) {
  box-shadow:
    0 12px 35px rgba(16, 185, 129, 0.4),
    0 6px 20px rgba(16, 185, 129, 0.3),
    inset 0 1px 3px rgba(255, 255, 255, 0.3);
  transform: translateY(-3px);
}

.excel-export-button:active:not(:disabled) {
  transform: translateY(-1px);
  box-shadow:
    0 4px 15px rgba(16, 185, 129, 0.3),
    0 2px 10px rgba(16, 185, 129, 0.2),
    inset 0 1px 3px rgba(255, 255, 255, 0.2);
}
</style>
