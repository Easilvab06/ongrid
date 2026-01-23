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
          
          <h2 class="upload-title">Visitas Técnicas - Editor</h2>
          <p class="upload-subtitle">Carga una fotografía y edítala con herramientas avanzadas</p>
          
          <label class="upload-button">
            <input type="file" accept="image/*" @change="handleImageUpload" hidden />
            <span class="button-text">Seleccionar Imagen</span>
          </label>
          
          <p class="upload-hint">JPG, PNG, GIF o WebP • Máximo 10MB</p>

          <div v-if="savedImages.length > 0" class="saved-images-section">
            <h3 class="saved-title">Imágenes Guardadas ({{ savedImages.length }})</h3>
            <div class="images-grid">
              <div v-for="(img, index) in savedImages" :key="index" class="saved-image-card">
                <img :src="img.data" :alt="`Imagen ${index + 1}`" class="saved-thumbnail" />
                <div class="image-info">
                  <span class="image-size">{{ formatFileSize(img.size) }}</span>
                  <div class="image-actions">
                    <button @click="editSavedImage(index)" class="edit-btn" title="Editar">📝</button>
                    <button @click="downloadImage(img.data, index)" class="download-btn" title="Descargar">⬇️</button>
                    <button @click="deleteSavedImage(index)" class="delete-btn" title="Eliminar">🗑️</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- EDITOR DE IMAGEN -->
      <div v-else class="editor-section">
        <div class="editor-header">
          <div class="editor-title">
            <button class="back-button" @click="resetEditor" title="Volver">◀</button>
            <span class="title-text">Editor de Imagen</span>
          </div>
          
          <div class="toolbar">
            <!-- HERRAMIENTA DE SELECCIÓN -->
            <div class="tool-group">
              <button 
                :class="['tool-button', { active: selectedTool === 'select' }]"
                @click="selectTool('select')"
                title="Seleccionar y Transformar">
                🎯
              </button>
            </div>

            <div class="toolbar-separator"></div>

            <!-- HERRAMIENTAS DE DIBUJO -->
            <div class="tool-group">
              <button v-for="tool in drawTools" :key="tool.id"
                :class="['tool-button', { active: selectedTool === tool.id }]"
                @click="selectTool(tool.id)"
                :title="tool.name">
                {{ tool.icon }}
              </button>
            </div>

            <div class="toolbar-separator"></div>

            <!-- CONTROLES DE GROSOR -->
            <div v-if="selectedTool !== 'text' && selectedTool !== 'select'" class="tool-group size-group">
              <label class="size-label">Grosor</label>
              <input v-model.number="brushSize" type="range" min="1" max="50" class="size-slider" />
              <span class="size-value">{{ brushSize }}</span>
            </div>

            <!-- CONTROLES DE TEXTO -->
            <div v-if="selectedTool === 'text'" class="tool-group size-group">
              <label class="size-label">Tamaño</label>
              <input v-model.number="fontSize" type="range" min="8" max="72" class="size-slider" />
              <span class="size-value">{{ fontSize }}</span>
            </div>

            <div v-if="selectedTool !== 'select'" class="toolbar-separator"></div>

            <!-- SELECTOR DE COLOR -->
            <div v-if="selectedTool !== 'select' || (selectedTool === 'select' && selectedElementIndex !== null)" class="tool-group color-group">
              <label class="color-label">Color</label>
              <input v-model="brushColor" type="color" class="color-picker" />
              <div class="color-presets">
                <button v-for="color in colorPresets" :key="color"
                  :style="{ backgroundColor: color }"
                  @click="changeElementColor(color)"
                  class="color-preset"></button>
              </div>
            </div>

            <div v-if="selectedTool === 'text'" class="toolbar-separator"></div>

            <!-- SELECTOR DE FUENTE -->
            <div v-if="selectedTool === 'text'" class="tool-group font-group">
              <label class="font-label">Fuente</label>
              <select v-model="fontFamily" class="font-select">
                <option v-for="font in fontFamilies" :key="font" :value="font">{{ font }}</option>
              </select>
            </div>

            <div class="toolbar-separator"></div>

            <!-- ACCIONES -->
            <div class="tool-group action-group">
              <button v-if="selectedTool === 'select' && selectedElementIndex !== null" 
                @click="deleteSelectedElement" 
                class="action-button delete-element" 
                title="Eliminar (Del)">🗑️</button>
              <button @click="undoAction" :disabled="currentHistoryIndex <= 0" class="action-button undo" title="Deshacer (Ctrl+Z)">↶</button>
              <button @click="clearCanvas" class="action-button clear" title="Limpiar">🧹</button>
              <button @click="saveImage" class="action-button save" title="Guardar">💾</button>
            </div>
          </div>
        </div>

        <!-- CANVAS DE DIBUJO -->
        <div class="canvas-wrapper">
          <canvas
            ref="drawingCanvas"
            @mousedown="handleMouseDown"
            @mousemove="handleMouseMove"
            @mouseup="handleMouseUp"
            @mouseleave="handleMouseUp"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
            class="drawing-canvas"></canvas>

          <!-- TEXT INPUT FOR INLINE EDITING -->
          <textarea
            v-if="isEditingText"
            ref="textInput"
            v-model="editingText"
            @blur="finishTextEdit"
            @keydown.enter.exact.prevent="handleEnterKey"
            @keydown.shift.enter.prevent="handleShiftEnter"
            @keydown.esc="cancelTextEdit"
            :style="textInputStyle"
            class="text-input"
            rows="1"
            wrap="soft"
          ></textarea>
        </div>

        <!-- FOOTER CON INFO -->
        <div class="editor-footer">
          <div class="tool-info">
            <span v-if="selectedTool === 'select'" class="info-text">
              🎯 Selección -
              <span v-if="selectedElementIndex !== null">
                <strong>Elemento seleccionado:</strong> Arrastra=mover | Esquinas=redimensionar | 🔄 Arriba=rotar | Delete=eliminar
              </span>
              <span v-else>
                Haz clic en un elemento para seleccionarlo
              </span>
            </span>
            <span v-else-if="selectedTool === 'pen'" class="info-text">✏️ Dibujo Libre - Dibuja libremente en el canvas</span>
            <span v-else-if="selectedTool === 'line'" class="info-text">📏 Línea Recta - Haz clic y arrastra</span>
            <span v-else-if="selectedTool === 'rectangle'" class="info-text">⬜ Rectángulo - Haz clic y arrastra</span>
            <span v-else-if="selectedTool === 'circle'" class="info-text">⭕ Círculo - Haz clic y arrastra</span>
            <span v-else-if="selectedTool === 'arrow'" class="info-text">➡️ Flecha - Haz clic y arrastra</span>
            <span v-else-if="selectedTool === 'text'" class="info-text">🔤 Texto - Haz clic para agregar/editar texto</span>
            <span v-else-if="selectedTool === 'eyedropper'" class="info-text">👁️ Gotero - Haz clic en el canvas para seleccionar color</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// ==================== ESTADO ====================
