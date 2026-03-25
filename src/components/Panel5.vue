<template>
  <div class="panel1">
    <div class="panel-content">
      <!-- PANTALLA DE CARGA DE IMAGEN -->
      <div v-if="!imageLoaded" class="upload-section">
        <div class="upload-container">
          <div class="upload-icon-box">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <rect width="80" height="80" rx="16" fill="url(#gradient)" opacity="0.1"/>
              <path d="M28 32H52C54.2091 32 56 33.7909 56 36V56C56 58.2091 54.2091 60 52 60H28C25.7909 60 24 58.2091 24 56V36C24 33.7909 25.7909 32 28 32Z" stroke="#1e3a8a" stroke-width="2"/>
              <circle cx="36" cy="42" r="4" fill="#1e3a8a"/>
              <path d="M24 56L36 44L52 56" stroke="#1e3a8a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="80" y2="80">
                  <stop offset="0%" stop-color="#3b82f6"/>
                  <stop offset="100%" stop-color="#1e40af"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h2 class="upload-title">{{ isSharedLink ? 'Visitas Técnicas' : 'Visitas Técnicas - Editor' }}</h2>
          <p class="upload-subtitle">{{ isSharedLink ? 'Fotografías de la visita técnica' : 'Carga una fotografía y edítala con herramientas avanzadas' }}</p>
          <label v-if="!isSharedLink" class="upload-button">
            <input type="file" accept="image/*" @change="handleImageUpload" hidden />
            <span class="button-text">Seleccionar Imagen</span>
          </label>
          <p v-if="!isSharedLink" class="upload-hint">JPG, PNG, GIF o WebP • Máximo 10MB</p>
          <div v-if="isUploading" class="uploading-indicator">
            <div class="upload-spinner"></div>
            <span>Subiendo imagen a la nube... {{ uploadProgress }}%</span>
          </div>
          <div v-if="savedImages.length > 0" class="saved-images-section">
            <h3 class="saved-title">Imágenes Guardadas ({{ savedImages.length }})</h3>
            <div class="images-grid">
              <div v-for="(img, index) in savedImages" :key="index" class="saved-image-card">
                <img :src="img.thumb || img.data" :alt="`Imagen ${index + 1}`" class="saved-thumbnail" />
                <div class="image-info">
                  <span class="image-size">{{ formatFileSize(img.size) }}</span>
                  <div class="image-actions">
                    <button v-if="!isSharedLink" @click="editSavedImage(index)" class="edit-btn" title="Editar">📝</button>
                    <button @click="downloadImage(img.data, index)" class="download-btn" title="Descargar">⬇️</button>
                    <button v-if="!isSharedLink" @click="deleteSavedImage(index)" class="delete-btn" title="Eliminar">🗑️</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="isSharedLink && savedImages.length === 0" class="no-images-msg">
            <p>No hay fotografías disponibles para esta cotización.</p>
          </div>
        </div>
      </div>

      <!-- EDITOR -->
      <div v-else class="editor-section">
        <div class="editor-header">
          <div class="editor-title">
            <button class="back-button" @click="resetEditor" title="Volver">◀</button>
            <span class="title-text">Editor de Imagen</span>
          </div>

          <div class="toolbar">
            <!-- Selección -->
            <div class="tool-group">
              <button :class="['tool-button', { active: selectedTool === 'select' }]" @click="selectTool('select')" title="Seleccionar">🎯</button>
            </div>
            <div class="toolbar-separator"></div>

            <!-- Herramientas de dibujo -->
            <div class="tool-group">
              <button v-for="tool in drawTools" :key="tool.id"
                :class="['tool-button', { active: selectedTool === tool.id }]"
                @click="selectTool(tool.id)" :title="tool.name">{{ tool.icon }}</button>
            </div>
            <div class="toolbar-separator"></div>

            <!-- Bocadillos — dropdown vertical con scroll -->
            <div class="tool-group callout-group">
              <div class="callout-dropdown-wrapper" ref="calloutWrapperRef">
                <button
                  :class="['tool-button callout-btn', { active: calloutTools.some(c => c.id === selectedTool) }]"
                  @click="toggleCalloutMenu"
                  title="Etiquetas / Bocadillos"
                >
                  💬
                  <span class="callout-arrow">{{ showCalloutMenu ? '▴' : '▾' }}</span>
                </button>

                <!-- Dropdown vertical con scroll -->
                <div v-if="showCalloutMenu" class="callout-menu">
                  <div class="callout-menu-header">
                    <span class="callout-menu-title">Etiquetas</span>
                    <span class="callout-menu-count">{{ calloutTools.length }}</span>
                  </div>
                  <div class="callout-menu-scroll">
                    <button
                      v-for="ct in calloutTools"
                      :key="ct.id"
                      :class="['callout-item', { active: selectedTool === ct.id }]"
                      @click="selectCallout(ct.id)"
                    >
                      <span class="callout-preview">
                        <svg width="28" height="20" viewBox="0 0 28 20">
                          <rect x="1" y="1" width="22" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/>
                          <polygon points="5,14 9,14 7,19" fill="currentColor"/>
                        </svg>
                      </span>
                      <span class="callout-label">{{ ct.name }}</span>
                      <span v-if="selectedTool === ct.id" class="callout-check">✓</span>
                    </button>
                  </div>
                  <div class="callout-menu-footer">
                    <span>Clic y arrastra en la imagen</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="toolbar-separator"></div>

            <!-- Grosor -->
            <div v-if="selectedTool !== 'text' && selectedTool !== 'select'" class="tool-group size-group">
              <label class="size-label">Grosor</label>
              <input v-model.number="brushSize" type="range" min="1" max="50" class="size-slider" />
              <span class="size-value">{{ brushSize }}</span>
            </div>
            <div v-if="selectedTool === 'text'" class="tool-group size-group">
              <label class="size-label">Tamaño</label>
              <input v-model.number="fontSize" type="range" min="8" max="72" class="size-slider" />
              <span class="size-value">{{ fontSize }}</span>
            </div>
            <div v-if="selectedTool !== 'select'" class="toolbar-separator"></div>

            <!-- Color -->
            <div v-if="selectedTool !== 'select' || selectedElementIndex !== null" class="tool-group color-group">
              <label class="color-label">Color</label>
              <input v-model="brushColor" type="color" class="color-picker" @input="onColorPickerInput" />
              <!-- Presets genéricos: solo cuando NO hay bocadillo activo -->
              <div v-if="!calloutTools.some(c => c.id === selectedTool)" class="color-presets">
                <button v-for="color in colorPresets" :key="color"
                  :style="{ backgroundColor: color }"
                  @click="changeElementColor(color)" class="color-preset"></button>
              </div>
              <!-- Cuando hay bocadillo activo: mostrar su color predefinido como referencia -->
              <div v-else class="callout-color-badge">
                <span
                  class="callout-color-dot"
                  :style="{ backgroundColor: calloutTools.find(c => c.id === selectedTool)?.color }"
                  :title="calloutTools.find(c => c.id === selectedTool)?.name"
                ></span>
                <span class="callout-color-name">{{ calloutTools.find(c => c.id === selectedTool)?.name }}</span>
              </div>
            </div>
            <div v-if="selectedTool === 'text'" class="toolbar-separator"></div>
            <div v-if="selectedTool === 'text'" class="tool-group font-group">
              <label class="font-label">Fuente</label>
              <select v-model="fontFamily" class="font-select">
                <option v-for="font in fontFamilies" :key="font" :value="font">{{ font }}</option>
              </select>
            </div>
            <div class="toolbar-separator"></div>

            <!-- Acciones -->
            <div class="tool-group action-group">
              <button v-if="selectedTool === 'select' && selectedElementIndex !== null" @click="deleteSelectedElement" class="action-button delete-element" title="Eliminar">🗑️</button>
              <button @click="undoAction" :disabled="currentHistoryIndex <= 0" class="action-button undo" title="Deshacer (Ctrl+Z)">↶</button>
              <button @click="clearCanvas" class="action-button clear" title="Limpiar">🧹</button>
              <button @click="saveImage" :disabled="isUploading" class="action-button save" title="Guardar">{{ isUploading ? '⏳' : '💾' }}</button>
            </div>
          </div>
        </div>

        <div class="canvas-wrapper">
          <canvas ref="drawingCanvas"
            @mousedown="handleMouseDown" @mousemove="handleMouseMove" @mouseup="handleMouseUp" @mouseleave="handleMouseUp"
            @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd"
            class="drawing-canvas"></canvas>
          <textarea v-if="isEditingText" ref="textInput" v-model="editingText"
            @blur="finishTextEdit" @keydown.enter.exact.prevent="handleEnterKey"
            @keydown.shift.enter.prevent="handleShiftEnter" @keydown.esc="cancelTextEdit"
            :style="textInputStyle" class="text-input" rows="1" wrap="soft"></textarea>
          <div v-if="isUploading" class="upload-overlay">
            <div class="upload-overlay-content">
              <div class="upload-spinner large"></div>
              <p>Subiendo a la nube... {{ uploadProgress }}%</p>
              <div class="progress-bar"><div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div></div>
            </div>
          </div>
        </div>

        <div class="editor-footer">
          <div class="tool-info">
            <span v-if="selectedTool === 'select'" class="info-text">🎯 Selección —
              <span v-if="selectedElementIndex !== null"><strong>Elemento seleccionado:</strong> Arrastra=mover | Esquinas=redimensionar | 🔄=rotar | Del=eliminar</span>
              <span v-else>Haz clic en un elemento para seleccionarlo</span>
            </span>
            <span v-else-if="calloutTools.some(c => c.id === selectedTool)" class="info-text">
              💬 <strong>{{ calloutTools.find(c => c.id === selectedTool)?.name }}</strong> — Haz clic y arrastra para apuntar la etiqueta
            </span>
            <span v-else-if="selectedTool === 'pen'"       class="info-text">✏️ Dibujo Libre</span>
            <span v-else-if="selectedTool === 'line'"      class="info-text">📏 Línea Recta — Haz clic y arrastra</span>
            <span v-else-if="selectedTool === 'rectangle'" class="info-text">⬜ Rectángulo — Haz clic y arrastra</span>
            <span v-else-if="selectedTool === 'circle'"    class="info-text">⭕ Círculo — Haz clic y arrastra</span>
            <span v-else-if="selectedTool === 'arrow'"     class="info-text">➡️ Flecha — Haz clic y arrastra</span>
            <span v-else-if="selectedTool === 'text'"      class="info-text">🔤 Texto — Haz clic para agregar texto</span>
            <span v-else-if="selectedTool === 'eyedropper'" class="info-text">👁️ Gotero — Haz clic para seleccionar color</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useCotizacionStore } from '../store/cotizacion.js'

