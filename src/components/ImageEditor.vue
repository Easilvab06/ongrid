<template>
  <div class="image-editor">
    <h3 v-if="!isSharedLink">Editor de Imágenes</h3>
    <h3 v-else>Imágenes del Proyecto</h3>
    <p v-if="isSharedLink">Vista de solo lectura - Imágenes guardadas para su revisión</p>
    <div class="controls" v-if="!isSharedLink">
      <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" style="display: none;">
      <button @click="fileInput.click()" class="btn">Subir Imagen</button>
      <button @click="saveToLocalStorage" class="btn">Guardar</button>
      <button @click="loadFromLocalStorage" class="btn">Cargar</button>
      <button @click="shareViaLink" class="btn">Compartir Enlace</button>
    </div>
    <div class="controls" v-if="isSharedLink">
      <button @click="downloadImage" class="btn">Descargar Imagen</button>
    </div>
    <canvas ref="canvas" id="canvas" width="800" height="600"></canvas>
    <p v-if="isSharedLink && !hasImage">No hay imágenes disponibles para mostrar.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fabric } from 'fabric'
import { useCotizacionStore } from '../store/cotizacion.js'

const cotizacionStore = useCotizacionStore()

const fileInput = ref(null)
const canvas = ref(null)
let fabricCanvas = null
const hasImage = ref(false)
const isSharedLink = ref(false)

// IMPORTANTE: Reemplaza con tu API key de imgbb (obtén una gratuita en https://imgbb.com/)
// 1. Ve a https://imgbb.com/
// 2. Regístrate gratis
// 3. Ve a "API" en tu perfil
// 4. Copia tu API key y reemplaza el valor abajo
const API_KEY = 'TU_API_KEY_DE_IMGBB_AQUI'

onMounted(() => {
  fabricCanvas = new fabric.Canvas('canvas', {
    backgroundColor: '#f0f0f0'
  })

  // Define custom filter to replace blue background with white
  fabric.Image.filters.ReplaceBlueFilter = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
    type: 'ReplaceBlueFilter',
    applyTo: function(canvasEl) {
      var context = canvasEl.getContext('2d'),
          imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height),
          data = imageData.data;
      for (var i = 0; i < data.length; i += 4) {
        var r = data[i], g = data[i + 1], b = data[i + 2];
        if (b > 150 && r < 100 && g < 100) {
          data[i] = 255; // R
          data[i + 1] = 255; // G
          data[i + 2] = 255; // B
        }
      }
      context.putImageData(imageData, 0, 0);
    }
  });

  // Cargar imagen desde URL si existe
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.has('image')) {
    isSharedLink.value = true
    try {
      const imageData = JSON.parse(decodeURIComponent(urlParams.get('image')))
      loadImageFromData(imageData)
    } catch (error) {
      console.error('Error loading image from URL:', error)
    }
  }
})

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      fabric.Image.fromURL(e.target.result, (img) => {
        img.scaleToWidth(400)
        fabricCanvas.add(img)
        fabricCanvas.renderAll()
      })
    }
    reader.readAsDataURL(file)
  }
}

const loadImageFromPublic = (imagePath) => {
  fabric.Image.fromURL(imagePath, (img) => {
    fabricCanvas.clear()
    img.scaleToWidth(400)
    fabricCanvas.add(img)
    fabricCanvas.renderAll()
  })
}

const saveToLocalStorage = () => {
  // Guardar imagen en public/project-images
  const dataURL = fabricCanvas.toDataURL()
  const imageName = `saved-${Date.now()}.jpg`
  const imagePath = `/project-images/${imageName}`

  // En una aplicación real, aquí subirías al servidor
  // Por ahora, solo guardamos la referencia en localStorage
  const imageData = {
    dataURL: dataURL,
    imagePath: imagePath,
    timestamp: Date.now()
  }
  localStorage.setItem('editedImage', JSON.stringify(imageData))
  alert('Imagen guardada en proyecto')
}