const imageLoaded = ref(false)
const selectedTool = ref('select')
const brushSize = ref(3)
const brushColor = ref('#e11d48')
const fontSize = ref(24)
const fontFamily = ref('Arial')
const savedImages = ref([])
const currentEditingIndex = ref(null)
const drawnElements = ref([])
const selectedElementIndex = ref(null)

const drawingCanvas = ref(null)
const textInput = ref(null)
let ctx = null
let baseImage = null

// Estados de edición de texto
const isEditingText = ref(false)
const editingText = ref('')
const editingElementIndex = ref(null)
const textInputStyle = ref({})

// Estados para detección de doble clic
let lastClickTime = 0
const DOUBLE_CLICK_THRESHOLD = 300

// Estados de dibujo
let isDrawing = false
let startX = 0
let startY = 0
let currentElement = null

// Estados de transformación
let isTransforming = false
let transformMode = null // 'move' | 'resize-tl' | 'resize-tr' | 'resize-bl' | 'resize-br' | 'rotate'
let transformStartX = 0
let transformStartY = 0
let originalElementState = null

// Historial
const history = ref([])
const currentHistoryIndex = ref(-1)
const MAX_HISTORY = 50

// ==================== CONFIGURACIÓN ====================
const drawTools = [
  { id: 'pen', name: 'Dibujo Libre', icon: '✏️' },
  { id: 'line', name: 'Línea', icon: '📏' },
  { id: 'rectangle', name: 'Rectángulo', icon: '⬜' },
  { id: 'circle', name: 'Círculo', icon: '⭕' },
  { id: 'arrow', name: 'Flecha', icon: '➡️' },
  { id: 'text', name: 'Texto', icon: '🔤' },
  { id: 'eyedropper', name: 'Gotero', icon: '👁️' }
]

const colorPresets = ['#1e3a8a', '#0369a1', '#1e40af', '#111827', '#475569', '#64748b', '#e11d48', '#ea580c', '#d97706', '#16a34a']
const fontFamilies = ['Arial', 'Verdana', 'Georgia', 'Courier New', 'Comic Sans MS', 'Times New Roman']

// ==================== LIFECYCLE ====================
onMounted(() => {
  const saved = localStorage.getItem('savedTechnicalImages')
  if (saved) {
    try {
      savedImages.value = JSON.parse(saved)
    } catch (e) {
      savedImages.value = []
    }
  }

  const handleKeyboard = (e) => {
    if (!imageLoaded.value) return
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault()
      undoAction()
    }
    if (e.key === 'Delete' && selectedElementIndex.value !== null && selectedTool.value === 'select') {
      e.preventDefault()
      deleteSelectedElement()
    }
  }
  window.addEventListener('keydown', handleKeyboard)
  onUnmounted(() => window.removeEventListener('keydown', handleKeyboard))
})

// ==================== HISTORIAL ====================
const saveToHistory = () => {
  if (currentHistoryIndex.value < history.value.length - 1) {
    history.value = history.value.slice(0, currentHistoryIndex.value + 1)
  }
  const snapshot = JSON.parse(JSON.stringify(drawnElements.value))
  history.value.push(snapshot)
  if (history.value.length > MAX_HISTORY) {
    history.value.shift()
  } else {
    currentHistoryIndex.value++
  }
}

const undoAction = () => {
  if (currentHistoryIndex.value > 0) {
    currentHistoryIndex.value--
    drawnElements.value = JSON.parse(JSON.stringify(history.value[currentHistoryIndex.value]))
    selectedElementIndex.value = null
    redrawCanvas()
  }
}

// ==================== FUNCIONES PRINCIPALES ====================
const selectTool = (toolId) => {
  selectedTool.value = toolId
  selectedElementIndex.value = null
  isTransforming = false
  transformMode = null
  redrawCanvas()
  
  if (drawingCanvas.value) {
    if (toolId === 'select') {
      drawingCanvas.value.style.cursor = 'default'
    } else if (toolId === 'text') {
      drawingCanvas.value.style.cursor = 'text'
    } else {
      drawingCanvas.value.style.cursor = 'crosshair'
    }
  }
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  if (file.size > 10 * 1024 * 1024) {
    alert('La imagen es demasiado grande. Máximo 10MB.')
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      imageLoaded.value = true
      currentEditingIndex.value = null
      setTimeout(() => initializeCanvas(img), 100)
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
}

const initializeCanvas = (img) => {
  const canvas = drawingCanvas.value
  if (!canvas) return
  
  const maxWidth = 900
  const maxHeight = 650
  let width = img.width
  let height = img.height
  
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height)
    width *= ratio
    height *= ratio
  }
  
  canvas.width = width
  canvas.height = height
  ctx = canvas.getContext('2d', { willReadFrequently: true })
  
  baseImage = img
  drawnElements.value = []
  selectedElementIndex.value = null
  history.value = []
  currentHistoryIndex.value = -1
  
  redrawCanvas()
  saveToHistory()
}