const IMGBB_API_KEY = 'dbda4e1846583ebc785d594953c794a4'
const cotizacionStore = useCotizacionStore()

const imageLoaded          = ref(false)
const selectedTool         = ref('select')
const brushSize            = ref(3)
const brushColor           = ref('#e11d48')
const fontSize             = ref(18)
const fontFamily           = ref('Arial')
const savedImages          = ref([])
const currentEditingIndex  = ref(null)
const drawnElements        = ref([])
const selectedElementIndex = ref(null)
const isSharedLink         = ref(false)
const isUploading          = ref(false)
const uploadProgress       = ref(0)
const showCalloutMenu      = ref(false)
const calloutWrapperRef    = ref(null)

const drawingCanvas = ref(null)
const textInput     = ref(null)
let ctx = null, baseImage = null

const isEditingText       = ref(false)
const editingText         = ref('')
const editingElementIndex = ref(null)
const textInputStyle      = ref({})

let lastClickTime = 0
const DOUBLE_CLICK_THRESHOLD = 300

let isDrawing = false
let startX = 0, startY = 0
let currentElement = null

let calloutDragging   = false
let calloutOrigin     = null
let calloutCurrentTip = null

let isTransforming = false, transformMode = null
let transformStartX = 0, transformStartY = 0, originalElementState = null

const history             = ref([])
const currentHistoryIndex = ref(-1)
const MAX_HISTORY         = 50

const drawTools = [
  { id: 'pen',        name: 'Dibujo Libre', icon: '✏️' },
  { id: 'line',       name: 'Línea',        icon: '📏' },
  { id: 'rectangle',  name: 'Rectángulo',   icon: '⬜' },
  { id: 'circle',     name: 'Círculo',      icon: '⭕' },
  { id: 'arrow',      name: 'Flecha',       icon: '➡️' },
  { id: 'text',       name: 'Texto',        icon: '🔤' },
  { id: 'eyedropper', name: 'Gotero',       icon: '👁️' }
]

const calloutTools = [
  { id: 'callout_acometida_dc',    name: 'Acometida DC',        color: '#f97316' }, // Naranja
  { id: 'callout_acometida_ac',    name: 'Acometida AC',        color: '#dc2626' }, // Rojo
  { id: 'callout_caja_paso',       name: 'Caja de paso',        color: '#1d4ed8' }, // Azul
  { id: 'callout_inversor',        name: 'Inversor',            color: '#65a30d' }, // Verde oliva
  { id: 'callout_tablero_fv',      name: 'Tablero FV',          color: '#0ea5e9' }, // Azul capri
  { id: 'callout_inyeccion',       name: 'Punto de inyección',  color: '#0ea5e9' }, // Azul capri
  { id: 'callout_paneles_techo',   name: 'Paneles en techo',    color: '#d97706' }, // Amarillo ámbar
  { id: 'callout_paneles_placa',   name: 'Paneles en placa',    color: '#d97706' }, // Amarillo ámbar
  { id: 'callout_paneles_suelo',   name: 'Paneles en suelo',    color: '#d97706' }, // Amarillo ámbar
  { id: 'callout_transformador',   name: 'Transformador',       color: '#64748b' }  // Gris
]

const colorPresets = ['#1e3a8a','#0369a1','#1e40af','#111827','#475569','#64748b','#e11d48','#ea580c','#d97706','#16a34a']
const fontFamilies = ['Arial','Verdana','Georgia','Courier New','Comic Sans MS','Times New Roman']

const isCalloutTool   = (id) => calloutTools.some(c => c.id === id)
const getCalloutLabel = (toolId) => { const ct = calloutTools.find(c => c.id === toolId); return ct ? ct.name : '' }

