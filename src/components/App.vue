<template>
  <!-- ── LOGIN GATE ── -->
  <LoginView v-if="!isAuthenticated" @login-success="onLoginSuccess" />

  <!-- ── APP PRINCIPAL ── -->
  <div v-else class="app-wrapper">
    <!-- Botón de Exportar PDF -->
    <button 
      @click="exportToPdf" 
      class="print-button no-print"
      :class="{ 'printing': isPrinting }"
      :disabled="isPrinting"
    >
      <svg v-if="!isPrinting" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="printer-icon">
        <polyline points="6 9 6 2 18 2 18 9"></polyline>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
        <rect x="6" y="14" width="12" height="8"></rect>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spinner-icon">
        <circle cx="12" cy="12" r="10"></circle>
      </svg>
      <span>{{ isPrinting ? 'Preparando...' : 'Exportar PDF' }}</span>
    </button>

    <!-- Partículas flotantes -->
    <div class="particles fixed top-0 left-0 right-0 bottom-0 overflow-hidden z-0 pointer-events-none no-print">
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
    </div>

    <main class="container" ref="contentRef">
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
        <div class="header-decoration no-print"></div>
      </header>

      <div class="panels-grid">
        <Panel1 />
        <Panel6 class="full-width"/>
        <Panel2 />
        <Panel9 class="full-width"/>
        <Panel3 />
        <Panel8 class="full-width"/>
        <Panel4 class="full-width"/>
        <Panel5/>
        <Panel7 />
      </div>

      <div class="grid">
        <Cotizador ref="cotizadorRef" />
        <ImageEditor ref="imageEditorRef" />
        <RegistroCotizaciones class="no-print" />
        <PdfPreview ref="pdfPreviewRef" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LoginView from './components/LoginView.vue'
import Panel1 from './components/Panel1.vue'
import Panel6 from './components/Panel6.vue'
import Panel2 from './components/Panel2.vue'
import Panel9 from './components/Panel9.vue'
import Panel8 from './components/Panel8.vue'
import Panel3 from './components/Panel3.vue'
import Panel4 from './components/Panel4.vue'
import Panel5 from './components/Panel5.vue'
import Panel7 from './components/Panel7.vue'
import RegistroCotizaciones from './components/RegistroCotizaciones.vue'
import { useCotizacionStore } from './store/cotizacion.js'
import logoSrc from './assets/logo10.png'

const cotizacionStore = useCotizacionStore()
const cotizadorRef    = ref(null)
const imageEditorRef  = ref(null)
const pdfPreviewRef   = ref(null)
const contentRef      = ref(null)
const isPrinting      = ref(false)

// ── Autenticación ──────────────────────────────────────────────────────────
const urlParams    = new URLSearchParams(window.location.search)
const isSharedLink = urlParams.has('d') || urlParams.has('data')

const isAuthenticated = ref(
  isSharedLink || sessionStorage.getItem('soinsolar_auth') === '1'
)

const onLoginSuccess = () => {
  isAuthenticated.value = true
}

// ── Exportar PDF ──────────────────────────────────────────────────────────
const exportToPdf = () => {
  if (isPrinting.value) return
  isPrinting.value = true
  setTimeout(() => {
    window.print()
    setTimeout(() => { isPrinting.value = false }, 500)
  }, 300)
}

// helpers btoa/atob seguros para Unicode
const _fromB64 = (b64) => decodeURIComponent(escape(atob(b64)))

// ── onMounted ──────────────────────────────────────────────────────────────
onMounted(() => {
  const isNew = urlParams.has('d')
  const isOld = urlParams.has('data')
  if (isNew || isOld) {
    try {
      let data
      if (isNew) {
        data = JSON.parse(_fromB64(urlParams.get('d')))
      } else {
        data = JSON.parse(decodeURIComponent(urlParams.get('data')))
      }
      // Guardar imágenes en localStorage para que Panel5 las encuentre
      if (data.images && Array.isArray(data.images) && data.images.length > 0) {
        localStorage.setItem('sharedImages', JSON.stringify(data.images))
      }
    } catch (error) {
      console.error('Error loading data from URL:', error)
    }
  }
})
</script>

