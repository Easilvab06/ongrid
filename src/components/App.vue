<template>
  <div class="app-wrapper">
    <!-- Partículas flotantes -->
    <div class="particles fixed top-0 left-0 right-0 bottom-0 overflow-hidden z-0 pointer-events-none">
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
    </div>

    <main class="container">
      <!-- Header Premium -->
      <header class="header">
        <div class="logo-box">
          <div class="icon-solar">
            <img :src="logoSrc" alt="Logo" class="logo-image" />
          </div>
          <div>
            <h1 class="title">Soinsolar</h1>
            <p class="subtitle">cotización sistema fotovoltaico</p>
          </div>
        </div>
        <div class="header-decoration"></div>
      </header>

      <!-- Paneles Informativos -->
      <div class="panels-grid">
        <Panel1 />
        <Panel6 class="full-width"/>
        <Panel2 />
         <Panel3 />
        <Panel8 class="full-width"/>
         <Panel4/>
          <Panel5/>
          <Panel7 />

      </div>

      <!-- Grid de componentes -->
      <div class="grid">
        <Cotizador ref="cotizadorRef" />
        <ImageEditor ref="imageEditorRef" />
        <PdfPreview ref="pdfPreviewRef" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Panel1 from './components/Panel1.vue'
import Panel6 from './components/Panel6.vue'
import Panel2 from './components/Panel2.vue'
import Panel8 from './components/Panel8.vue'
import Panel3 from './components/Panel3.vue'
import Panel4 from './components/Panel4.vue'
import Panel5 from './components/Panel5.vue'
import Panel7 from './components/Panel7.vue'
import { useCotizacionStore } from './store/cotizacion.js'
import logoSrc from './assets/logo4.png'

const cotizacionStore = useCotizacionStore()
const cotizadorRef = ref(null)
const imageEditorRef = ref(null)
const pdfPreviewRef = ref(null)

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.has('data')) {
    try {
      const data = JSON.parse(decodeURIComponent(urlParams.get('data')))
      cotizacionStore.consumo = data.consumo || 300
      cotizacionStore.radiacion = data.radiacion || 4.5
      cotizacionStore.generacion = data.generacion || 0
      cotizacionStore.calcular()

      // Guardar imágenes en localStorage temporal para que Panel5 las pueda cargar
      if (data.images && Array.isArray(data.images) && data.images.length > 0) {
        localStorage.setItem('sharedImages', JSON.stringify(data.images))
        console.log('Imágenes compartidas guardadas desde URL:', data.images.length)
        console.log('Primeras imágenes:', data.images.slice(0, 2))
      } else {
        console.log('No se encontraron imágenes en el enlace compartido')
        console.log('Datos completos:', data)
      }
    } catch (error) {
      console.error('Error loading data from URL:', error)
      console.error('URL data:', urlParams.get('data'))
    }
  }
})
</script>

<style scoped>
.app-wrapper {
  position: relative;
  z-index: 10;
  min-height: 100vh;
  overflow: hidden; /* Prevent layout shifts from animations */
  transform-origin: top center;
}

/* Mobile zoom: 75% */
@media (max-width: 768px) {
  .app-wrapper {
    transform: scale(0.75);
    transform-origin: top center;
    width: calc(100% / 0.75);
    min-height: calc(100vh / 0.75);
  }
}

/* Desktop zoom: 100% */
@media (min-width: 769px) {
  .app-wrapper {
    transform: scale(1);
  }
}

.particles {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  border-radius: 9999px;
  animation: floatParticle 15s infinite ease-in-out;
}

.particle {
  background: radial-gradient(circle, var(--shadow-orange), transparent);
}

.particle:nth-child(1) {
  width: 96px;
  height: 96px;
  left: 10%;
  top: 20%;
  animation-delay: 0s;
}

.particle:nth-child(2) {
  width: 144px;
  height: 144px;
  right: 10%;
  top: 60%;
  background: radial-gradient(circle, var(--shadow-blue), transparent);
  animation-delay: 3s;
}

.particle:nth-child(3) {
  width: 80px;
  height: 80px;
  left: 50%;
  bottom: 20%;
  animation-delay: 6s;
}

.particle:nth-child(4) {
  width: 112px;
  height: 112px;
  left: 70%;
  top: 10%;
  background: radial-gradient(circle, var(--shadow-blue), transparent);
  animation-delay: 9s;
}

@keyframes floatParticle {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.3;
  }
  25% {
    transform: translate(50px, -80px) scale(1.2);
    opacity: 0.5;
  }
  50% {
    transform: translate(-30px, -150px) scale(0.8);
    opacity: 0.4;
  }
  75% {
    transform: translate(-60px, -80px) scale(1.1);
    opacity: 0.6;
  }
}

.container {
  position: relative;
  z-index: 10;
  max-width: 80rem;
  margin: 0 auto;
  padding: 40px 20px;
  animation: fadeIn 0.8s ease-out;
  width: 100%;
  box-sizing: border-box;
}

.header {
  text-align: center;
  margin-bottom: 64px;
  position: relative;
  animation: slideInDown 0.8s ease-out;
}