const drawCalloutShape = (ctx, x, y, label, color, lineWidth, tipX, tipY, elFontSize, elFontFamily) => {
  const fSize   = elFontSize   || fontSize.value
  const fFamily = elFontFamily || fontFamily.value
  const padding = 10
  const radius  = 6
  const tailW   = 12

  ctx.font = `bold ${fSize}px ${fFamily}`
  const textW = Math.max(ctx.measureText(label).width, 60)
  const boxW  = textW + padding * 2
  const boxH  = fSize + padding * 2
  const cx = x + boxW / 2
  const cy = y + boxH / 2
  const normAngle = Math.abs(Math.atan2((tipY - cy) / boxH, (tipX - cx) / boxW))

  let anchorX, anchorY, side
  if (normAngle < Math.PI / 4) {
    side = 'right'; anchorX = x + boxW
    anchorY = Math.max(y + radius + tailW, Math.min(y + boxH - radius - tailW, tipY))
  } else if (normAngle > 3 * Math.PI / 4) {
    side = 'left'; anchorX = x
    anchorY = Math.max(y + radius + tailW, Math.min(y + boxH - radius - tailW, tipY))
  } else if (tipY > cy) {
    side = 'bottom'
    anchorX = Math.max(x + radius + tailW, Math.min(x + boxW - radius - tailW, tipX))
    anchorY = y + boxH
  } else {
    side = 'top'
    anchorX = Math.max(x + radius + tailW, Math.min(x + boxW - radius - tailW, tipX))
    anchorY = y
  }

  ctx.beginPath()
  if (side === 'bottom') {
    ctx.moveTo(x + radius, y); ctx.lineTo(x + boxW - radius, y)
    ctx.quadraticCurveTo(x + boxW, y, x + boxW, y + radius)
    ctx.lineTo(x + boxW, y + boxH - radius)
    ctx.quadraticCurveTo(x + boxW, y + boxH, x + boxW - radius, y + boxH)
    ctx.lineTo(anchorX + tailW, anchorY); ctx.lineTo(tipX, tipY); ctx.lineTo(anchorX - tailW, anchorY)
    ctx.lineTo(x + radius, y + boxH)
    ctx.quadraticCurveTo(x, y + boxH, x, y + boxH - radius)
    ctx.lineTo(x, y + radius); ctx.quadraticCurveTo(x, y, x + radius, y)
  } else if (side === 'top') {
    ctx.moveTo(anchorX - tailW, y); ctx.lineTo(tipX, tipY); ctx.lineTo(anchorX + tailW, y)
    ctx.lineTo(x + boxW - radius, y); ctx.quadraticCurveTo(x + boxW, y, x + boxW, y + radius)
    ctx.lineTo(x + boxW, y + boxH - radius)
    ctx.quadraticCurveTo(x + boxW, y + boxH, x + boxW - radius, y + boxH)
    ctx.lineTo(x + radius, y + boxH)
    ctx.quadraticCurveTo(x, y + boxH, x, y + boxH - radius)
    ctx.lineTo(x, y + radius); ctx.quadraticCurveTo(x, y, anchorX - tailW, y)
  } else if (side === 'right') {
    ctx.moveTo(x + radius, y); ctx.lineTo(x + boxW - radius, y)
    ctx.quadraticCurveTo(x + boxW, y, x + boxW, y + radius)
    ctx.lineTo(anchorX, anchorY - tailW); ctx.lineTo(tipX, tipY); ctx.lineTo(anchorX, anchorY + tailW)
    ctx.lineTo(x + boxW, y + boxH - radius)
    ctx.quadraticCurveTo(x + boxW, y + boxH, x + boxW - radius, y + boxH)
    ctx.lineTo(x + radius, y + boxH)
    ctx.quadraticCurveTo(x, y + boxH, x, y + boxH - radius)
    ctx.lineTo(x, y + radius); ctx.quadraticCurveTo(x, y, x + radius, y)
  } else {
    ctx.moveTo(x + radius, y); ctx.lineTo(x + boxW - radius, y)
    ctx.quadraticCurveTo(x + boxW, y, x + boxW, y + radius)
    ctx.lineTo(x + boxW, y + boxH - radius)
    ctx.quadraticCurveTo(x + boxW, y + boxH, x + boxW - radius, y + boxH)
    ctx.lineTo(x + radius, y + boxH)
    ctx.quadraticCurveTo(x, y + boxH, x, y + boxH - radius)
    ctx.lineTo(anchorX, anchorY + tailW); ctx.lineTo(tipX, tipY); ctx.lineTo(anchorX, anchorY - tailW)
    ctx.lineTo(x, y + radius); ctx.quadraticCurveTo(x, y, x + radius, y)
  }

  ctx.closePath()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.fill()
  ctx.strokeStyle = color; ctx.lineWidth = lineWidth; ctx.stroke()
  ctx.fillStyle = color
  ctx.font = `bold ${fSize}px ${fFamily}`
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
  ctx.fillText(label, x + padding, y + boxH / 2)
}

const calcBoxOrigin = (tipX, tipY, label, elFontSize, elFontFamily) => {
  const fSize = elFontSize || fontSize.value
  const fFamily = elFontFamily || fontFamily.value
  const padding = 10
  if (ctx) ctx.font = `bold ${fSize}px ${fFamily}`
  const textW = ctx ? Math.max(ctx.measureText(label).width, 60) : 120
  const boxW = textW + padding * 2
  const boxH = fSize + padding * 2
  return { x: tipX - boxW / 2, y: tipY - boxH - 18 }
}

const uploadToImgBB = async (base64) => {
  const formData = new FormData()
  formData.append('image', base64)
  uploadProgress.value = 10
  const progressInterval = setInterval(() => {
    if (uploadProgress.value < 85) uploadProgress.value += Math.floor(Math.random() * 15) + 5
  }, 300)
  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: formData })
    clearInterval(progressInterval); uploadProgress.value = 95
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
    const result = await response.json()
    if (!result.success) throw new Error(result.error?.message || 'Error desconocido en ImgBB')
    uploadProgress.value = 100
    return { url: result.data.url, thumb: result.data.thumb?.url || result.data.url, deleteUrl: result.data.delete_url }
  } catch (err) { clearInterval(progressInterval); throw err }
}

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  isSharedLink.value = urlParams.has('data')

  if (isSharedLink.value) {
    try {
      const data = JSON.parse(decodeURIComponent(urlParams.get('data')))
      if (data.images && Array.isArray(data.images)) savedImages.value = data.images
      else {
        const quoteId = data.quoteId || cotizacionStore._quoteId
        const raw = localStorage.getItem(`images_${quoteId}`)
        savedImages.value = raw ? JSON.parse(raw) : []
      }
    } catch (e) { savedImages.value = [] }
  } else {
    const saved = localStorage.getItem('savedTechnicalImages')
    if (saved) { try { savedImages.value = JSON.parse(saved) } catch (e) { savedImages.value = [] } }
    cotizacionStore.currentImages = [...savedImages.value]
  }

  // ── Escuchar cuando el Registro carga una cotización con fotos ────────────
  const onFotosActualizadas = (e) => {
    if (isSharedLink.value) return
    const fotos = e.detail
    if (Array.isArray(fotos)) {
      savedImages.value = fotos
      cotizacionStore.currentImages = [...fotos]
    }
  }
  window.addEventListener('registro-fotos-actualizadas', onFotosActualizadas)
  onUnmounted(() => window.removeEventListener('registro-fotos-actualizadas', onFotosActualizadas))

  const handleKeyboard = (e) => {
    if (!imageLoaded.value) return
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undoAction() }
    if (e.key === 'Delete' && selectedElementIndex.value !== null && selectedTool.value === 'select') { e.preventDefault(); deleteSelectedElement() }
    if (e.key === 'Escape') showCalloutMenu.value = false
  }
  window.addEventListener('keydown', handleKeyboard)

  const closeMenu = (e) => {
    if (calloutWrapperRef.value && !calloutWrapperRef.value.contains(e.target)) {
      showCalloutMenu.value = false
    }
  }
  window.addEventListener('click', closeMenu)

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyboard)
    window.removeEventListener('click', closeMenu)
  })
})

const saveToHistory = () => {
  if (currentHistoryIndex.value < history.value.length - 1)
    history.value = history.value.slice(0, currentHistoryIndex.value + 1)
  history.value.push(JSON.parse(JSON.stringify(drawnElements.value)))
  if (history.value.length > MAX_HISTORY) history.value.shift()
  else currentHistoryIndex.value++
}

const undoAction = () => {
  if (currentHistoryIndex.value > 0) {
    currentHistoryIndex.value--
    drawnElements.value = JSON.parse(JSON.stringify(history.value[currentHistoryIndex.value]))
    selectedElementIndex.value = null
    redrawCanvas()
  }
}

const selectTool = (toolId) => {
  selectedTool.value = toolId
  selectedElementIndex.value = null
  isTransforming = false; transformMode = null
  calloutDragging = false; calloutOrigin = null; calloutCurrentTip = null
  redrawCanvas()
  if (drawingCanvas.value) {
    drawingCanvas.value.style.cursor =
      toolId === 'select'   ? 'default'   :
      toolId === 'text'     ? 'text'      :
      isCalloutTool(toolId) ? 'crosshair' : 'crosshair'
  }
}

const toggleCalloutMenu = (e) => {
  e.stopPropagation()
  showCalloutMenu.value = !showCalloutMenu.value
}

const selectCallout = (id) => {
  selectTool(id)
  // Aplicar color predefinido de la etiqueta seleccionada
  const ct = calloutTools.find(c => c.id === id)
  if (ct) brushColor.value = ct.color
  showCalloutMenu.value = false
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  if (file.size > 10 * 1024 * 1024) { alert('La imagen es demasiado grande. Máximo 10MB.'); return }
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      imageLoaded.value = true; currentEditingIndex.value = null
      setTimeout(() => initializeCanvas(img), 100)
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
}