const getMousePos = (e) => {
  const rect = drawingCanvas.value.getBoundingClientRect()
  const scaleX = drawingCanvas.value.width / rect.width
  const scaleY = drawingCanvas.value.height / rect.height
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  }
}

const getTouchPos = (e) => {
  const rect = drawingCanvas.value.getBoundingClientRect()
  const touch = e.touches[0]
  const scaleX = drawingCanvas.value.width / rect.width
  const scaleY = drawingCanvas.value.height / rect.height
  return {
    x: (touch.clientX - rect.left) * scaleX,
    y: (touch.clientY - rect.top) * scaleY
  }
}

const getElementBounds = (element) => {
  if (!ctx) return { minX: 0, maxX: 0, minY: 0, maxY: 0, centerX: 0, centerY: 0 }
  
  let minX, maxX, minY, maxY
  
  if (element.type === 'text') {
    ctx.font = `${element.fontSize}px ${element.fontFamily}`
    const metrics = ctx.measureText(element.content)
    const width = metrics.width
    const height = element.fontSize * 1.2
    minX = element.x
    maxX = element.x + width
    minY = element.y - height
    maxY = element.y + 5
  } else if (element.type === 'pen') {
    const xs = element.points.map(p => p.x)
    const ys = element.points.map(p => p.y)
    const padding = element.lineWidth * 2
    minX = Math.min(...xs) - padding
    maxX = Math.max(...xs) + padding
    minY = Math.min(...ys) - padding
    maxY = Math.max(...ys) + padding
  } else if (element.type === 'line' || element.type === 'arrow') {
    const padding = element.lineWidth * 3
    minX = Math.min(element.x1, element.x2) - padding
    maxX = Math.max(element.x1, element.x2) + padding
    minY = Math.min(element.y1, element.y2) - padding
    maxY = Math.max(element.y1, element.y2) + padding
  } else if (element.type === 'rectangle') {
    minX = Math.min(element.x, element.x + element.width)
    maxX = Math.max(element.x, element.x + element.width)
    minY = Math.min(element.y, element.y + element.height)
    maxY = Math.max(element.y, element.y + element.height)
  } else if (element.type === 'circle') {
    minX = element.cx - element.radius
    maxX = element.cx + element.radius
    minY = element.cy - element.radius
    maxY = element.cy + element.radius
  } else {
    minX = maxX = minY = maxY = 0
  }
  
  return {
    minX,
    maxX,
    minY,
    maxY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2
  }
}

const isPointInElement = (x, y, element) => {
  const bounds = getElementBounds(element)
  return x >= bounds.minX && x <= bounds.maxX && y >= bounds.minY && y <= bounds.maxY
}

const findElementAtPoint = (x, y) => {
  for (let i = drawnElements.value.length - 1; i >= 0; i--) {
    if (isPointInElement(x, y, drawnElements.value[i])) {
      return i
    }
  }
  return null
}

const isPointNearHandle = (px, py, hx, hy, threshold = 15) => {
  const distance = Math.sqrt(Math.pow(px - hx, 2) + Math.pow(py - hy, 2))
  return distance <= threshold
}

const getResizeHandle = (x, y, bounds) => {
  if (isPointNearHandle(x, y, bounds.minX, bounds.minY)) return 'resize-tl'
  if (isPointNearHandle(x, y, bounds.maxX, bounds.minY)) return 'resize-tr'
  if (isPointNearHandle(x, y, bounds.minX, bounds.maxY)) return 'resize-bl'
  if (isPointNearHandle(x, y, bounds.maxX, bounds.maxY)) return 'resize-br'
  return null
}

const getRotateHandle = (x, y, bounds) => {
  // Handle de rotación arriba del centro
  const rotateHandleX = bounds.centerX
  const rotateHandleY = bounds.minY - 30 // 30px arriba del borde superior
  
  if (isPointNearHandle(x, y, rotateHandleX, rotateHandleY, 18)) {
    return 'rotate'
  }
  return null
}

const handleMouseDown = (e) => {
  if (!ctx) return
  const pos = getMousePos(e)

  // Detectar doble clic
  const currentTime = Date.now()
  const isDoubleClick = (currentTime - lastClickTime) < DOUBLE_CLICK_THRESHOLD
  lastClickTime = currentTime

  // ========== MODO SELECCIÓN ==========
  if (selectedTool.value === 'select') {
    // Verificar doble clic en elemento de texto para editar
    const elementIndex = findElementAtPoint(pos.x, pos.y)
    if (elementIndex !== null && isDoubleClick) {
      const element = drawnElements.value[elementIndex]
      if (element.type === 'text') {
        startTextEditForElement(elementIndex)
        return
      }
    }

    if (selectedElementIndex.value !== null) {
      const element = drawnElements.value[selectedElementIndex.value]
      const bounds = getElementBounds(element)

      // Verificar handle de rotación PRIMERO
      const rotateHandle = getRotateHandle(pos.x, pos.y, bounds)
      if (rotateHandle) {
        isTransforming = true
        transformMode = 'rotate'
        transformStartX = pos.x
        transformStartY = pos.y
        originalElementState = JSON.parse(JSON.stringify(element))
        return
      }

      // Verificar handles de redimensionamiento
      const resizeHandle = getResizeHandle(pos.x, pos.y, bounds)
      if (resizeHandle) {
        isTransforming = true
        transformMode = resizeHandle
        transformStartX = pos.x
        transformStartY = pos.y
        originalElementState = JSON.parse(JSON.stringify(element))
        return
      }

      // Verificar si está dentro para mover
      if (isPointInElement(pos.x, pos.y, element)) {
        isTransforming = true
        transformMode = 'move'
        transformStartX = pos.x
        transformStartY = pos.y
        originalElementState = JSON.parse(JSON.stringify(element))
        return
      }
    }

    // Buscar nuevo elemento
    if (elementIndex !== null) {
      selectedElementIndex.value = elementIndex
      redrawCanvas()
    } else {
      selectedElementIndex.value = null
      redrawCanvas()
    }
    return
  }
  
  // ========== MODO TEXTO ==========
  if (selectedTool.value === 'text') {
    startTextEdit(pos.x, pos.y)
    return
  }

  // ========== MODO GOTERO ==========
  if (selectedTool.value === 'eyedropper') {
    pickColor(pos.x, pos.y)
    return
  }
  
  // ========== MODO DIBUJO ==========
  isDrawing = true
  startX = pos.x
  startY = pos.y
  
  if (selectedTool.value === 'pen') {
    currentElement = {
      type: 'pen',
      points: [{ x: pos.x, y: pos.y }],
      color: brushColor.value,
      lineWidth: brushSize.value,
      rotation: 0
    }
  }
}

