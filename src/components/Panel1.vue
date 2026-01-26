<template>
  <div class="bg-gradient-to-br from-white via-white to-orange-50/30 backdrop-blur-xl rounded-3xl p-12 shadow-2xl shadow-orange-500/10 border border-orange-200/20 hover:shadow-3xl hover:shadow-orange-500/20 hover:-translate-y-2 transition-all duration-500 ease-out animate-slideInUp min-h-[500px] h-full flex flex-col justify-center grid-cols-2 font-montserrat relative overflow-hidden">
    <div class="relative z-10 grid grid-cols-[300px_1fr] gap-12 items-center">
      <!-- Animación interactiva de energía circular -->
      <div class="energy-visualization">
        <svg viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg">
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
            
            <clipPath id="circle-clip">
              <circle cx="140" cy="140" r="100"/>
            </clipPath>
          </defs>
          
          <!-- Círculos de energía concéntricos -->
          <g class="energy-rings">
            <circle cx="140" cy="140" r="110" fill="none" stroke="url(#energyGradient)" 
                    stroke-width="2" opacity="0.3" class="ring ring1"/>
            <circle cx="140" cy="140" r="95" fill="none" stroke="url(#energyGradient)" 
                    stroke-width="2" opacity="0.4" class="ring ring2"/>
            <circle cx="140" cy="140" r="80" fill="none" stroke="url(#energyGradient)" 
                    stroke-width="2" opacity="0.5" class="ring ring3"/>
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
            <path d="M-8,-20 L-3,0 L-10,0 L5,20 L0,0 L7,0 Z" 
                  fill="url(#energyGradient)" class="energy-icon"/>
            <!-- Hojas de energía limpia -->
            <path d="M-15,-5 Q-20,-10 -18,-15 Q-15,-12 -15,-5" fill="#10b981" opacity="0.8" class="leaf leaf1"/>
            <path d="M15,-5 Q20,-10 18,-15 Q15,-12 15,-5" fill="#10b981" opacity="0.8" class="leaf leaf2"/>
          </g>
          
          <!-- Ondas de energía expansivas -->
          <g class="energy-waves">
            <circle cx="140" cy="140" r="50" fill="none" stroke="#10b981" 
                    stroke-width="2" opacity="0" class="wave w1"/>
            <circle cx="140" cy="140" r="50" fill="none" stroke="#3b82f6" 
                    stroke-width="2" opacity="0" class="wave w2"/>
            <circle cx="140" cy="140" r="50" fill="none" stroke="#8b5cf6" 
                    stroke-width="2" opacity="0" class="wave w3"/>
          </g>
        </svg>
      </div>

      <!-- Contenido de texto interactivo -->
      <div class="welcome-content">
        <div class="greeting-section">
          <h2 class="greeting-text">Bienvenido,</h2>
          <div class="name-display" v-if="!isEditing" @click="startEditing">
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

// Estado del nombre del usuario
const userName = ref('')
const isEditing = ref(false)
const nameInput = ref(null)

// Estadísticas animadas
const animatedProjects = ref(0)
const animatedMW = ref(0)
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
  // Aquí podrías guardar en localStorage o enviar al backend
  if (userName.value) {
    localStorage.setItem('soinsolar_username', userName.value)
  }
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
    callback(Math.floor(current))
  }, 16)
}

// Cargar datos al montar
onMounted(() => {
  // Cargar nombre desde localStorage
  const savedName = localStorage.getItem('soinsolar_username')
  if (savedName) {
    userName.value = savedName
  }
  
  // Animar estadísticas
  setTimeout(() => {
    animateNumber(350, 2000, (val) => { animatedProjects.value = val })
    animateNumber(7.50, 2000, (val) => { animatedMW.value = val.toFixed(2) })
    animateNumber(90, 2000, (val) => { animatedCoverage.value = val })
  }, 500)
})
</script>

<style scoped>
@import "tailwindcss";