const initializeCanvas = (img) => {
  const canvas = drawingCanvas.value
  if (!canvas) return
  const maxW = 900, maxH = 650
  let w = img.width, h = img.height
  if (w > maxW || h > maxH) { const r = Math.min(maxW / w, maxH / h); w *= r; h *= r }
  canvas.width = w; canvas.height = h
  try { ctx = canvas.getContext('2d', { willReadFrequently: true }) } catch (e) { ctx = canvas.getContext('2d') }
  if (!ctx) return
  baseImage = img; drawnElements.value = []; selectedElementIndex.value = null
  history.value = []; currentHistoryIndex.value = -1
  redrawCanvas(); saveToHistory()
}

const getMousePos = (e) => {
  const rect = drawingCanvas.value.getBoundingClientRect()
  return {
    x: (e.clientX - rect.left) * (drawingCanvas.value.width  / rect.width),
    y: (e.clientY - rect.top)  * (drawingCanvas.value.height / rect.height)
  }
}

const getCalloutBoxDimensions = (element) => {
  if (!ctx) return { boxW: 120, boxH: element.fontSize + 20 }
  ctx.font = `bold ${element.fontSize}px ${element.fontFamily}`
  const textW = Math.max(ctx.measureText(element.label).width, 60)
  return { boxW: textW + 20, boxH: element.fontSize + 20 }
}

const getElementBounds = (element) => {
  if (!ctx) return { minX: 0, maxX: 0, minY: 0, maxY: 0, centerX: 0, centerY: 0 }
  let minX, maxX, minY, maxY

  if (element.type === 'callout') {
    const { boxW, boxH } = getCalloutBoxDimensions(element)
    const tipX = element.tipX ?? element.x + boxW / 2
    const tipY = element.tipY ?? element.y + boxH + 18
    minX = Math.min(element.x, tipX); maxX = Math.max(element.x + boxW, tipX)
    minY = Math.min(element.y, tipY); maxY = Math.max(element.y + boxH, tipY)
  } else if (element.type === 'text') {
    ctx.font = `${element.fontSize}px ${element.fontFamily}`
    const w = ctx.measureText(element.content).width; const h = element.fontSize * 1.2
    minX = element.x; maxX = element.x + w; minY = element.y - h; maxY = element.y + 5
  } else if (element.type === 'pen') {
    const xs = element.points.map(p => p.x), ys = element.points.map(p => p.y)
    const pad = element.lineWidth * 2
    minX = Math.min(...xs) - pad; maxX = Math.max(...xs) + pad
    minY = Math.min(...ys) - pad; maxY = Math.max(...ys) + pad
  } else if (element.type === 'line' || element.type === 'arrow') {
    const pad = element.lineWidth * 3
    minX = Math.min(element.x1, element.x2) - pad; maxX = Math.max(element.x1, element.x2) + pad
    minY = Math.min(element.y1, element.y2) - pad; maxY = Math.max(element.y1, element.y2) + pad
  } else if (element.type === 'rectangle') {
    minX = Math.min(element.x, element.x + element.width);  maxX = Math.max(element.x, element.x + element.width)
    minY = Math.min(element.y, element.y + element.height); maxY = Math.max(element.y, element.y + element.height)
  } else if (element.type === 'circle') {
    minX = element.cx - element.radius; maxX = element.cx + element.radius
    minY = element.cy - element.radius; maxY = element.cy + element.radius
  } else { minX = maxX = minY = maxY = 0 }

  return { minX, maxX, minY, maxY, centerX: (minX + maxX) / 2, centerY: (minY + maxY) / 2 }
}

const isPointInElement   = (x, y, el)  => { const b = getElementBounds(el); return x >= b.minX && x <= b.maxX && y >= b.minY && y <= b.maxY }
const findElementAtPoint = (x, y)       => { for (let i = drawnElements.value.length - 1; i >= 0; i--) { if (isPointInElement(x, y, drawnElements.value[i])) return i } return null }
const isPointNearHandle  = (px, py, hx, hy, t = 15) => Math.sqrt((px - hx) ** 2 + (py - hy) ** 2) <= t
const getResizeHandle    = (x, y, b) => {
  if (isPointNearHandle(x, y, b.minX, b.minY)) return 'resize-tl'
  if (isPointNearHandle(x, y, b.maxX, b.minY)) return 'resize-tr'
  if (isPointNearHandle(x, y, b.minX, b.maxY)) return 'resize-bl'
  if (isPointNearHandle(x, y, b.maxX, b.maxY)) return 'resize-br'
  return null
}
const getRotateHandle = (x, y, b) => isPointNearHandle(x, y, b.centerX, b.minY - 30, 18) ? 'rotate' : null

const handleMouseDown = (e) => {
  if (!ctx) return
  const pos = getMousePos(e)
  const now = Date.now()
  const isDbl = (now - lastClickTime) < DOUBLE_CLICK_THRESHOLD
  lastClickTime = now

  if (isCalloutTool(selectedTool.value)) {
    calloutDragging = true
    calloutOrigin = { x: pos.x, y: pos.y }
    calloutCurrentTip = { x: pos.x, y: pos.y }
    return
  }

  if (selectedTool.value === 'select') {
    if (selectedElementIndex.value !== null) {
      const el = drawnElements.value[selectedElementIndex.value]
      const bounds = getElementBounds(el)
      const rh = getRotateHandle(pos.x, pos.y, bounds)
      if (rh) {
        isTransforming = true; transformMode = 'rotate'
        transformStartX = pos.x; transformStartY = pos.y
        originalElementState = JSON.parse(JSON.stringify(el)); return
      }
      const corners = [
        { name: 'resize-tl', x: bounds.minX, y: bounds.minY },
        { name: 'resize-tr', x: bounds.maxX, y: bounds.minY },
        { name: 'resize-bl', x: bounds.minX, y: bounds.maxY },
        { name: 'resize-br', x: bounds.maxX, y: bounds.maxY },
      ]
      for (const corner of corners) {
        if (Math.sqrt((pos.x - corner.x) ** 2 + (pos.y - corner.y) ** 2) <= 20) {
          isTransforming = true; transformMode = corner.name
          transformStartX = pos.x; transformStartY = pos.y
          originalElementState = JSON.parse(JSON.stringify(el)); return
        }
      }
      if (isPointInElement(pos.x, pos.y, el)) {
        isTransforming = true; transformMode = 'move'
        transformStartX = pos.x; transformStartY = pos.y
        originalElementState = JSON.parse(JSON.stringify(el)); return
      }
    }
    const idx = findElementAtPoint(pos.x, pos.y)
    if (idx !== null && isDbl && drawnElements.value[idx].type === 'text') { startTextEditForElement(idx); return }
    selectedElementIndex.value = idx; redrawCanvas(); return
  }

  if (selectedTool.value === 'text')       { startTextEdit(pos.x, pos.y); return }
  if (selectedTool.value === 'eyedropper') { pickColor(pos.x, pos.y);     return }

  isDrawing = true; startX = pos.x; startY = pos.y
  if (selectedTool.value === 'pen')
    currentElement = { type: 'pen', points: [{ x: pos.x, y: pos.y }], color: brushColor.value, lineWidth: brushSize.value, rotation: 0 }
}

const handleMouseMove = (e) => {
  if (!ctx) return
  const pos = getMousePos(e)

  if (calloutDragging && isCalloutTool(selectedTool.value)) {
    calloutCurrentTip = { x: pos.x, y: pos.y }
    redrawCanvas()
    const label  = getCalloutLabel(selectedTool.value)
    const boxPos = calcBoxOrigin(calloutOrigin.x, calloutOrigin.y, label, fontSize.value, fontFamily.value)
    drawCalloutShape(ctx, boxPos.x, boxPos.y, label, brushColor.value, Math.max(2, brushSize.value), pos.x, pos.y, fontSize.value, fontFamily.value)
    return
  }

  if (selectedTool.value === 'select' && !isTransforming && selectedElementIndex.value !== null) {
    const el = drawnElements.value[selectedElementIndex.value]
    const bounds = getElementBounds(el)
    const rh = getRotateHandle(pos.x, pos.y, bounds)
    const sh = getResizeHandle(pos.x, pos.y, bounds)
    if (rh) drawingCanvas.value.style.cursor = 'grab'
    else if (sh === 'resize-tl' || sh === 'resize-br') drawingCanvas.value.style.cursor = 'nwse-resize'
    else if (sh === 'resize-tr' || sh === 'resize-bl') drawingCanvas.value.style.cursor = 'nesw-resize'
    else if (isPointInElement(pos.x, pos.y, el))       drawingCanvas.value.style.cursor = 'move'
    else drawingCanvas.value.style.cursor = 'default'
  }

  if (selectedTool.value === 'select' && isTransforming && selectedElementIndex.value !== null) {
    const el = drawnElements.value[selectedElementIndex.value]
    const dx = pos.x - transformStartX, dy = pos.y - transformStartY
    if (transformMode === 'move')                  moveElement(el, dx, dy)
    else if (transformMode === 'rotate')           rotateElement(el, pos.x, pos.y)
    else if (transformMode?.startsWith('resize-')) resizeElement(el, transformMode, dx, dy)
    redrawCanvas(); return
  }

  if (!isDrawing) return
  if (selectedTool.value === 'pen') {
    currentElement.points.push({ x: pos.x, y: pos.y })
    redrawCanvas(); drawElement(currentElement)
  } else {
    redrawCanvas(); drawPreview(startX, startY, pos.x, pos.y)
  }
}