const handleMouseMove = (e) => {
  if (!ctx) return
  const pos = getMousePos(e)
  
  // ========== MODO TRANSFORMACIÓN ==========
  if (selectedTool.value === 'select' && isTransforming && selectedElementIndex.value !== null) {
    const element = drawnElements.value[selectedElementIndex.value]
    const dx = pos.x - transformStartX
    const dy = pos.y - transformStartY
    
    if (transformMode === 'move') {
      moveElement(element, dx, dy)
    } else if (transformMode === 'rotate') {
      rotateElement(element, pos.x, pos.y)
    } else if (transformMode && transformMode.startsWith('resize-')) {
      resizeElement(element, transformMode, dx, dy)
    }
    
    redrawCanvas()
    return
  }
  
  // ========== MODO DIBUJO ==========
  if (!isDrawing) return
  
  if (selectedTool.value === 'pen') {
    currentElement.points.push({ x: pos.x, y: pos.y })
    redrawCanvas()
    drawElement(currentElement)
  } else {
    redrawCanvas()
    drawPreview(startX, startY, pos.x, pos.y)
  }
}

const handleMouseUp = (e) => {
  if (!ctx) return
  
  // ========== FINALIZAR TRANSFORMACIÓN ==========
  if (selectedTool.value === 'select' && isTransforming) {
    isTransforming = false
    transformMode = null
    originalElementState = null
    saveToHistory()
    return
  }
  
  // ========== FINALIZAR DIBUJO ==========
  if (!isDrawing) return
  
  const pos = e.clientX !== undefined ? getMousePos(e) : { x: startX, y: startY }
  
  if (selectedTool.value === 'pen' && currentElement) {
    drawnElements.value.push(currentElement)
    currentElement = null
  } else if (selectedTool.value === 'line') {
    drawnElements.value.push({
      type: 'line',
      x1: startX,
      y1: startY,
      x2: pos.x,
      y2: pos.y,
      color: brushColor.value,
      lineWidth: brushSize.value,
      rotation: 0
    })
  } else if (selectedTool.value === 'rectangle') {
    drawnElements.value.push({
      type: 'rectangle',
      x: startX,
      y: startY,
      width: pos.x - startX,
      height: pos.y - startY,
      color: brushColor.value,
      lineWidth: brushSize.value,
      rotation: 0
    })
  } else if (selectedTool.value === 'circle') {
    const radius = Math.sqrt(Math.pow(pos.x - startX, 2) + Math.pow(pos.y - startY, 2))
    drawnElements.value.push({
      type: 'circle',
      cx: startX,
      cy: startY,
      radius: radius,
      color: brushColor.value,
      lineWidth: brushSize.value,
      rotation: 0
    })
  } else if (selectedTool.value === 'arrow') {
    drawnElements.value.push({
      type: 'arrow',
      x1: startX,
      y1: startY,
      x2: pos.x,
      y2: pos.y,
      color: brushColor.value,
      lineWidth: brushSize.value,
      rotation: 0
    })
  }
  
  isDrawing = false
  redrawCanvas()
  saveToHistory()
}

const handleTouchStart = (e) => {
  e.preventDefault()
  const fakeEvent = { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY }
  handleMouseDown(fakeEvent)
}

const handleTouchMove = (e) => {
  e.preventDefault()
  const fakeEvent = { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY }
  handleMouseMove(fakeEvent)
}

const handleTouchEnd = (e) => {
  e.preventDefault()
  handleMouseUp({ clientX: undefined })
}

const drawPreview = (x1, y1, x2, y2) => {
  ctx.strokeStyle = brushColor.value
  ctx.fillStyle = brushColor.value
  ctx.lineWidth = brushSize.value
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  
  if (selectedTool.value === 'line') {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  } else if (selectedTool.value === 'rectangle') {
    ctx.beginPath()
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1)
  } else if (selectedTool.value === 'circle') {
    const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    ctx.beginPath()
    ctx.arc(x1, y1, radius, 0, 2 * Math.PI)
    ctx.stroke()
  } else if (selectedTool.value === 'arrow') {
    const headlen = 15 + (brushSize.value * 2)
    const angle = Math.atan2(y2 - y1, x2 - x1)
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6))
    ctx.moveTo(x2, y2)
    ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6))
    ctx.stroke()
  }
}

