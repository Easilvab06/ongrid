<template>
  <div class="panel1">
    <div class="panel-content">
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
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');

.panel1 {
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

.panel1:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 30px 80px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(245, 176, 39, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 1);
}

.panel-content {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 50px;
  align-items: center;
}

/* Visualización de energía */
.energy-visualization {
  width: 100%;
  max-width: 280px;
  height: auto;
}

.energy-visualization svg {
  width: 100%;
  height: auto;
}

/* Anillos de energía */
.ring {
  stroke-dasharray: 4, 4;
  animation: rotate-ring 20s linear infinite;
}

.ring1 { animation-duration: 20s; }
.ring2 { animation-duration: 15s; animation-direction: reverse; }
.ring3 { animation-duration: 25s; }

@keyframes rotate-ring {
  from { transform: rotate(0deg); transform-origin: 140px 140px; }
  to { transform: rotate(360deg); transform-origin: 140px 140px; }
}

/* Orbe central */
.center-orb {
  animation: pulse-orb 3s ease-in-out infinite;
}

@keyframes pulse-orb {
  0%, 100% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.05); opacity: 1; }
}

/* Ícono de energía */
.energy-icon {
  animation: icon-glow 2s ease-in-out infinite;
}

@keyframes icon-glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Hojas verdes */
.leaf {
  animation: leaf-sway 3s ease-in-out infinite;
}

.leaf1 { animation-delay: 0s; }
.leaf2 { animation-delay: 1.5s; }

@keyframes leaf-sway {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(10deg); }
}

/* Ondas de energía */
.wave {
  animation: wave-expand 3s ease-out infinite;
}

.w1 { animation-delay: 0s; }
.w2 { animation-delay: 1s; }
.w3 { animation-delay: 2s; }

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

/* Contenido de bienvenida */
.welcome-content {
  text-align: left;
}

.greeting-section {
  margin-bottom: 24px;
}

.greeting-text {
  font-size: 42px;
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
  transition: all 0.3s ease;
  background: rgba(245, 176, 39, 0.05);
}

.name-display:hover {
  background: rgba(245, 176, 39, 0.15);
  transform: translateX(5px);
}

.user-name {
  font-size: 52px;
  font-weight: 800;
  background: linear-gradient(135deg, #F5B027, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1px;
}

.edit-hint {
  font-size: 24px;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.name-display:hover .edit-hint {
  opacity: 1;
  transform: scale(1.2);
}

.name-input {
  font-size: 52px;
  font-weight: 800;
  font-family: 'Montserrat', sans-serif;
  background: linear-gradient(135deg, #F5B027, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  border: none;
  border-bottom: 3px solid #F5B027;
  outline: none;
  padding: 8px;
  width: 100%;
  max-width: 400px;
  letter-spacing: -1px;
}

.name-input::placeholder {
  -webkit-text-fill-color: rgba(245, 176, 39, 0.4);
}

.impact-message {
  font-size: 24px;
  color: #334155;
  font-weight: 500;
  margin-bottom: 40px;
  line-height: 1.4;
}

.highlight {
  font-weight: 700;
  color: #10b981;
  position: relative;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #10b981, #3b82f6);
  border-radius: 2px;
}

/* Grid de estadísticas */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 32px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: rgba(245, 176, 39, 0.05);
  border-radius: 16px;
  transition: all 0.3s ease;
  border: 2px solid rgba(245, 176, 39, 0.1);
}

.stat-item:hover {
  transform: translateY(-5px);
  background: rgba(245, 176, 39, 0.1);
  border-color: rgba(245, 176, 39, 0.3);
  box-shadow: 0 10px 30px rgba(245, 176, 39, 0.2);
}

.stat-icon {
  font-size: 32px;
  margin-bottom: 8px;
  animation: icon-bounce 2s ease-in-out infinite;
}

.stat-item:nth-child(1) .stat-icon { animation-delay: 0s; }
.stat-item:nth-child(2) .stat-icon { animation-delay: 0.3s; }
.stat-item:nth-child(3) .stat-icon { animation-delay: 0.6s; }

@keyframes icon-bounce {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

.stat-value {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #10b981, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.panel-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at 30% 50%,
    rgba(16, 185, 129, 0.08) 0%,
    transparent 50%
  );
  animation: rotate-glow 25s linear infinite;
  pointer-events: none;
}

@keyframes rotate-glow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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

@media (max-width: 1200px) {
  .panel-content {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }

  .energy-visualization {
    margin: 0 auto;
  }

  .welcome-content {
    text-align: center;
  }

  .name-display {
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .panel1 {
    padding: 32px 24px;
    min-height: 450px;
  }

  .greeting-text {
    font-size: 32px;
  }

  .user-name, .name-input {
    font-size: 38px;
  }

  .impact-message {
    font-size: 20px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .stat-value {
    font-size: 28px;
  }
}
</style>