const handleMouseUp = (e) => {
  if (!ctx) return

  // BOCADILLO: push directo — múltiples instancias del mismo tipo permitidas
  if (calloutDragging && isCalloutTool(selectedTool.value)) {
    calloutDragging = false
    let pos
    try { pos = getMousePos(e) } catch { pos = calloutCurrentTip || calloutOrigin }

    const label  = getCalloutLabel(selectedTool.value)
    const tipX   = pos.x, tipY = pos.y
    const boxPos = calcBoxOrigin(calloutOrigin.x, calloutOrigin.y, label, fontSize.value, fontFamily.value)

    drawnElements.value.push({
      type: 'callout', calloutId: selectedTool.value,
      x: boxPos.x, y: boxPos.y, tipX, tipY, label,
      color: brushColor.value, lineWidth: Math.max(2, brushSize.value),
      fontSize: fontSize.value, fontFamily: fontFamily.value, rotation: 0
    })

    calloutOrigin = null; calloutCurrentTip = null
    redrawCanvas(); saveToHistory(); return
  }

  if (selectedTool.value === 'select' && isTransforming) {
    isTransforming = false; transformMode = null; originalElementState = null
    saveToHistory(); return
  }

  if (!isDrawing) return
  let pos
  try { pos = getMousePos(e) } catch { pos = { x: startX, y: startY } }

  if (selectedTool.value === 'pen' && currentElement) {
    drawnElements.value.push(currentElement); currentElement = null
  } else if (selectedTool.value === 'line') {
    drawnElements.value.push({ type: 'line', x1: startX, y1: startY, x2: pos.x, y2: pos.y, color: brushColor.value, lineWidth: brushSize.value, rotation: 0 })
  } else if (selectedTool.value === 'rectangle') {
    drawnElements.value.push({ type: 'rectangle', x: startX, y: startY, width: pos.x - startX, height: pos.y - startY, color: brushColor.value, lineWidth: brushSize.value, rotation: 0 })
  } else if (selectedTool.value === 'circle') {
    drawnElements.value.push({ type: 'circle', cx: startX, cy: startY, radius: Math.sqrt((pos.x - startX) ** 2 + (pos.y - startY) ** 2), color: brushColor.value, lineWidth: brushSize.value, rotation: 0 })
  } else if (selectedTool.value === 'arrow') {
    drawnElements.value.push({ type: 'arrow', x1: startX, y1: startY, x2: pos.x, y2: pos.y, color: brushColor.value, lineWidth: brushSize.value, rotation: 0 })
  }

  isDrawing = false; redrawCanvas(); saveToHistory()
}

const handleTouchStart = (e) => { e.preventDefault(); handleMouseDown({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY }) }
const handleTouchMove  = (e) => { e.preventDefault(); handleMouseMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY }) }
const handleTouchEnd   = (e) => { e.preventDefault(); const t = e.changedTouches[0]; handleMouseUp({ clientX: t.clientX, clientY: t.clientY }) }

const drawPreview = (x1, y1, x2, y2) => {
  ctx.strokeStyle = brushColor.value; ctx.fillStyle = brushColor.value
  ctx.lineWidth = brushSize.value; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
  if (selectedTool.value === 'line') {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke()
  } else if (selectedTool.value === 'rectangle') {
    ctx.beginPath(); ctx.strokeRect(x1, y1, x2 - x1, y2 - y1)
  } else if (selectedTool.value === 'circle') {
    ctx.beginPath(); ctx.arc(x1, y1, Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2), 0, 2 * Math.PI); ctx.stroke()
  } else if (selectedTool.value === 'arrow') {
    const hl = 15 + brushSize.value * 2, ang = Math.atan2(y2 - y1, x2 - x1)
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2)
    ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6))
    ctx.moveTo(x2, y2)
    ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6))
    ctx.stroke()
  }
}

const drawElement = (element) => {
  if (!element) return
  const bounds = getElementBounds(element)
  const rot = element.rotation || 0
  if (rot !== 0) { ctx.save(); ctx.translate(bounds.centerX, bounds.centerY); ctx.rotate(rot * Math.PI / 180); ctx.translate(-bounds.centerX, -bounds.centerY) }

  ctx.strokeStyle = element.color; ctx.fillStyle = element.color
  ctx.lineWidth = element.lineWidth || 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round'

  if (element.type === 'callout') {
    const { boxW, boxH } = getCalloutBoxDimensions(element)
    const tipX = element.tipX ?? element.x + boxW / 2
    const tipY = element.tipY ?? element.y + boxH + 18
    drawCalloutShape(ctx, element.x, element.y, element.label, element.color, element.lineWidth, tipX, tipY, element.fontSize, element.fontFamily)
  } else if (element.type === 'text') {
    ctx.font = `${element.fontSize}px ${element.fontFamily}`; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'
    let y = element.y
    element.content.split('\n').forEach(line => { ctx.fillText(line, element.x, y); y += element.fontSize * 1.2 })
  } else if (element.type === 'pen') {
    if (element.points?.length > 0) {
      ctx.beginPath(); ctx.moveTo(element.points[0].x, element.points[0].y)
      element.points.forEach(p => ctx.lineTo(p.x, p.y)); ctx.stroke()
    }
  } else if (element.type === 'rectangle') {
    ctx.beginPath(); ctx.strokeRect(element.x, element.y, element.width, element.height)
  } else if (element.type === 'circle') {
    ctx.beginPath(); ctx.arc(element.cx, element.cy, element.radius, 0, 2 * Math.PI); ctx.stroke()
  } else if (element.type === 'line') {
    ctx.beginPath(); ctx.moveTo(element.x1, element.y1); ctx.lineTo(element.x2, element.y2); ctx.stroke()
  } else if (element.type === 'arrow') {
    const hl = 15 + element.lineWidth * 2, ang = Math.atan2(element.y2 - element.y1, element.x2 - element.x1)
    ctx.beginPath(); ctx.moveTo(element.x1, element.y1); ctx.lineTo(element.x2, element.y2)
    ctx.lineTo(element.x2 - hl * Math.cos(ang - Math.PI / 6), element.y2 - hl * Math.sin(ang - Math.PI / 6))
    ctx.moveTo(element.x2, element.y2)
    ctx.lineTo(element.x2 - hl * Math.cos(ang + Math.PI / 6), element.y2 - hl * Math.sin(ang + Math.PI / 6))
    ctx.stroke()
  }
  if (rot !== 0) ctx.restore()
}

const redrawCanvas = () => {
  if (!ctx || !baseImage) return
  ctx.clearRect(0, 0, drawingCanvas.value.width, drawingCanvas.value.height)
  const ca = drawingCanvas.value.width / drawingCanvas.value.height
  const ia = baseImage.width / baseImage.height
  let dw, dh, ox = 0, oy = 0
  if (ca > ia) { dh = drawingCanvas.value.height; dw = dh * ia; ox = (drawingCanvas.value.width - dw) / 2 }
  else         { dw = drawingCanvas.value.width;  dh = dw / ia; oy = (drawingCanvas.value.height - dh) / 2 }
  ctx.drawImage(baseImage, ox, oy, dw, dh)
  drawnElements.value.forEach((el, i) => {
    drawElement(el)
    if (selectedTool.value === 'select' && i === selectedElementIndex.value)
      drawSelectionControls(getElementBounds(el))
  })
}