const drawElement = (element) => {
  if (!element) return
  
  const bounds = getElementBounds(element)
  const rotation = element.rotation || 0
  
  // Aplicar rotación si existe
  if (rotation !== 0) {
    ctx.save()
    ctx.translate(bounds.centerX, bounds.centerY)
    ctx.rotate(rotation * Math.PI / 180)
    ctx.translate(-bounds.centerX, -bounds.centerY)
  }
  
  ctx.strokeStyle = element.color
  ctx.fillStyle = element.color
  ctx.lineWidth = element.lineWidth || 3
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  
  if (element.type === 'text') {
    ctx.font = `${element.fontSize}px ${element.fontFamily}`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    const lines = element.content.split('\n')
    let y = element.y
    lines.forEach(line => {
      ctx.fillText(line, element.x, y)
      y += element.fontSize * 1.2 // Line height
    })
  } else if (element.type === 'pen') {
    if (element.points && element.points.length > 0) {
      ctx.beginPath()
      ctx.moveTo(element.points[0].x, element.points[0].y)
      element.points.forEach(point => ctx.lineTo(point.x, point.y))
      ctx.stroke()
    }
  } else if (element.type === 'rectangle') {
    ctx.beginPath()
    ctx.strokeRect(element.x, element.y, element.width, element.height)
  } else if (element.type === 'circle') {
    ctx.beginPath()
    ctx.arc(element.cx, element.cy, element.radius, 0, 2 * Math.PI)
    ctx.stroke()
  } else if (element.type === 'line') {
    ctx.beginPath()
    ctx.moveTo(element.x1, element.y1)
    ctx.lineTo(element.x2, element.y2)
    ctx.stroke()
  } else if (element.type === 'arrow') {
    const headlen = 15 + (element.lineWidth * 2)
    const angle = Math.atan2(element.y2 - element.y1, element.x2 - element.x1)
    ctx.beginPath()
    ctx.moveTo(element.x1, element.y1)
    ctx.lineTo(element.x2, element.y2)
    ctx.lineTo(element.x2 - headlen * Math.cos(angle - Math.PI / 6), element.y2 - headlen * Math.sin(angle - Math.PI / 6))
    ctx.moveTo(element.x2, element.y2)
    ctx.lineTo(element.x2 - headlen * Math.cos(angle + Math.PI / 6), element.y2 - headlen * Math.sin(angle + Math.PI / 6))
    ctx.stroke()
  }
  
  if (rotation !== 0) {
    ctx.restore()
  }
}

const redrawCanvas = () => {
  if (!ctx || !baseImage) return
  
  ctx.clearRect(0, 0, drawingCanvas.value.width, drawingCanvas.value.height)
  
  const canvasAspect = drawingCanvas.value.width / drawingCanvas.value.height
  const imageAspect = baseImage.width / baseImage.height
  let drawWidth, drawHeight, offsetX = 0, offsetY = 0
  
  if (canvasAspect > imageAspect) {
    drawHeight = drawingCanvas.value.height
    drawWidth = drawHeight * imageAspect
    offsetX = (drawingCanvas.value.width - drawWidth) / 2
  } else {
    drawWidth = drawingCanvas.value.width
    drawHeight = drawWidth / imageAspect
    offsetY = (drawingCanvas.value.height - drawHeight) / 2
  }
  
  ctx.drawImage(baseImage, offsetX, offsetY, drawWidth, drawHeight)
  
  drawnElements.value.forEach((element, index) => {
    drawElement(element)
    
    if (selectedTool.value === 'select' && index === selectedElementIndex.value) {
      const bounds = getElementBounds(element)
      drawSelectionControls(bounds)
    }
  })
}

const drawSelectionControls = (bounds) => {
  const handleSize = 10
  const padding = 5
  
  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0) // Reset transformation para los controles
  
  // Borde de selección
  ctx.strokeStyle = '#3b82f6'
  ctx.lineWidth = 2
  ctx.setLineDash([5, 5])
  ctx.strokeRect(
    bounds.minX - padding,
    bounds.minY - padding,
    bounds.maxX - bounds.minX + padding * 2,
    bounds.maxY - bounds.minY + padding * 2
  )
  ctx.setLineDash([])
  
  // Handles de redimensionamiento
  const handles = [
    { x: bounds.minX, y: bounds.minY },
    { x: bounds.maxX, y: bounds.minY },
    { x: bounds.minX, y: bounds.maxY },
    { x: bounds.maxX, y: bounds.maxY }
  ]
  
  ctx.fillStyle = '#3b82f6'
  ctx.strokeStyle = 'white'
  ctx.lineWidth = 2
  
  handles.forEach(handle => {
    ctx.fillRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize)
    ctx.strokeRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize)
  })
  
  // Handle de rotación (flecha circular arriba)
  const rotateHandleX = bounds.centerX
  const rotateHandleY = bounds.minY - 30
  
  // Línea que conecta el handle con el elemento
  ctx.strokeStyle = '#3b82f6'
  ctx.lineWidth = 1
  ctx.setLineDash([2, 2])
  ctx.beginPath()
  ctx.moveTo(bounds.centerX, bounds.minY)
  ctx.lineTo(rotateHandleX, rotateHandleY)
  ctx.stroke()
  ctx.setLineDash([])
  
  // Círculo del handle de rotación
  ctx.fillStyle = '#10b981'
  ctx.strokeStyle = 'white'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(rotateHandleX, rotateHandleY, 12, 0, 2 * Math.PI)
  ctx.fill()
  ctx.stroke()
  
  // Flecha de ciclo dentro del círculo
  ctx.strokeStyle = 'white'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(rotateHandleX, rotateHandleY, 7, 0.2, 1.8 * Math.PI)
  ctx.stroke()
  
  // Punta de flecha
  const arrowX = rotateHandleX + 7 * Math.cos(1.8 * Math.PI)
  const arrowY = rotateHandleY + 7 * Math.sin(1.8 * Math.PI)
  ctx.beginPath()
  ctx.moveTo(arrowX, arrowY)
  ctx.lineTo(arrowX + 4, arrowY - 4)
  ctx.moveTo(arrowX, arrowY)
  ctx.lineTo(arrowX + 4, arrowY + 2)
  ctx.stroke()
  
  ctx.restore()
}