const loadFromLocalStorage = () => {
  const savedData = localStorage.getItem('editedImage')
  if (savedData) {
    try {
      const imageData = JSON.parse(savedData)
      if (imageData.dataURL) {
        fabric.Image.fromURL(imageData.dataURL, (img) => {
          fabricCanvas.clear()
          img.scaleToWidth(400)
          fabricCanvas.add(img)
          fabricCanvas.renderAll()
        })
      }
    } catch (error) {
      console.error('Error loading image:', error)
      alert('Error al cargar la imagen')
    }
  } else {
    alert('No hay imagen guardada')
  }
}

const uploadToImgbb = async (dataURL) => {
  const apiKey = API_KEY
  if (!apiKey || apiKey === 'TU_API_KEY_DE_IMGBB_AQUI') {
    alert('Por favor configura tu API key de imgbb en el código')
    return null
  }

  const formData = new FormData()
  // Convertir dataURL a blob
  const response = await fetch(dataURL)
  const blob = await response.blob()
  formData.append('image', blob)

  try {
    const uploadResponse = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData
    })
    const result = await uploadResponse.json()
    if (result.success) {
      return result.data.url
    } else {
      throw new Error(result.error.message)
    }
  } catch (error) {
    console.error('Error uploading to imgbb:', error)
    alert('Error al subir imagen al servidor')
    return null
  }
}

const shareViaLink = async () => {
  // Crear una versión reducida del canvas para compartir
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')
  tempCanvas.width = 400
  tempCanvas.height = 300
  const scale = Math.min(400 / fabricCanvas.width, 300 / fabricCanvas.height)
  tempCtx.scale(scale, scale)
  fabricCanvas.renderCanvas(tempCtx)
  const dataURL = tempCanvas.toDataURL('image/jpeg', 0.7)

  // Guardar en public/project-images con un nombre único
  const imageName = `shared-${Date.now()}.jpg`
  const imagePath = `/project-images/${imageName}`

  // En una aplicación real, aquí subirías al servidor
  // Por ahora, creamos el enlace asumiendo que la imagen estará disponible
  const imageData = {
    imagePath: imagePath
  }
  const encodedData = encodeURIComponent(JSON.stringify(imageData))
  const shareURL = `${window.location.origin}${window.location.pathname}?image=${encodedData}`

  navigator.clipboard.writeText(shareURL).then(() => {
    alert('Enlace copiado al portapapeles')
  }).catch(() => {
    alert('Enlace generado:\n' + shareURL + '\n\nCópielo manualmente.')
  })
}

const loadImageFromData = (data) => {
  if (data.dataURL) {
    fabric.Image.fromURL(data.dataURL, (img) => {
      fabricCanvas.clear()
      img.scaleToWidth(400)
      fabricCanvas.add(img)
      fabricCanvas.renderAll()
    })
  } else if (data.imageUrl) {
    // Cargar desde URL externa (imgbb)
    fabric.Image.fromURL(data.imageUrl, (img) => {
      fabricCanvas.clear()
      img.scaleToWidth(400)
      fabricCanvas.add(img)
      fabricCanvas.renderAll()
      hasImage.value = true
    }, { crossOrigin: 'anonymous' })
  } else if (data.imagePath) {
    // Cargar desde carpeta public/project-images
    fabric.Image.fromURL(data.imagePath, (img) => {
      fabricCanvas.clear()
      img.scaleToWidth(400)
      fabricCanvas.add(img)
      fabricCanvas.renderAll()
      hasImage.value = true
    })
  }
}

const downloadImage = (imageUrl) => {
  if (imageUrl) {
    // Descargar desde URL externa o ruta relativa
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = 'shared-image.png'
    link.target = '_blank'
    link.click()
  } else {
    // Descargar desde canvas local
    const link = document.createElement('a')
    link.href = fabricCanvas.toDataURL()
    link.download = 'edited-image.png'
    link.click()
  }
}
</script>

<style scoped>
.image-editor {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: white;
}

.controls {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn:hover {
  background: #0056b3;
}

canvas {
  border: 1px solid #ccc;
  max-width: 100%;
  height: auto;
}
</style>