<style scoped>
.print-button {
  position: fixed; top: 24px; right: 24px; z-index: 1000;
  display: flex; align-items: center; gap: 10px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #F5B027 0%, #f59e0b 100%);
  color: white; border: none; border-radius: 12px;
  font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(245,176,39,0.4), 0 2px 8px rgba(0,0,0,0.2);
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
}
.print-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 28px rgba(245,176,39,0.5), 0 4px 12px rgba(0,0,0,0.3);
}
.print-button:active:not(:disabled) { transform: translateY(0); }
.print-button:disabled { opacity: 0.7; cursor: not-allowed; }
.print-button.printing { background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%); }
.printer-icon, .spinner-icon { width: 20px; height: 20px; stroke-width: 2.5; }
.spinner-icon { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.print-button span { white-space: nowrap; }

@media (max-width: 768px) {
  .print-button { top: 16px; right: 16px; padding: 10px 18px; font-size: 13px; }
  .printer-icon, .spinner-icon { width: 18px; height: 18px; }
}
@media (max-width: 480px) {
  .print-button { top: 12px; right: 12px; padding: 8px 14px; }
  .print-button span { display: none; }
}

.app-wrapper { position: relative; z-index: 10; min-height: 100vh; overflow: hidden; }

.particles {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  overflow: hidden; z-index: 0; pointer-events: none;
}
.particle {
  position: absolute; border-radius: 9999px;
  animation: floatParticle 15s infinite ease-in-out;
  background: radial-gradient(circle, var(--shadow-orange), transparent);
}
.particle:nth-child(1) { width: 96px;  height: 96px;  left: 10%;  top: 20%;    animation-delay: 0s; }
.particle:nth-child(2) { width: 144px; height: 144px; right: 10%; top: 60%;    background: radial-gradient(circle, var(--shadow-blue), transparent); animation-delay: 3s; }
.particle:nth-child(3) { width: 80px;  height: 80px;  left: 50%;  bottom: 20%; animation-delay: 6s; }
.particle:nth-child(4) { width: 112px; height: 112px; left: 70%;  top: 10%;    background: radial-gradient(circle, var(--shadow-blue), transparent); animation-delay: 9s; }

@keyframes floatParticle {
  0%,100% { transform: translate(0,0) scale(1);            opacity: 0.3; }
  25%      { transform: translate(50px,-80px) scale(1.2);  opacity: 0.5; }
  50%      { transform: translate(-30px,-150px) scale(0.8);opacity: 0.4; }
  75%      { transform: translate(-60px,-80px) scale(1.1); opacity: 0.6; }
}

.container {
  position: relative; z-index: 10; max-width: 110rem;
  margin: 0 auto; padding: 64px 32px;
  animation: fadeIn 0.8s ease-out; width: 100%; box-sizing: border-box;
}

.header { text-align: center; margin-bottom: 64px; position: relative; animation: slideInDown 0.8s ease-out; }

.logo-box {
  display: inline-flex; align-items: center; gap: 24px;
  padding: 20px 40px;
  background: rgba(255,255,255,0.1); backdrop-filter: blur(12px);
  border-radius: 24px; border: 1px solid rgba(255,255,255,0.2);
  box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 40px var(--shadow-orange);
  transition: all 0.3s ease-out;
}
.logo-box:hover { transform: translateY(-6px); box-shadow: 0 30px 80px rgba(0,0,0,0.6), 0 0 60px var(--shadow-orange); }

.icon-solar {
  width: 80px; height: 80px; background: white; border-radius: 20px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 10px 30px var(--shadow-orange), inset 0 0 20px rgba(255,255,255,0.2);
  animation: pulse 2s ease-in-out infinite;
}

/* ── Filtro ND2 ── */
.logo-image {
  width: 100%; height: 100%; object-fit: contain;
  filter: brightness(0.85) contrast(1.0) saturate(0.95)
          drop-shadow(0 0 8px rgba(255,255,255,0.2));
  image-rendering: crisp-edges; transform: scale(1.1);
}

.title {
  font-size: 48px; font-weight: 900;
  background: linear-gradient(to bottom right, #1f2c51);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  letter-spacing: -0.02em; margin-bottom: 8px;
  font-family: Montserrat, sans-serif;
}

.subtitle {
  font-size: 14px; color: #F5B027; font-weight: bold;
  text-transform: uppercase; letter-spacing: 0.1em; font-family: Montserrat, sans-serif;
}

.header-decoration {
  position: absolute; bottom: -32px; left: 50%; transform: translateX(-50%);
  width: 192px; height: 4px;
  background: linear-gradient(to right, transparent, #fb923c, #3b82f6, transparent);
  border-radius: 9999px; animation: shimmer 3s ease-in-out infinite;
}

.panels-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;
  margin-bottom: 40px; animation: slideInUp 0.8s ease-out 0.2s both;
  width: 100%; box-sizing: border-box;
}
.panels-grid .full-width { grid-column: 1 / -1; }

.grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px;
  animation: slideInUp 0.8s ease-out 0.2s both;
}
.grid > :nth-child(3) { grid-column: 1 / -1; }
.grid > :nth-child(4) { grid-column: 1 / -1; }

@media (max-width: 1200px) { .container { padding: 32px 20px; } .panels-grid { gap: 18px; } .grid { gap: 28px; } }
@media (max-width: 1024px) {
  .container { padding: 24px 16px; } .header { margin-bottom: 28px; }
  .title { font-size: 36px; } .logo-box { padding: 16px 32px; gap: 16px; }
  .icon-solar { width: 64px; height: 64px; }
  .panels-grid { grid-template-columns: 1fr; gap: 16px; }
  .grid { grid-template-columns: 1fr; gap: 24px; } .grid > :nth-child(3) { grid-column: 1; }
}
@media (max-width: 768px) {
  .container { padding: 20px 16px; } .title { font-size: 28px; }
  .logo-box { padding: 12px 24px; gap: 12px; } .icon-solar { width: 48px; height: 48px; }
  .panels-grid { grid-template-columns: 1fr; gap: 14px; } .grid { gap: 20px; }
}
@media (max-width: 640px) {
  .container { padding: 16px 12px; } .title { font-size: 24px; }
  .logo-box { flex-direction: column; padding: 14px 20px; gap: 10px; text-align: center; }
  .icon-solar { width: 50px; height: 50px; }
}
@media (max-width: 480px) {
  .container { padding: 12px 8px; } .title { font-size: 20px; }
  .logo-box { padding: 10px 16px; gap: 8px; } .icon-solar { width: 40px; height: 40px; }
  .particles { display: none; }
}
@media (max-width: 360px) {
  .container { padding: 10px 6px; } .title { font-size: 18px; }
  .logo-box { padding: 8px 12px; gap: 6px; } .icon-solar { width: 32px; height: 32px; }
}

@keyframes fadeIn      { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideInUp   { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideInDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse       { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
@keyframes shimmer     { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }

html, body { overflow-y: auto; overflow-x: hidden; height: 100%; }
</style>

<style>
@media print {
  .no-print, .print-button, .particles { display: none !important; }
  body { background: white !important; }
  .app-wrapper { background: white !important; }
  .container { max-width: 100% !important; padding: 20px !important; margin: 0 !important; }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
  .panels-grid > *, .grid > * { page-break-inside: avoid !important; break-inside: avoid !important; }
  @page { margin: 1.5cm; size: A4 portrait; }
  img { max-width: 100% !important; page-break-inside: avoid !important; }
  *, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }
  body { font-size: 12pt !important; line-height: 1.5 !important; }
  h1 { font-size: 24pt !important; } h2 { font-size: 20pt !important; }
  h3 { font-size: 16pt !important; } h4 { font-size: 14pt !important; }
  .panel1,.panel2,.panel3,.panel4,.panel5,.panel6,.panel7,.panel8,.panel9 {
    background-color: #1e293b !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;
  }
  .logo-box:hover { transform: none !important; }
  .panel8 { page-break-inside: avoid !important; }
  .chart-container { min-height: 400px !important; height: auto !important; overflow: visible !important; }
  .chart-container canvas { max-height: 380px !important; height: 380px !important; width: 100% !important; }
  .chart-content, .bars-wrapper, .panel8 .relative { overflow: visible !important; }
  .bars-wrapper { min-width: 100% !important; }
  .bar, .bar-group { page-break-inside: avoid !important; }
}
</style>