const moveElement = (element, dx, dy) => {
  if (!originalElementState) return
  
  if (element.type === 'text') {
    element.x = originalElementState.x + dx
    element.y = originalElementState.y + dy
  } else if (element.type === 'pen') {
    element.points = originalElementState.points.map(p => ({
      x: p.x + dx,
      y: p.y + dy
    }))
  } else if (element.type === 'line' || element.type === 'arrow') {
    element.x1 = originalElementState.x1 + dx
    element.y1 = originalElementState.y1 + dy
    element.x2 = originalElementState.x2 + dx
    element.y2 = originalElementState.y2 + dy
  } else if (element.type === 'rectangle') {
    element.x = originalElementState.x + dx
    element.y = originalElementState.y + dy
  } else if (element.type === 'circle') {
    element.cx = originalElementState.cx + dx
    element.cy = originalElementState.cy + dy
  }
}

const rotateElement = (element, mouseX, mouseY) => {
  if (!originalElementState) return
  
  const bounds = getElementBounds(originalElementState)
  const centerX = bounds.centerX
  const centerY = bounds.centerY
  
  // Calcular ángulo inicial (al hacer clic)
  const initialAngle = Math.atan2(transformStartY - centerY, transformStartX - centerX)
  
  // Calcular ángulo actual (al mover el mouse)
  const currentAngle = Math.atan2(mouseY - centerY, mouseX - centerX)
  
  // Calcular diferencia de ángulos en grados
  const angleDiff = (currentAngle - initialAngle) * (180 / Math.PI)
  
  // Aplicar rotación (sumando a la rotación original)
  element.rotation = (originalElementState.rotation || 0) + angleDiff
  
  // Normalizar entre -180 y 180
  while (element.rotation > 180) element.rotation -= 360
  while (element.rotation < -180) element.rotation += 360
}

const resizeElement = (element, handle, dx, dy) => {
  if (!originalElementState) return
  
  if (element.type === 'rectangle') {
    if (handle === 'resize-tl') {
      element.x = originalElementState.x + dx
      element.y = originalElementState.y + dy
      element.width = originalElementState.width - dx
      element.height = originalElementState.height - dy
    } else if (handle === 'resize-tr') {
      element.y = originalElementState.y + dy
      element.width = originalElementState.width + dx
      element.height = originalElementState.height - dy
    } else if (handle === 'resize-bl') {
      element.x = originalElementState.x + dx
      element.width = originalElementState.width - dx
      element.height = originalElementState.height + dy
    } else if (handle === 'resize-br') {
      element.width = originalElementState.width + dx
      element.height = originalElementState.height + dy
    }
  } else if (element.type === 'circle') {
    const distanceFromStart = Math.sqrt(dx * dx + dy * dy)
    const direction = dx + dy > 0 ? 1 : -1
    element.radius = Math.max(10, originalElementState.radius + (distanceFromStart * direction * 0.5))
  } else if (element.type === 'line' || element.type === 'arrow') {
    if (handle === 'resize-tl' || handle === 'resize-bl') {
      element.x1 = originalElementState.x1 + dx
      element.y1 = originalElementState.y1 + dy
    } else {
      element.x2 = originalElementState.x2 + dx
      element.y2 = originalElementState.y2 + dy
    }
  } else if (element.type === 'pen') {
    const originalBounds = {
      minX: Math.min(...originalElementState.points.map(p => p.x)),
      maxX: Math.max(...originalElementState.points.map(p => p.x)),
      minY: Math.min(...originalElementState.points.map(p => p.y)),
      maxY: Math.max(...originalElementState.points.map(p => p.y))
    }
    
    const originalWidth = originalBounds.maxX - originalBounds.minX
    const originalHeight = originalBounds.maxY - originalBounds.minY
    
    let newWidth = originalWidth
    let newHeight = originalHeight
    let offsetX = 0
    let offsetY = 0
    
    if (handle === 'resize-br') {
      newWidth = originalWidth + dx
      newHeight = originalHeight + dy
    } else if (handle === 'resize-tr') {
      newWidth = originalWidth + dx
      newHeight = originalHeight - dy
      offsetY = dy
    } else if (handle === 'resize-bl') {
      newWidth = originalWidth - dx
      newHeight = originalHeight + dy
      offsetX = dx
    } else if (handle === 'resize-tl') {
      newWidth = originalWidth - dx
      newHeight = originalHeight - dy
      offsetX = dx
      offsetY = dy
    }
    
    const scaleX = newWidth / originalWidth
    const scaleY = newHeight / originalHeight
    
    element.points = originalElementState.points.map(p => ({
      x: originalBounds.minX + (p.x - originalBounds.minX) * scaleX + offsetX,
      y: originalBounds.minY + (p.y - originalBounds.minY) * scaleY + offsetY
    }))
  } else if (element.type === 'text') {
    const scale = Math.max(0.3, 1 + (dx + dy) / 200)
    element.fontSize = Math.max(8, Math.min(120, originalElementState.fontSize * scale))
  }
}

const deleteSelectedElement = () => {
  if (selectedElementIndex.value !== null) {
    drawnElements.value.splice(selectedElementIndex.value, 1)
    selectedElementIndex.value = null
    redrawCanvas()
    saveToHistory()
  }
}

const clearCanvas = () => {
  if (confirm('¿Limpiar todos los dibujos? La imagen original se mantendrá.')) {
    drawnElements.value = []
    selectedElementIndex.value = null
    redrawCanvas()
    saveToHistory()
  }
}