const drawSelectionControls = (bounds) => {
  const hs = 10, rhs = 12, pad = 5
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2; ctx.setLineDash([5, 5])
  ctx.strokeRect(bounds.minX - pad, bounds.minY - pad, bounds.maxX - bounds.minX + pad * 2, bounds.maxY - bounds.minY + pad * 2)
  ctx.setLineDash([])
  ctx.fillStyle = '#3b82f6'; ctx.strokeStyle = 'white'; ctx.lineWidth = 2
  ;[{ x: bounds.minX, y: bounds.minY }, { x: bounds.maxX, y: bounds.minY },
    { x: bounds.minX, y: bounds.maxY }, { x: bounds.maxX, y: bounds.maxY }]
    .forEach(h => { ctx.fillRect(h.x - hs / 2, h.y - hs / 2, hs, hs); ctx.strokeRect(h.x - hs / 2, h.y - hs / 2, hs, hs) })
  const rx = bounds.centerX, ry = bounds.minY - 30
  ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 1; ctx.setLineDash([2, 2])
  ctx.beginPath(); ctx.moveTo(bounds.centerX, bounds.minY); ctx.lineTo(rx, ry); ctx.stroke(); ctx.setLineDash([])
  ctx.fillStyle = '#10b981'; ctx.strokeStyle = 'white'; ctx.lineWidth = 2
  ctx.beginPath(); ctx.arc(rx, ry, rhs, 0, 2 * Math.PI); ctx.fill(); ctx.stroke()
  ctx.restore()
}

const moveElement = (el, dx, dy) => {
  if (!originalElementState) return
  if (el.type === 'callout') {
    el.x = originalElementState.x + dx; el.y = originalElementState.y + dy
    el.tipX = (originalElementState.tipX ?? originalElementState.x) + dx
    el.tipY = (originalElementState.tipY ?? originalElementState.y) + dy
  } else if (el.type === 'text') {
    el.x = originalElementState.x + dx; el.y = originalElementState.y + dy
  } else if (el.type === 'pen') {
    el.points = originalElementState.points.map(p => ({ x: p.x + dx, y: p.y + dy }))
  } else if (el.type === 'line' || el.type === 'arrow') {
    el.x1 = originalElementState.x1 + dx; el.y1 = originalElementState.y1 + dy
    el.x2 = originalElementState.x2 + dx; el.y2 = originalElementState.y2 + dy
  } else if (el.type === 'rectangle') {
    el.x = originalElementState.x + dx; el.y = originalElementState.y + dy
  } else if (el.type === 'circle') {
    el.cx = originalElementState.cx + dx; el.cy = originalElementState.cy + dy
  }
}

const rotateElement = (el, mx, my) => {
  if (!originalElementState) return
  const b = getElementBounds(originalElementState)
  const ia = Math.atan2(transformStartY - b.centerY, transformStartX - b.centerX)
  const ca = Math.atan2(my - b.centerY, mx - b.centerX)
  el.rotation = (originalElementState.rotation || 0) + (ca - ia) * (180 / Math.PI)
  while (el.rotation > 180) el.rotation -= 360
  while (el.rotation < -180) el.rotation += 360
}

const resizeElement = (el, handle, dx, dy) => {
  if (!originalElementState) return
  if (el.type === 'callout') {
    let delta = 0
    if      (handle === 'resize-br') delta =  (dx + dy) / 2
    else if (handle === 'resize-tl') delta = -(dx + dy) / 2
    else if (handle === 'resize-tr') delta =  (dx - dy) / 2
    else if (handle === 'resize-bl') delta = (-dx + dy) / 2
    el.fontSize = Math.max(8, Math.min(96, Math.round(originalElementState.fontSize + delta / 3)))
  } else if (el.type === 'rectangle') {
    if (handle === 'resize-tl') { el.x = originalElementState.x + dx; el.y = originalElementState.y + dy; el.width = originalElementState.width - dx; el.height = originalElementState.height - dy }
    else if (handle === 'resize-tr') { el.y = originalElementState.y + dy; el.width = originalElementState.width + dx; el.height = originalElementState.height - dy }
    else if (handle === 'resize-bl') { el.x = originalElementState.x + dx; el.width = originalElementState.width - dx; el.height = originalElementState.height + dy }
    else if (handle === 'resize-br') { el.width = originalElementState.width + dx; el.height = originalElementState.height + dy }
  } else if (el.type === 'circle') {
    el.radius = Math.max(10, originalElementState.radius + Math.sqrt(dx * dx + dy * dy) * (dx + dy > 0 ? 1 : -1) * 0.5)
  } else if (el.type === 'line' || el.type === 'arrow') {
    if (handle === 'resize-tl' || handle === 'resize-bl') { el.x1 = originalElementState.x1 + dx; el.y1 = originalElementState.y1 + dy }
    else { el.x2 = originalElementState.x2 + dx; el.y2 = originalElementState.y2 + dy }
  } else if (el.type === 'text') {
    el.fontSize = Math.max(8, Math.min(120, originalElementState.fontSize * Math.max(0.3, 1 + (dx + dy) / 200)))
  }
}

const deleteSelectedElement = () => {
  if (selectedElementIndex.value !== null) {
    drawnElements.value.splice(selectedElementIndex.value, 1)
    selectedElementIndex.value = null; redrawCanvas(); saveToHistory()
  }
}

const clearCanvas = () => {
  if (confirm('¿Limpiar todos los dibujos? La imagen original se mantendrá.')) {
    drawnElements.value = []; selectedElementIndex.value = null; redrawCanvas(); saveToHistory()
  }
}

const saveImage = async () => {
  try {
    isUploading.value = true; uploadProgress.value = 0
    const tmp = selectedElementIndex.value; selectedElementIndex.value = null; redrawCanvas()
    const dataURL = drawingCanvas.value.toDataURL('image/jpeg', 0.85)
    selectedElementIndex.value = tmp; if (tmp !== null) redrawCanvas()
    const b64 = dataURL.split(',')[1]
    const uploaded = await uploadToImgBB(b64)
    const imageData = {
      data: uploaded.url, thumb: uploaded.thumb, deleteUrl: uploaded.deleteUrl,
      size: b64.length, timestamp: Date.now(),
      elements: JSON.parse(JSON.stringify(drawnElements.value))
    }
    if (currentEditingIndex.value !== null) savedImages.value[currentEditingIndex.value] = imageData
    else savedImages.value.push(imageData)
    localStorage.setItem('savedTechnicalImages', JSON.stringify(savedImages.value))
    cotizacionStore.currentImages = [...savedImages.value]
    resetEditor(); alert('✅ Imagen guardada y subida a la nube exitosamente')
  } catch (e) { console.error(e); alert('❌ Error al subir la imagen.') }
  finally { isUploading.value = false; uploadProgress.value = 0 }
}

const downloadImage = (url, index) => {
  const a = document.createElement('a'); a.href = url
  a.download = `visita-tecnica-${index + 1}-${Date.now()}.jpg`
  a.target = '_blank'; a.click()
}

const editSavedImage = (index) => {
  const img = new Image(); img.crossOrigin = 'anonymous'
  img.onload = () => {
    imageLoaded.value = true; currentEditingIndex.value = index
    drawnElements.value = savedImages.value[index].elements
      ? JSON.parse(JSON.stringify(savedImages.value[index].elements)) : []
    setTimeout(() => initializeCanvas(img), 100)
  }
  img.onerror = () => alert('No se puede editar esta imagen (CORS). Descárgala y vuélvela a subir.')
  img.src = savedImages.value[index].data
}

const deleteSavedImage = (index) => {
  if (confirm('¿Eliminar esta imagen?')) {
    savedImages.value.splice(index, 1)
    localStorage.setItem('savedTechnicalImages', JSON.stringify(savedImages.value))
  }
}

