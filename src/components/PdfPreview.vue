<template>
  <div class="pdf-preview">
    <h3>Cotización Solar</h3>
    <div class="details">
      <p>Consumo mensual: {{ cotizacionStore.consumo }} kWh</p>
      <p>Radiación solar: {{ cotizacionStore.radiacion }} kWh/m²/día</p>
      <p>Generación estimada: {{ cotizacionStore.generacion.toFixed(2) }} kW</p>
      <p>Número de paneles (400W): {{ Math.ceil(cotizacionStore.generacion * 1000 / 400) }}</p>
      <p>Capacidad total: {{ (Math.ceil(cotizacionStore.generacion * 1000 / 400) * 400 / 1000).toFixed(2) }} kW</p>
      <p>Total a pagar: ${{ (Math.ceil(cotizacionStore.generacion * 1000 / 400) * 1000).toLocaleString() }}</p>
    </div>
    <button v-if="!isSharedLink" @click="generateClientLink" class="generate-link-btn">Generar Link para Cliente</button>
    <div v-if="clientLink && !isSharedLink" class="link-section">
      <p>Link para el cliente (copia y comparte):</p>
      <input :value="clientLink" readonly class="link-input" />
      <button @click="copyLink" class="copy-btn">Copiar Link</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCotizacionStore } from '../store/cotizacion.js'

const cotizacionStore = useCotizacionStore()
const clientLink = ref('')
const isSharedLink = ref(false)

const generateClientLink = () => {
  const data = {
    consumo: cotizacionStore.consumo,
    radiacion: cotizacionStore.radiacion,
    generacion: cotizacionStore.generacion
  }
  const encoded = encodeURIComponent(JSON.stringify(data))
  clientLink.value = `${window.location.origin}/SoinCalc/?data=${encoded}`
}

const copyLink = () => {
  navigator.clipboard.writeText(clientLink.value).then(() => {
    alert('Link copiado al portapapeles')
  }).catch(() => {
    alert('Error al copiar. Copia manualmente.')
  })
}

onMounted(() => {
  // Generar el link automáticamente al cargar el componente
  generateClientLink()

  const urlParams = new URLSearchParams(window.location.search)
  isSharedLink.value = urlParams.has('data')
  if (urlParams.has('data')) {
    // Datos ya cargados en App.vue, generar PDF automáticamente
    setTimeout(() => {
      generatePDF()
    }, 1000) // Pequeño delay para asegurar que el componente esté renderizado
  }
})

const generatePDF = () => {
  import('jspdf').then((jsPDF) => {
    import('html2canvas').then((html2canvas) => {
      const element = document.querySelector('.pdf-preview')
      html2canvas.default(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/png')
        const doc = new jsPDF.default()
        const imgWidth = 210
        const pageHeight = 295
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        let heightLeft = imgHeight

        let position = 0

        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight
          doc.addPage()
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
          heightLeft -= pageHeight
        }

        doc.save('cotizacion-solar.pdf')
      })
    })
  })
}
</script>

<style scoped>
.pdf-preview {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: white;
  max-width: 600px;
  margin: 0 auto;
}

.details {
  margin-bottom: 20px;
}

.details p {
  margin: 8px 0;
  font-size: 16px;
}

.generate-link-btn {
  background: #F5B027;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;
}

.generate-link-btn:hover {
  background: #E89B1C;
}

.link-section {
  margin-top: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 5px;
}

.link-input {
  width: 100%;
  padding: 8px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 14px;
}

.copy-btn {
  background: #1f2c51;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 3px;
  cursor: pointer;
}

.copy-btn:hover {
  background: #2d3f6e;
}
</style>