const saveImage = () => {
  try {
    const tempSelected = selectedElementIndex.value
    selectedElementIndex.value = null
    redrawCanvas()
    
    const dataURL = drawingCanvas.value.toDataURL('image/png')
    
    selectedElementIndex.value = tempSelected
    if (tempSelected !== null) redrawCanvas()
    
    const base64Length = dataURL.length - dataURL.indexOf(',') - 1
    const size = (base64Length * 3) / 4
    
    if (size > 10 * 1024 * 1024) {
      alert('Imagen muy grande (>10MB)')
      return
    }
    
    const imageData = {
      data: dataURL,
      size: size,
      timestamp: Date.now(),
      elements: JSON.parse(JSON.stringify(drawnElements.value))
    }
    
    if (currentEditingIndex.value !== null) {
      savedImages.value[currentEditingIndex.value] = imageData
    } else {
      savedImages.value.push(imageData)
    }
    
    localStorage.setItem('savedTechnicalImages', JSON.stringify(savedImages.value))
    resetEditor()
    alert('✅ Imagen guardada exitosamente')
  } catch (error) {
    console.error('Error al guardar:', error)
    alert('❌ Error al guardar la imagen')
  }
}

const downloadImage = (dataURL, index) => {
  const link = document.createElement('a')
  link.href = dataURL
  link.download = `visita-tecnica-${index + 1}-${Date.now()}.png`
  link.click()
}

const editSavedImage = (index) => {
  const img = new Image()
  img.onload = () => {
    imageLoaded.value = true
    currentEditingIndex.value = index
    // Load saved elements if they exist
    if (savedImages.value[index].elements) {
      drawnElements.value = JSON.parse(JSON.stringify(savedImages.value[index].elements))
    } else {
      drawnElements.value = []
    }
    setTimeout(() => initializeCanvas(img), 100)
  }
  img.src = savedImages.value[index].data
}

const deleteSavedImage = (index) => {
  if (confirm('¿Eliminar esta imagen?')) {
    savedImages.value.splice(index, 1)
    localStorage.setItem('savedTechnicalImages', JSON.stringify(savedImages.value))
  }
}

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const resetEditor = () => {
  imageLoaded.value = false
  selectedTool.value = 'select'
  brushSize.value = 3
  brushColor.value = '#e11d48'
  fontSize.value = 24
  fontFamily.value = 'Arial'
  drawnElements.value = []
  selectedElementIndex.value = null
  currentEditingIndex.value = null
  history.value = []
  currentHistoryIndex.value = -1
  ctx = null
  baseImage = null
  isDrawing = false
  isTransforming = false
  transformMode = null
  currentElement = null
  originalElementState = null
}

// ==================== FUNCIONES DE TEXTO INLINE ====================
const startTextEdit = (x, y) => {
  isEditingText.value = true
  editingText.value = ''
  editingElementIndex.value = null

  // Calcular posición del textarea en pantalla
  const canvasRect = drawingCanvas.value.getBoundingClientRect()
  const scaleX = canvasRect.width / drawingCanvas.value.width
  const scaleY = canvasRect.height / drawingCanvas.value.height

  textInputStyle.value = {
    position: 'absolute',
    left: `${canvasRect.left + x * scaleX}px`,
    top: `${canvasRect.top + y * scaleY}px`,
    fontSize: `${fontSize.value * scaleY}px`,
    fontFamily: fontFamily.value,
    color: brushColor.value,
    background: 'transparent',
    border: 'none',
    padding: '0',
  }

  // Enfocar el textarea después de que se renderice
  setTimeout(() => {
    if (textInput.value) {
      textInput.value.focus()
    }
  }, 10)
}

const handleEnterKey = () => {
  finishTextEdit()
}

const handleShiftEnter = () => {
  // Insertar nueva línea en el textarea
  const textarea = textInput.value
  if (textarea) {
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    editingText.value = editingText.value.substring(0, start) + '\n' + editingText.value.substring(end)
    // Mantener el cursor en la posición correcta
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + 1
    }, 0)
  }
}

const finishTextEdit = () => {
  if (editingText.value.trim()) {
    if (editingElementIndex.value !== null) {
      // Editar elemento existente
      drawnElements.value[editingElementIndex.value].content = editingText.value
    } else {
      // Crear nuevo elemento
      const canvasRect = drawingCanvas.value.getBoundingClientRect()
      const scaleX = drawingCanvas.value.width / canvasRect.width
      const scaleY = drawingCanvas.value.height / canvasRect.height

      const textX = (parseFloat(textInputStyle.value.left) - canvasRect.left) / scaleX
      const textY = (parseFloat(textInputStyle.value.top) - canvasRect.top) / scaleY + fontSize.value

      drawnElements.value.push({
        type: 'text',
        x: textX,
        y: textY,
        content: editingText.value,
        fontSize: fontSize.value,
        fontFamily: fontFamily.value,
        color: brushColor.value,
        rotation: 0
      })
    }
    redrawCanvas()
    saveToHistory()
  }

  isEditingText.value = false
  editingText.value = ''
  editingElementIndex.value = null
}

const cancelTextEdit = () => {
  isEditingText.value = false
  editingText.value = ''
  editingElementIndex.value = null
}

const startTextEditForElement = (elementIndex) => {
  const element = drawnElements.value[elementIndex]
  if (!element || element.type !== 'text') return

  isEditingText.value = true
  editingText.value = element.content
  editingElementIndex.value = elementIndex

  // Calcular posición del textarea sobre el texto existente
  const canvasRect = drawingCanvas.value.getBoundingClientRect()
  const scaleX = canvasRect.width / drawingCanvas.value.width
  const scaleY = canvasRect.height / drawingCanvas.value.height

  textInputStyle.value = {
    position: 'absolute',
    left: `${canvasRect.left + element.x * scaleX}px`,
    top: `${canvasRect.top + (element.y - element.fontSize) * scaleY}px`,
    fontSize: `${element.fontSize * scaleY}px`,
    fontFamily: element.fontFamily,
    color: element.color,
    background: 'rgba(255, 255, 255, 0.9)',
    border: '2px solid #3b82f6',
    borderRadius: '4px',
    padding: '4px',
    minWidth: '100px',
    outline: 'none',
    zIndex: 1000
  }

  // Enfocar el textarea después de que se renderice
  setTimeout(() => {
    if (textInput.value) {
      textInput.value.focus()
      textInput.value.select() // Seleccionar todo el texto para facilitar la edición
    }
  }, 10)
}