const formatFileSize = (bytes) => {
  if (bytes < 1024)        return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const resetEditor = () => {
  imageLoaded.value = false; selectedTool.value = 'select'
  brushSize.value = 3; brushColor.value = '#e11d48'
  fontSize.value = 18; fontFamily.value = 'Arial'
  drawnElements.value = []; selectedElementIndex.value = null
  currentEditingIndex.value = null; history.value = []; currentHistoryIndex.value = -1
  ctx = null; baseImage = null; isDrawing = false
  isTransforming = false; transformMode = null
  currentElement = null; originalElementState = null
  showCalloutMenu.value = false
  calloutDragging = false; calloutOrigin = null; calloutCurrentTip = null
}

const startTextEdit = (x, y) => {
  isEditingText.value = true; editingText.value = ''; editingElementIndex.value = null
  const r = drawingCanvas.value.getBoundingClientRect()
  const sx = r.width / drawingCanvas.value.width, sy = r.height / drawingCanvas.value.height
  textInputStyle.value = {
    position: 'absolute', left: `${r.left + x * sx}px`, top: `${r.top + y * sy}px`,
    fontSize: `${fontSize.value * sy}px`, fontFamily: fontFamily.value,
    color: brushColor.value, background: 'transparent', border: 'none', padding: '0'
  }
  setTimeout(() => { if (textInput.value) textInput.value.focus() }, 10)
}

const handleEnterKey = () => finishTextEdit()
const handleShiftEnter = () => {
  const ta = textInput.value
  if (ta) {
    const s = ta.selectionStart, end = ta.selectionEnd
    editingText.value = editingText.value.substring(0, s) + '\n' + editingText.value.substring(end)
    setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + 1 }, 0)
  }
}

const finishTextEdit = () => {
  if (editingText.value.trim()) {
    if (editingElementIndex.value !== null) {
      drawnElements.value[editingElementIndex.value].content = editingText.value
    } else {
      const r = drawingCanvas.value.getBoundingClientRect()
      const sx = drawingCanvas.value.width / r.width, sy = drawingCanvas.value.height / r.height
      const tx = (parseFloat(textInputStyle.value.left) - r.left) / sx
      const ty = (parseFloat(textInputStyle.value.top)  - r.top)  / sy + fontSize.value
      drawnElements.value.push({
        type: 'text', x: tx, y: ty, content: editingText.value,
        fontSize: fontSize.value, fontFamily: fontFamily.value, color: brushColor.value, rotation: 0
      })
    }
    redrawCanvas(); saveToHistory()
  }
  isEditingText.value = false; editingText.value = ''; editingElementIndex.value = null
}

const cancelTextEdit = () => {
  isEditingText.value = false; editingText.value = ''; editingElementIndex.value = null
}

const startTextEditForElement = (idx) => {
  const el = drawnElements.value[idx]
  if (!el || el.type !== 'text') return
  isEditingText.value = true; editingText.value = el.content; editingElementIndex.value = idx
  const r = drawingCanvas.value.getBoundingClientRect()
  const sx = r.width / drawingCanvas.value.width, sy = r.height / drawingCanvas.value.height
  textInputStyle.value = {
    position: 'absolute',
    left: `${r.left + el.x * sx}px`,
    top:  `${r.top + (el.y - el.fontSize) * sy}px`,
    fontSize: `${el.fontSize * sy}px`, fontFamily: el.fontFamily, color: el.color,
    background: 'rgba(255,255,255,0.9)', border: '2px solid #3b82f6',
    borderRadius: '4px', padding: '4px', minWidth: '100px', outline: 'none', zIndex: 1000
  }
  setTimeout(() => { if (textInput.value) { textInput.value.focus(); textInput.value.select() } }, 10)
}

