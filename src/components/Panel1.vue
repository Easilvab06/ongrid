<template>
  <div class="panel1">
    <div class="relative z-10 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 items-center">
      <!-- Animación interactiva de energía circular -->
      <div class="energy-visualization mx-auto lg:mx-0">
        <svg viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg" class="w-64 h-64">
          <defs>
            <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
            </linearGradient>
            
            <filter id="glow-effect">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <!-- Círculos de energía concéntricos -->
          <g class="energy-rings">
            <circle cx="140" cy="140" r="110" fill="none" stroke="url(#energyGradient)" stroke-width="2" opacity="0.3" class="ring ring1"/>
            <circle cx="140" cy="140" r="95" fill="none" stroke="url(#energyGradient)" stroke-width="2" opacity="0.4" class="ring ring2"/>
            <circle cx="140" cy="140" r="80" fill="none" stroke="url(#energyGradient)" stroke-width="2" opacity="0.5" class="ring ring3"/>
          </g>
          
          <!-- Partículas orbitando -->
          <g class="orbit-particles">
            <circle r="6" fill="#10b981" filter="url(#glow-effect)" class="particle p1">
              <animateMotion dur="8s" repeatCount="indefinite">
                <mpath href="#orbit1"/>
              </animateMotion>
            </circle>
            <circle r="5" fill="#3b82f6" filter="url(#glow-effect)" class="particle p2">
              <animateMotion dur="10s" repeatCount="indefinite">
                <mpath href="#orbit2"/>
              </animateMotion>
            </circle>
            <circle r="4" fill="#8b5cf6" filter="url(#glow-effect)" class="particle p3">
              <animateMotion dur="12s" repeatCount="indefinite">
                <mpath href="#orbit3"/>
              </animateMotion>
            </circle>
            <circle r="5" fill="#f59e0b" filter="url(#glow-effect)" class="particle p4">
              <animateMotion dur="9s" repeatCount="indefinite">
                <mpath href="#orbit1"/>
              </animateMotion>
            </circle>
          </g>
          
          <!-- Órbitas invisibles -->
          <path id="orbit1" d="M 140,30 A 110,110 0 1,1 140,250 A 110,110 0 1,1 140,30" fill="none"/>
          <path id="orbit2" d="M 140,45 A 95,95 0 1,1 140,235 A 95,95 0 1,1 140,45" fill="none"/>
          <path id="orbit3" d="M 140,60 A 80,80 0 1,1 140,220 A 80,80 0 1,1 140,60" fill="none"/>
          
          <!-- Centro con ícono de rayo -->
          <circle cx="140" cy="140" r="50" fill="url(#energyGradient)" opacity="0.9" filter="url(#glow-effect)" class="center-orb"/>
          <circle cx="140" cy="140" r="42" fill="rgba(255,255,255,0.95)"/>
          
          <!-- Ícono de energía limpia -->
          <g transform="translate(140, 140)">
            <path d="M-8,-20 L-3,0 L-10,0 L5,20 L0,0 L7,0 Z" fill="url(#energyGradient)" class="energy-icon"/>
            <!-- Hojas de energía limpia -->
            <path d="M-15,-5 Q-20,-10 -18,-15 Q-15,-12 -15,-5" fill="#10b981" opacity="0.8" class="leaf leaf1"/>
            <path d="M15,-5 Q20,-10 18,-15 Q15,-12 15,-5" fill="#10b981" opacity="0.8" class="leaf leaf2"/>
          </g>
          
          <!-- Ondas de energía expansivas -->
          <g class="energy-waves">
            <circle cx="140" cy="140" r="50" fill="none" stroke="#10b981" stroke-width="2" opacity="0" class="wave w1"/>
            <circle cx="140" cy="140" r="50" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0" class="wave w2"/>
            <circle cx="140" cy="140" r="50" fill="none" stroke="#8b5cf6" stroke-width="2" opacity="0" class="wave w3"/>
          </g>
        </svg>
      </div>

      <!-- Contenido de texto interactivo -->
      <div class="welcome-content">
        <div class="greeting-section">
          <h2 class="greeting-text">Bienvenido,</h2>
          <div v-if="!isEditing" class="name-display" @click="startEditing">
            <span class="user-name">{{ displayName }}</span>
            <span class="edit-hint">✏️</span>
          </div>
          <input 
            v-else
            v-model="userName"
            @blur="stopEditing"
            @keyup.enter="stopEditing"
            ref="nameInput"
            class="name-input"
            type="text"
            placeholder="Tu nombre"
            maxlength="30"
          />
        </div>
        
        <p class="impact-message">
          Haz parte del <span class="highlight">cambio energético</span>
        </p>
        
        <!-- Estadísticas animadas -->
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-icon">📊</div>
            <div class="stat-value">{{ animatedProjects }}+</div>
            <div class="stat-label">Proyectos</div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">⚡</div>
            <div class="stat-value">{{ animatedMW }} MW</div>
            <div class="stat-label">Instalados</div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">📈</div>
            <div class="stat-value">{{ animatedCoverage }}%</div>
            <div class="stat-label">Cobertura</div>
          </div>
        </div>
      </div>

      <!-- Decoración de fondo -->
      <div class="panel-glow"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useCotizacionStore } from '../store/cotizacion.js'