// ==================== FUNCIONES DE GOTERO ====================
const pickColor = (x, y) => {
  if (!ctx) return

  // Obtener el color del pixel en la posición x, y
  const imageData = ctx.getImageData(x, y, 1, 1)
  const [r, g, b] = imageData.data

  // Convertir a formato hex
  const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`

  // Establecer el color seleccionado
  brushColor.value = hexColor

  // Mostrar feedback visual (opcional)
  console.log(`Color seleccionado: ${hexColor}`)
}

// ==================== FUNCIONES DE CAMBIO DE COLOR ====================
const changeElementColor = (color) => {
  if (selectedElementIndex.value !== null) {
    drawnElements.value[selectedElementIndex.value].color = color
    redrawCanvas()
    saveToHistory()
  } else {
    brushColor.value = color
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.panel1 {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  padding: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 10px 40px rgba(0,0,0,0.08);
  min-height: 500px;
  height: 100%;
  display: flex;
  flex-direction: column;
  grid-column: span 2;
  font-family: 'Inter', sans-serif;
}

.panel-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.upload-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 30px;
  overflow-y: auto;
}

.upload-container {
  text-align: center;
  max-width: 700px;
  width: 100%;
}

.upload-icon-box {
  margin-bottom: 32px;
  display: flex;
  justify-content: center;
}

.upload-title {
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 12px;
}

.upload-subtitle {
  font-size: 15px;
  color: #475569;
  margin-bottom: 40px;
}

.upload-button {
  display: inline-flex;
  padding: 14px 44px;
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
  color: white;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(30, 58, 138, 0.25);
  margin-bottom: 20px;
  transition: transform 0.2s;
}

.upload-button:hover {
  transform: translateY(-2px);
}

.upload-hint {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 50px;
}

.saved-images-section {
  margin-top: 50px;
  padding-top: 40px;
  border-top: 2px solid rgba(30, 58, 138, 0.1);
}

.saved-title {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 24px;
  text-align: left;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.saved-image-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.saved-image-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

.saved-thumbnail {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.image-info {
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.image-size {
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
}

.image-actions {
  display: flex;
  gap: 6px;
}

.edit-btn, .download-btn, .delete-btn {
  padding: 6px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: transform 0.2s;
}

.edit-btn:hover, .download-btn:hover, .delete-btn:hover {
  transform: scale(1.1);
}

.edit-btn {
  background: rgba(30, 58, 138, 0.1);
}

.download-btn {
  background: rgba(5, 150, 105, 0.1);
}

.delete-btn {
  background: rgba(220, 38, 38, 0.1);
}

.editor-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-header {
  padding: 16px 28px;
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.editor-title {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}

.back-button {
  padding: 8px 12px;
  background: rgba(30, 58, 138, 0.08);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #1e3a8a;
  font-size: 18px;
  transition: background 0.2s;
}

.back-button:hover {
  background: rgba(30, 58, 138, 0.15);
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 0;
  flex-wrap: wrap;
  flex: 1;
  justify-content: flex-end;
}

.tool-group {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
}

.toolbar-separator {
  width: 1px;
  height: 32px;
  background: rgba(0, 0, 0, 0.08);
}

.tool-button {
  padding: 8px;
  background: transparent;
  border: 2px solid rgba(30, 58, 138, 0.15);
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.tool-button:hover {
  background: rgba(30, 58, 138, 0.08);
  transform: scale(1.05);
}

.tool-button.active {
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
  color: white;
  border-color: #1e3a8a;
  transform: scale(1.1);
}

.size-label, .color-label, .font-label {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
}

.size-slider {
  width: 90px;
  height: 5px;
  border-radius: 3px;
  background: #e2e8f0;
  outline: none;
  cursor: pointer;
}

.size-value {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  min-width: 28px;
}

.color-picker {
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: border 0.2s;
}

.color-picker:hover {
  border-color: #cbd5e1;
}

.color-presets {
  display: flex;
  gap: 6px;
}

.color-preset {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
}

.color-preset:hover {
  transform: scale(1.1);
  border-color: #475569;
}

.font-select {
  padding: 6px 10px;
  border: 2px solid rgba(30, 58, 138, 0.15);
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  background: white;
  transition: border 0.2s;
}

.font-select:hover {
  border-color: rgba(30, 58, 138, 0.3);
}

.action-button {
  padding: 8px;
  background: transparent;
  border: 2px solid rgba(30, 58, 138, 0.15);
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.action-button:hover:not(:disabled) {
  background: rgba(30, 58, 138, 0.08);
  transform: translateY(-2px);
}

.action-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.action-button.clear, .action-button.delete-element {
  color: #dc2626;
  border-color: rgba(220, 38, 38, 0.15);
}

.action-button.clear:hover, .action-button.delete-element:hover {
  background: rgba(220, 38, 38, 0.08);
}

.action-button.save {
  color: #059669;
  border-color: rgba(5, 150, 105, 0.15);
}

.action-button.save:hover {
  background: rgba(5, 150, 105, 0.08);
}

.canvas-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  overflow: auto;
  position: relative;
}

.drawing-canvas {
  border-radius: 12px;
  background: white;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  cursor: crosshair;
  max-width: 100%;
  max-height: 100%;
  touch-action: none;
}

.editor-footer {
  padding: 14px 28px;
  background: rgba(255, 255, 255, 0.9);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  text-align: center;
}

.tool-info {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.info-text strong {
  color: #1e3a8a;
  font-weight: 600;
}

@media (max-width: 768px) {
  .editor-header {
    flex-direction: column;
    padding: 12px;
  }
  .toolbar {
    width: 100%;
    justify-content: center;
  }
  .tool-group {
    padding: 0 8px;
  }
  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
</style>