const pickColor = (x, y) => {
  if (!ctx) return
  const [r, g, b] = ctx.getImageData(x, y, 1, 1).data
  brushColor.value = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

const changeElementColor = (color) => {
  if (selectedElementIndex.value !== null) {
    drawnElements.value[selectedElementIndex.value].color = color
    redrawCanvas(); saveToHistory()
  } else { brushColor.value = color }
}

const onColorPickerInput = (e) => {
  const color = e.target.value
  brushColor.value = color
  if (selectedElementIndex.value !== null) {
    drawnElements.value[selectedElementIndex.value].color = color
    redrawCanvas()
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.panel1 {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px; padding: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 10px 40px rgba(0,0,0,0.08);
  min-height: 500px; height: 100%; display: flex; flex-direction: column;
  grid-column: span 2; font-family: 'Inter', sans-serif;
}
.panel-content { height: 100%; display: flex; flex-direction: column; }

/* ── Upload section ── */
.upload-section { flex:1; display:flex; align-items:center; justify-content:center; padding:40px 30px; overflow-y:auto; }
.upload-container { text-align:center; max-width:700px; width:100%; }
.upload-icon-box { margin-bottom:32px; display:flex; justify-content:center; }
.upload-title { font-size:32px; font-weight:700; color:#0f172a; margin-bottom:12px; }
.upload-subtitle { font-size:15px; color:#475569; margin-bottom:40px; }
.upload-button { display:inline-flex; padding:14px 44px; background:linear-gradient(135deg,#1e3a8a,#1e40af); color:white; font-size:15px; font-weight:600; border:none; border-radius:10px; cursor:pointer; box-shadow:0 8px 24px rgba(30,58,138,.25); margin-bottom:20px; transition:transform .2s; }
.upload-button:hover { transform:translateY(-2px); }
.upload-hint { font-size:12px; color:#64748b; margin-bottom:24px; }
.uploading-indicator { display:flex; align-items:center; gap:12px; justify-content:center; padding:12px 24px; background:linear-gradient(135deg,#eff6ff,#f0fdf4); border:1px solid rgba(37,99,235,.2); border-radius:12px; margin-bottom:24px; font-size:14px; font-weight:600; color:#1e40af; }
.upload-spinner { width:20px; height:20px; border:3px solid rgba(37,99,235,.2); border-top-color:#1e40af; border-radius:50%; animation:spin .8s linear infinite; flex-shrink:0; }
.upload-spinner.large { width:40px; height:40px; border-width:4px; border-color:rgba(16,185,129,.2); border-top-color:#10b981; }
@keyframes spin { to { transform:rotate(360deg); } }
.upload-overlay { position:absolute; inset:0; background:rgba(0,0,0,.55); display:flex; align-items:center; justify-content:center; border-radius:12px; z-index:100; backdrop-filter:blur(4px); }
.upload-overlay-content { text-align:center; color:white; display:flex; flex-direction:column; align-items:center; gap:16px; }
.upload-overlay-content p { font-size:16px; font-weight:600; margin:0; }
.progress-bar { width:200px; height:8px; background:rgba(255,255,255,.2); border-radius:4px; overflow:hidden; }
.progress-fill { height:100%; background:linear-gradient(90deg,#10b981,#3b82f6); border-radius:4px; transition:width .3s ease; }
.saved-images-section { margin-top:50px; padding-top:40px; border-top:2px solid rgba(30,58,138,.1); }
.saved-title { font-size:20px; font-weight:700; color:#0f172a; margin-bottom:24px; text-align:left; }
.images-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:20px; }
.saved-image-card { background:white; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,.08); transition:all .3s ease; }
.saved-image-card:hover { transform:translateY(-4px); box-shadow:0 8px 20px rgba(0,0,0,.12); }
.saved-thumbnail { width:100%; height:160px; object-fit:cover; }
.image-info { padding:12px; display:flex; justify-content:space-between; align-items:center; }
.image-size { font-size:11px; color:#64748b; font-weight:600; }
.image-actions { display:flex; gap:6px; }
.edit-btn,.download-btn,.delete-btn { padding:6px; border:none; border-radius:6px; cursor:pointer; font-size:16px; transition:transform .2s; }
.edit-btn:hover,.download-btn:hover,.delete-btn:hover { transform:scale(1.1); }
.edit-btn { background:rgba(30,58,138,.1); }
.download-btn { background:rgba(5,150,105,.1); }
.delete-btn { background:rgba(220,38,38,.1); }
.no-images-msg { margin-top:32px; padding:24px; background:rgba(30,58,138,.04); border-radius:12px; color:#64748b; font-size:15px; font-weight:500; }

/* ── Editor ── */
.editor-section { flex:1; display:flex; flex-direction:column; overflow:hidden; }
.editor-header { padding:16px 28px; background:rgba(255,255,255,.95); border-bottom:1px solid rgba(0,0,0,.05); display:flex; align-items:center; justify-content:space-between; gap:20px; flex-wrap:wrap; }
.editor-title { display:flex; align-items:center; gap:14px; font-size:16px; font-weight:600; color:#0f172a; }
.back-button { padding:8px 12px; background:rgba(30,58,138,.08); border:none; border-radius:8px; cursor:pointer; color:#1e3a8a; font-size:18px; transition:background .2s; }
.back-button:hover { background:rgba(30,58,138,.15); }
.toolbar { display:flex; align-items:center; gap:0; flex-wrap:wrap; flex:1; justify-content:flex-end; }
.tool-group { display:flex; align-items:center; gap:12px; padding:0 16px; }
.toolbar-separator { width:1px; height:32px; background:rgba(0,0,0,.08); }
.tool-button { padding:8px; background:transparent; border:2px solid rgba(30,58,138,.15); border-radius:8px; cursor:pointer; font-size:18px; width:40px; height:40px; display:flex; align-items:center; justify-content:center; transition:all .2s; }
.tool-button:hover { background:rgba(30,58,138,.08); transform:scale(1.05); }
.tool-button.active { background:linear-gradient(135deg,#1e3a8a,#1e40af); color:white; border-color:#1e3a8a; transform:scale(1.1); }

/* ══════════════════════════════════════════════════════════════
   DROPDOWN VERTICAL CON SCROLL — mismo estilo del original
   pero con max-height + overflow-y: auto
══════════════════════════════════════════════════════════════ */
.callout-group   { position: relative; }
.callout-dropdown-wrapper { position: relative; }

.callout-btn {
  width: auto !important;
  padding: 6px 10px !important;
  gap: 4px;
  font-size: 16px !important;
}
.callout-arrow { font-size: 10px; opacity: .7; }

.callout-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;                     /* ancla a la derecha en móvil */
  left: auto;
  transform: none;
  background: white;
  border: 1.5px solid rgba(30,58,138,.15);
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,.18);
  padding: 0;
  z-index: 9999;
  min-width: 220px;
  width: 240px;
  display: flex;
  flex-direction: column;
  overflow: hidden;             /* respeta border-radius en hijos */
}

/* Cabecera fija del menú */
.callout-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px 8px;
  border-bottom: 1px solid rgba(30,58,138,.08);
  background: linear-gradient(135deg, #f0f4ff, #e8efff);
  flex-shrink: 0;
}
.callout-menu-title {
  font-size: 12px;
  font-weight: 700;
  color: #1e3a8a;
  letter-spacing: .3px;
}
.callout-menu-count {
  font-size: 11px;
  font-weight: 700;
  color: white;
  background: #1e40af;
  border-radius: 10px;
  padding: 1px 7px;
  line-height: 1.6;
}

/* Zona de scroll — altura suficiente para los 10 items */
.callout-menu-scroll {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 460px;           /* 10 items × 46px ≈ 460px, todos visibles sin scroll */
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(30,58,138,.2) transparent;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.callout-menu-scroll::-webkit-scrollbar { width: 4px; }
.callout-menu-scroll::-webkit-scrollbar-track { background: transparent; }
.callout-menu-scroll::-webkit-scrollbar-thumb { background: rgba(30,58,138,.2); border-radius: 4px; }
.callout-menu-scroll::-webkit-scrollbar-thumb:hover { background: rgba(30,58,138,.4); }

/* Ítem del menú — igual al original */
.callout-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #1e3a8a;
  text-align: left;
  transition: all .15s;
  white-space: nowrap;
  width: 100%;
  box-sizing: border-box;
  /* toque mínimo recomendado en móvil: 44px */
  min-height: 44px;
}
.callout-item:hover  { background: rgba(30,58,138,.07); transform: translateX(2px); }
.callout-item.active { background: linear-gradient(135deg,#1e3a8a,#1e40af); color: white; }
.callout-item.active .callout-preview { color: white; }

.callout-preview { display: flex; align-items: center; color: #1e3a8a; flex-shrink: 0; }
.callout-label   { flex: 1; }
.callout-check   { font-size: 14px; color: #10b981; font-weight: 700; margin-left: auto; }
.callout-item.active .callout-check { color: #86efac; }

/* Pie fijo del menú */
.callout-menu-footer {
  padding: 7px 14px 9px;
  border-top: 1px solid rgba(30,58,138,.08);
  background: #f8fafc;
  font-size: 10px;
  color: #94a3b8;
  text-align: center;
  flex-shrink: 0;
  font-style: italic;
}

/* ── Resto toolbar ── */
.size-label,.color-label,.font-label { font-size:12px; font-weight:600; color:#475569; white-space:nowrap; }
.size-slider { width:90px; height:5px; border-radius:3px; background:#e2e8f0; outline:none; cursor:pointer; }
.size-value  { font-size:11px; font-weight:600; color:#64748b; min-width:28px; }
.color-picker { border:2px solid #e2e8f0; border-radius:8px; cursor:pointer; }
.color-presets { display:flex; gap:6px; }
.color-preset  { width:28px; height:28px; border-radius:6px; border:2px solid #e2e8f0; cursor:pointer; transition:all .2s; }
.color-preset:hover { transform:scale(1.1); border-color:#475569; }

/* Badge de color predefinido del bocadillo activo */
.callout-color-badge {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 4px 10px 4px 6px;
  background: rgba(30,58,138,.06);
  border: 1.5px solid rgba(30,58,138,.15);
  border-radius: 20px;
  white-space: nowrap;
}
.callout-color-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 2px solid rgba(0,0,0,.12);
  box-shadow: 0 1px 3px rgba(0,0,0,.15);
}
.callout-color-name {
  font-size: 11px;
  font-weight: 700;
  color: #1e3a8a;
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.color-preset:hover { transform:scale(1.1); border-color:#475569; }
.font-select { padding:6px 10px; border:2px solid rgba(30,58,138,.15); border-radius:6px; font-size:12px; cursor:pointer; background:white; }
.action-button { padding:8px; background:transparent; border:2px solid rgba(30,58,138,.15); border-radius:8px; cursor:pointer; font-size:18px; width:40px; height:40px; display:flex; align-items:center; justify-content:center; transition:all .2s; }
.action-button:hover:not(:disabled) { background:rgba(30,58,138,.08); transform:translateY(-2px); }
.action-button:disabled { opacity:.4; cursor:not-allowed; }
.action-button.clear,.action-button.delete-element { color:#dc2626; border-color:rgba(220,38,38,.15); }
.action-button.clear:hover,.action-button.delete-element:hover { background:rgba(220,38,38,.08); }
.action-button.save { color:#059669; border-color:rgba(5,150,105,.15); }
.action-button.save:hover:not(:disabled) { background:rgba(5,150,105,.08); }

/* ── Canvas ── */
.canvas-wrapper { flex:1; display:flex; align-items:center; justify-content:center; padding:24px; background:linear-gradient(135deg,#f8fafc,#f1f5f9); overflow:auto; position:relative; }
.drawing-canvas { border-radius:12px; background:white; box-shadow:0 10px 40px rgba(0,0,0,.1); cursor:crosshair; max-width:100%; max-height:100%; touch-action:none; }
.editor-footer { padding:14px 28px; background:rgba(255,255,255,.9); border-top:1px solid rgba(0,0,0,.05); text-align:center; }
.tool-info { font-size:13px; color:#64748b; font-weight:500; }
.info-text strong { color:#1e3a8a; font-weight:600; }
.text-input { position:fixed; z-index:1000; min-width:60px; outline:none; resize:none; overflow:hidden; line-height:1.2; }

/* ── Responsivo móvil ── */
@media (max-width: 768px) {
  .editor-header { flex-direction:column; padding:12px; }
  .toolbar { width:100%; justify-content:center; }
  .tool-group { padding:0 8px; }
  .images-grid { grid-template-columns:repeat(auto-fill,minmax(120px,1fr)); }

  /* En móvil el dropdown se abre hacia abajo centrado */
  .callout-menu {
    right: 50%;
    transform: translateX(50%);
    width: 230px;
    max-height: 92vh;
  }
  .callout-menu-scroll {
    max-height: calc(92vh - 90px);
  }
}

/* Pantallas muy pequeñas (< 400px) */
@media (max-width: 400px) {
  .callout-menu {
    right: auto;
    left: 0;
    transform: none;
    width: calc(100vw - 24px);
  }
}
</style>