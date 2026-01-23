<template>
  <div class="app-wrapper">
    <!-- Partículas flotantes -->
    <div class="particles">
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          </div>
          <div>
            <h1 class="title">Soinsolar</h1>
            <p class="subtitle">Cotizador Profesional de Energía Solar</p>
          </div>
        </div>
        <div class="header-decoration"></div>
      </header>

      <!-- Paneles Informativos -->
      <div class="panels-grid">
        <Panel1 />
        <Panel6/>
        <Panel2 />
         <Panel3 />
         <Panel4/>
          <Panel5/>
           
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
import { ref } from 'vue'
import Panel1 from './components/Panel1.vue'
import Panel6 from './components/Panel6.vue'
import Panel2 from './components/Panel2.vue'
import Panel3 from './components/Panel3.vue'
import Panel4 from './components/Panel4.vue'
import Panel5 from './components/Panel5.vue'


const cotizadorRef = ref(null)
const imageEditorRef = ref(null)
const pdfPreviewRef = ref(null)
</script>

<style scoped>
.app-wrapper {
  position: relative;
  z-index: 1;
  min-height: 100vh;
}

.particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, var(--shadow-orange), transparent);
  animation: floatParticle 15s infinite ease-in-out;
}

.particle:nth-child(1) {
  width: 100px;
  height: 100px;
  left: 10%;
  top: 20%;
  animation-delay: 0s;
}

.particle:nth-child(2) {
  width: 150px;
  height: 150px;
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
  width: 120px;
  height: 120px;
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
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  animation: fadeIn 0.8s ease-out;
}

.header {
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  animation: slideInDown 0.8s ease-out;
}

.logo-box {
  display: inline-flex;
  align-items: center;
  gap: 24px;
  padding: 20px 40px;
  background: var(--card);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid var(--border);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 40px var(--shadow-orange);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-box:hover {
  transform: translateY(-5px);
  box-shadow: 
    0 30px 80px rgba(0, 0, 0, 0.6),
    0 0 60px var(--shadow-orange);
}

.icon-solar {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, var(--soinsolar-orange), var(--soinsolar-orange-dark));
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 
    0 10px 30px var(--shadow-orange),
    inset 0 0 20px rgba(255, 255, 255, 0.2);
  animation: pulse 2s ease-in-out infinite;
}

.icon-solar svg {
  width: 40px;
  height: 40px;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
}

.title {
  font-size: 48px;
  font-weight: 900;
  background: linear-gradient(135deg, var(--soinsolar-orange), var(--soinsolar-blue));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1px;
  margin-bottom: 8px;
  text-shadow: 0 0 40px var(--shadow-orange);
}

.subtitle {
  font-size: 14px;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.header-decoration {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 4px;
  background: linear-gradient(90deg, transparent, var(--soinsolar-orange), var(--soinsolar-blue), transparent);
  border-radius: 2px;
  animation: shimmer 3s ease-in-out infinite;
}

.panels-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 40px;
  animation: slideInUp 0.8s ease-out 0.2s both;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  animation: slideInUp 0.8s ease-out 0.2s both;
}

.grid > :nth-child(3) {
  grid-column: 1 / -1;
}

@media (max-width: 1024px) {
  .panels-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }

  .grid {
    grid-template-columns: 1fr;
  }
  
  .grid > :nth-child(3) {
    grid-column: 1;
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 36px;
  }
  
  .logo-box {
    padding: 15px 30px;
    gap: 16px;
  }
  
  .icon-solar {
    width: 50px;
    height: 50px;
  }
  
  .icon-solar svg {
    width: 28px;
    height: 28px;
  }

  .panels-grid {
    grid-template-columns: 1fr;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
</style>