const cotizacionStore = useCotizacionStore()

// Estado del nombre del usuario
const userName = computed({
  get: () => cotizacionStore.userName,
  set: (value) => { cotizacionStore.userName = value }
})
const isEditing = ref(false)
const nameInput = ref(null)

// Estadísticas animadas
const animatedProjects = ref(0)
const animatedMW = ref('0.00')
const animatedCoverage = ref(0)

// Nombre a mostrar
const displayName = computed(() => {
  return userName.value || 'Usuario'
})

// Función para iniciar edición
const startEditing = () => {
  isEditing.value = true
  nextTick(() => {
    nameInput.value?.focus()
  })
}

// Función para detener edición
const stopEditing = () => {
  isEditing.value = false
}

// Animar números al cargar
const animateNumber = (target, duration, callback) => {
  const start = 0
  const increment = target / (duration / 16)
  let current = 0
  
  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    callback(current)
  }, 16)
}

// Cargar datos al montar
onMounted(() => {
  // Animar estadísticas
  setTimeout(() => {
    animateNumber(350, 2000, (val) => { 
      animatedProjects.value = Math.floor(val)
    })
    animateNumber(7.50, 2000, (val) => { 
      animatedMW.value = val.toFixed(2)
    })
    animateNumber(90, 2000, (val) => { 
      animatedCoverage.value = Math.floor(val)
    })
  }, 500)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@reference "tailwindcss";

.panel1 {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  @apply p-0 shadow-lg min-h-[500px] h-full flex flex-col col-span-2 font-['Inter'];
}

.panel-content {
  @apply h-full flex flex-col;
}

.energy-visualization {
  @apply w-full max-w-64 h-auto;
}

.energy-visualization svg {
  @apply w-full h-auto block;
}

.ring {
  stroke-dasharray: 4, 4;
  animation: rotate-ring 20s linear infinite;
}

.ring1 { animation-duration: 20s; }
.ring2 {
  animation-duration: 15s;
  animation-direction: reverse;
}
.ring3 { animation-duration: 25s; }

.center-orb {
  animation: pulse-orb 3s ease-in-out infinite;
}

.energy-icon {
  animation: icon-glow 2s ease-in-out infinite;
}

.leaf {
  animation: leaf-sway 3s ease-in-out infinite;
}

.leaf1 { animation-delay: 0s; }
.leaf2 { animation-delay: 1.5s; }

.wave {
  animation: wave-expand 3s ease-out infinite;
}

.w1 { animation-delay: 0s; }
.w2 { animation-delay: 1s; }
.w3 { animation-delay: 2s; }

.welcome-content {
  text-align: center;
}

.greeting-section {
  margin-bottom: 24px;
}

.greeting-text {
  font-size: 4rem;
  font-weight: 300;
  color: #475569;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.name-display {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 300ms;
  background-color: rgba(254, 231, 205, 0.5);
}

.name-display:hover {
  background-color: rgba(254, 231, 205, 0.8);
  transform: translateX(4px);
}

.user-name {
  font-size: 3.75rem;
  font-weight: 900;
  background: linear-gradient(to bottom right, #f97316, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1px;
}

.edit-hint {
  font-size: 1.5rem;
  opacity: 0.5;
  transition: all 300ms;
}

.name-display:hover .edit-hint {
  opacity: 1;
  transform: scale(1.25);
}

.name-input {
  font-size: 3.75rem;
  font-weight: 900;
  background: linear-gradient(to bottom right, #1f2c51, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  border: none;
  border-bottom: 4px solid #1f2c51;
  outline: none;
  padding: 8px;
  width: 100%;
  max-width: 400px;
  letter-spacing: -1px;
  font-family: Montserrat, sans-serif;
}

.name-input::placeholder {
  color: rgba(249, 115, 22, 0.25);
}

.impact-message {
  font-size: 1.5rem;
  color: #374151;
  font-weight: 500;
  margin-bottom: 40px;
  line-height: 1.5;
}

.highlight {
  font-weight: bold;
  color: #059669;
  position: relative;
  padding-bottom: 4px;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(to right, #059669, #3b82f6);
  border-radius: 2px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 32px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background-color: rgba(254, 231, 205, 0.5);
  border-radius: 16px;
  transition: all 300ms;
  border: 2px solid rgba(254, 215, 170, 0.5);
}

.stat-item:hover {
  transform: translateY(-4px);
  background-color: rgba(254, 231, 205, 0.8);
  border-color: rgba(254, 215, 170, 0.8);
  box-shadow: 0 20px 25px -5px rgba(249, 115, 22, 0.2);
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 8px;
  animation: icon-bounce 2s ease-in-out infinite;
}

.stat-item:nth-child(1) .stat-icon { animation-delay: 0s; }
.stat-item:nth-child(2) .stat-icon { animation-delay: 0.3s; }
.stat-item:nth-child(3) .stat-icon { animation-delay: 0.6s; }

.stat-value {
  font-size: 1.875rem;
  font-weight: 900;
  background: linear-gradient(to bottom right, #059669, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.panel-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  pointer-events: none;
  background: radial-gradient(circle at 30% 50%, rgba(16, 185, 129, 0.08) 0%, transparent 50%);
  animation: rotate-glow 25s linear infinite;
}

@keyframes rotate-ring {
  from {
    transform: rotate(0deg);
    transform-origin: 140px 140px;
  }
  to {
    transform: rotate(360deg);
    transform-origin: 140px 140px;
  }
}

@keyframes pulse-orb {
  0%, 100% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}

@keyframes icon-glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes leaf-sway {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(10deg); }
}

@keyframes wave-expand {
  0% {
    r: 50;
    opacity: 0.8;
  }
  100% {
    r: 120;
    opacity: 0;
  }
}

@keyframes icon-bounce {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

@keyframes rotate-glow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive design */
@media (max-width: 1024px) {
  .energy-visualization {
    margin-left: auto;
    margin-right: auto;
  }

  .welcome-content {
    text-align: center;
  }

  .name-display {
    justify-content: center;
  }

  .greeting-text {
    font-size: 2rem;
  }

  .user-name {
    font-size: 2.5rem;
  }

  .name-input {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .greeting-text {
    font-size: 2rem;
  }

  .user-name, .name-input {
    font-size: 2.25rem;
  }

  .impact-message {
    font-size: 1.125rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .stat-value {
    font-size: 1.5rem;
  }
}
</style>