.logo-box {
  display: inline-flex;
  align-items: center;
  gap: 24px;
  padding: 20px 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px var(--shadow-orange);
  transition: all 0.3s ease-out;
}

.logo-box:hover {
  transform: translateY(-6px);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6), 0 0 60px var(--shadow-orange);
}

.icon-solar {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 10px 30px var(--shadow-orange), inset 0 0 20px rgba(255, 255, 255, 0.2);
  animation: pulse 2s ease-in-out infinite;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5)) contrast(1.5) brightness(1.2) saturate(1.3) sharpen(1);
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  transform: scale(1.1);
}

.title {
  font-size: 48px;
  font-weight: 900;
  background: linear-gradient(to bottom right,  #1f2c51);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
  text-shadow: 0 0 40px var(--shadow-orange);
  font-family: Montserrat, sans-serif;
}

.subtitle {
  font-size: 14px;
  color: #F5B027;
  font-weight: bold;   /* o 700 */
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: Montserrat, sans-serif;
}


.header-decoration {
  position: absolute;
  bottom: -32px;
  left: 50%;
  transform: translateX(-50%);
  width: 192px;
  height: 4px;
  background: linear-gradient(to right, transparent, #fb923c, #3b82f6, transparent);
  border-radius: 9999px;
  animation: shimmer 3s ease-in-out infinite;
}

.panels-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 40px;
  animation: slideInUp 0.8s ease-out 0.2s both;
  will-change: transform, opacity; /* Optimize for animation */
  width: 100%;
  box-sizing: border-box;
}

.panels-grid .full-width {
  grid-column: 1 / -1;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  animation: slideInUp 0.8s ease-out 0.2s both;
}

.grid > :nth-child(3) {
  grid-column: 1 / -1;
}

/* ========== RESPONSIVE BREAKPOINTS ========== */

/* ULTRA MÓVIL (360px) */
@media (max-width: 360px) {
  .container {
    padding: 12px 8px;
    max-width: 100%;
  }

  .header {
    margin-bottom: 16px;
  }

  .title {
    font-size: 20px;
  }

  .subtitle {
    font-size: 12px;
  }

  .logo-box {
    padding: 10px 16px;
    gap: 10px;
    flex-direction: column;
  }

  .icon-solar {
    width: 32px;
    height: 32px;
  }

  .icon-solar svg {
    width: 18px;
    height: 18px;
  }

  .header-decoration {
    width: 70px;
    height: 2px;
  }

  .panels-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 16px;
  }

  .grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .grid > :nth-child(3) {
    grid-column: 1;
  }

  .particles {
    display: none;
  }
}

/* MÓVIL PEQUEÑO (480px) */
@media (min-width: 361px) and (max-width: 480px) {
  .container {
    padding: 10px 8px;
  }

  .header {
    margin-bottom: 16px;
  }

  .title {
    font-size: 24px;
  }

  .subtitle {
    font-size: 11px;
  }

  .logo-box {
    padding: 10px 16px;
    gap: 10px;
  }

  .icon-solar {
    width: 32px;
    height: 32px;
  }

  .icon-solar svg {
    width: 18px;
    height: 18px;
  }

  .header-decoration {
    width: 80px;
    height: 2px;
  }

  .panels-grid {
    grid-template-columns: 1fr;
    gap: 10px;
    margin-bottom: 16px;
  }

  .grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .grid > :nth-child(3) {
    grid-column: 1;
  }

  .particles {
    display: none;
  }
}

/* MÓVIL GRANDE (640px) */
@media (min-width: 481px) and (max-width: 640px) {
  .container {
    padding: 16px 12px;
  }

  .header {
    margin-bottom: 24px;
  }

  .title {
    font-size: 30px;
  }

  .subtitle {
    font-size: 14px;
  }

  .logo-box {
    padding: 14px 28px;
    gap: 14px;
  }

  .icon-solar {
    width: 44px;
    height: 44px;
  }

  .icon-solar svg {
    width: 26px;
    height: 26px;
  }

  .header-decoration {
    width: 110px;
    height: 3px;
  }

  .panels-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }

  .grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .grid > :nth-child(3) {
    grid-column: 1;
  }

  .particles {
    display: none;
  }
}

/* TABLET (768px) */
@media (min-width: 641px) and (max-width: 1024px) {
  .container {
    padding: 16px 12px;
    max-width: 100%;
  }

  .header {
    margin-bottom: 24px;
  }

  .title {
    font-size: 28px;
  }

  .subtitle {
    font-size: 12px;
  }

  .logo-box {
    padding: 12px 24px;
    gap: 12px;
  }

  .icon-solar {
    width: 40px;
    height: 40px;
  }

  .icon-solar svg {
    width: 24px;
    height: 24px;
  }

  .header-decoration {
    width: 120px;
    height: 3px;
  }

  .panels-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .grid > :nth-child(3) {
    grid-column: 1;
  }
}

/* DESKTOP (1024px+) */
@media (min-width: 1025px) {
  /* Mantiene estilos originales */
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Prevent scrollbar flickering by ensuring consistent layout */
html, body {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}
</style>