/* Custom animations for energy visualization */
@layer components {
  .energy-visualization {
    @apply w-full max-w-[280px] h-auto;
  }

  .energy-visualization svg {
    @apply w-full h-auto;
  }

  .ring {
    stroke-dasharray: 4, 4;
    animation: rotate-ring 20s linear infinite;
  }

  .ring1 { animation-duration: 20s; }
  .ring2 { animation-duration: 15s; animation-direction: reverse; }
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
    @apply text-left;
  }

  .greeting-section {
    @apply mb-6;
  }

  .greeting-text {
    @apply text-5xl font-light text-slate-600 mb-2 -tracking-[0.5px];
  }

  .name-display {
    @apply inline-flex items-center gap-3 cursor-pointer py-2 px-4 rounded-xl transition-all duration-300 bg-orange-50/50 hover:bg-orange-100/80 hover:translate-x-1;
  }

  .user-name {
    @apply text-6xl font-black bg-gradient-to-br from-orange-500 to-amber-500 bg-clip-text text-transparent -tracking-[1px];
  }

  .edit-hint {
    @apply text-2xl opacity-50 transition-all duration-300;
  }

  .name-display:hover .edit-hint {
    @apply opacity-100 scale-125;
  }

  .name-input {
    @apply text-6xl font-black font-montserrat bg-gradient-to-br from-orange-500 to-amber-500 bg-clip-text text-transparent border-none border-b-4 border-orange-500 outline-none p-2 w-full max-w-[400px] -tracking-[1px];
  }

  .name-input::placeholder {
    @apply text-orange-400/40;
  }

  .impact-message {
    @apply text-2xl text-slate-700 font-medium mb-10 leading-relaxed;
  }

  .highlight {
    @apply font-bold text-emerald-600 relative;
  }

  .highlight::after {
    content: '';
    @apply absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-sm;
  }

  .stats-grid {
    @apply grid grid-cols-3 gap-5 mt-8;
  }

  .stat-item {
    @apply text-center p-5 bg-orange-50/50 rounded-2xl transition-all duration-300 border-2 border-orange-200/50 hover:-translate-y-1 hover:bg-orange-100/80 hover:border-orange-300/80 hover:shadow-xl hover:shadow-orange-500/20;
  }

  .stat-icon {
    @apply text-4xl mb-2;
    animation: icon-bounce 2s ease-in-out infinite;
  }

  .stat-item:nth-child(1) .stat-icon { animation-delay: 0s; }
  .stat-item:nth-child(2) .stat-icon { animation-delay: 0.3s; }
  .stat-item:nth-child(3) .stat-icon { animation-delay: 0.6s; }

  .stat-value {
    @apply text-4xl font-black bg-gradient-to-br from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-1;
  }

  .stat-label {
    @apply text-xs text-slate-500 font-semibold uppercase tracking-wider;
  }

  .panel-glow {
    @apply absolute -top-1/2 -left-1/2 w-[200%] h-[200%] pointer-events-none;
    background: radial-gradient(circle at 30% 50%, rgba(16, 185, 129, 0.08) 0%, transparent 50%);
    animation: rotate-glow 25s linear infinite;
  }
}

@keyframes rotate-ring {
  from { transform: rotate(0deg); transform-origin: 140px 140px; }
  to { transform: rotate(360deg); transform-origin: 140px 140px; }
}

@keyframes pulse-orb {
  0%, 100% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.05); opacity: 1; }
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
  0% { r: 50; opacity: 0.8; }
  100% { r: 120; opacity: 0; }
}

@keyframes icon-bounce {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

@keyframes rotate-glow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes slideInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive design */
@media (max-width: 1200px) {
  .panel-content {
    @apply grid-cols-1 gap-10 text-center;
  }

  .energy-visualization {
    @apply mx-auto;
  }

  .welcome-content {
    @apply text-center;
  }

  .name-display {
    @apply justify-center;
  }

  .stats-grid {
    @apply grid-cols-3;
  }
}

@media (max-width: 768px) {
  .panel1 {
    @apply p-8 min-h-[450px];
  }

  .greeting-text {
    @apply text-4xl;
  }

  .user-name, .name-input {
    @apply text-5xl;
  }

  .impact-message {
    @apply text-xl;
  }

  .stats-grid {
    @apply grid-cols-1 gap-4;
  }

  .stat-value {
    @apply text-3xl;
  }
}
</style>
