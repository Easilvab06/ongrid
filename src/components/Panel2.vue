<template>
  <div class="panel2">
    <div class="panel-content">
      <!-- Animación de sistema solar profesional -->
      <div class="solar-animation">
        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <!-- Gradientes profesionales -->
            <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
            </linearGradient>
            
            <linearGradient id="panelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#1e3a8a;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
            </linearGradient>
            
            <linearGradient id="houseWall" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#f1f5f9;stop-opacity:1" />
            </linearGradient>
            
            <linearGradient id="roofGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#475569;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#334155;stop-opacity:1" />
            </linearGradient>
            
            <filter id="shadow">
              <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.3"/>
            </filter>
            
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <!-- Sol minimalista y profesional -->
          <g class="sun-pro">
            <circle cx="200" cy="80" r="32" fill="url(#sunGradient)" opacity="0.95" filter="url(#shadow)"/>
            <circle cx="200" cy="80" r="28" fill="#fef3c7" opacity="0.8"/>
            
            <!-- Rayos minimalistas -->
            <g class="sun-rays-pro">
              <line x1="200" y1="38" x2="200" y2="20" stroke="#fbbf24" stroke-width="6" stroke-linecap="round" opacity="1" class="ray-modern r1"/>
              <line x1="236" y1="56" x2="250" y2="42" stroke="#fbbf24" stroke-width="6" stroke-linecap="round" opacity="1" class="ray-modern r2"/>
              <line x1="254" y1="80" x2="272" y2="80" stroke="#fbbf24" stroke-width="6" stroke-linecap="round" opacity="1" class="ray-modern r3"/>
              <line x1="236" y1="104" x2="250" y2="118" stroke="#fbbf24" stroke-width="6" stroke-linecap="round" opacity="1" class="ray-modern r4"/>
              <line x1="200" y1="122" x2="200" y2="140" stroke="#fbbf24" stroke-width="6" stroke-linecap="round" opacity="1" class="ray-modern r8"/>
              <line x1="164" y1="56" x2="150" y2="42" stroke="#fbbf24" stroke-width="6" stroke-linecap="round" opacity="1" class="ray-modern r5"/>
              <line x1="146" y1="80" x2="128" y2="80" stroke="#fbbf24" stroke-width="6" stroke-linecap="round" opacity="1" class="ray-modern r6"/>
              <line x1="164" y1="104" x2="150" y2="118" stroke="#fbbf24" stroke-width="6" stroke-linecap="round" opacity="1" class="ray-modern r7"/>
            </g>
          </g>
          
          <!-- Conexiones de energía elegantes -->
          <g class="energy-connections">
            <path d="M200,112 L140,180" stroke="#60a5fa" stroke-width="2" fill="none" 
                  stroke-dasharray="6,4" opacity="0" class="energy-path ep1" stroke-linecap="round"/>
            <path d="M200,112 L200,180" stroke="#60a5fa" stroke-width="2" fill="none" 
                  stroke-dasharray="6,4" opacity="0" class="energy-path ep2" stroke-linecap="round"/>
            <path d="M200,112 L260,180" stroke="#60a5fa" stroke-width="2" fill="none" 
                  stroke-dasharray="6,4" opacity="0" class="energy-path ep3" stroke-linecap="round"/>
                  
            <!-- Puntos de energía -->
            <circle cx="140" cy="180" r="4" fill="#60a5fa" opacity="0" class="energy-point ep1" filter="url(#glow)"/>
            <circle cx="200" cy="180" r="4" fill="#60a5fa" opacity="0" class="energy-point ep2" filter="url(#glow)"/>
            <circle cx="260" cy="180" r="4" fill="#60a5fa" opacity="0" class="energy-point ep3" filter="url(#glow)"/>
          </g>
          
          <!-- Sistema de paneles solares isométrico profesional -->
          <g class="solar-panel-system" filter="url(#shadow)">
            <!-- Panel principal central -->
            <g transform="translate(155, 185)">
              <!-- Superficie del panel -->
              <rect width="90" height="50" rx="3" fill="url(#panelGradient)" stroke="#0f172a" stroke-width="2"/>
              
              <!-- Grid profesional -->
              <line x1="30" y1="0" x2="30" y2="50" stroke="#334155" stroke-width="1.2" opacity="0.4"/>
              <line x1="60" y1="0" x2="60" y2="50" stroke="#334155" stroke-width="1.2" opacity="0.4"/>
              <line x1="0" y1="16.7" x2="90" y2="16.7" stroke="#334155" stroke-width="1.2" opacity="0.4"/>
              <line x1="0" y1="33.4" x2="90" y2="33.4" stroke="#334155" stroke-width="1.2" opacity="0.4"/>
              
              <!-- Celdas fotovoltaicas con brillo -->
              <rect x="5" y="5" width="24" height="11" fill="#2563eb" opacity="0.7" class="solar-cell sc1" rx="1"/>
              <rect x="33" y="5" width="24" height="11" fill="#2563eb" opacity="0.7" class="solar-cell sc2" rx="1"/>
              <rect x="61" y="5" width="24" height="11" fill="#2563eb" opacity="0.7" class="solar-cell sc3" rx="1"/>
              
              <rect x="5" y="19.5" width="24" height="11" fill="#2563eb" opacity="0.7" class="solar-cell sc4" rx="1"/>
              <rect x="33" y="19.5" width="24" height="11" fill="#2563eb" opacity="0.7" class="solar-cell sc5" rx="1"/>
              <rect x="61" y="19.5" width="24" height="11" fill="#2563eb" opacity="0.7" class="solar-cell sc6" rx="1"/>
              
              <!-- Reflejos realistas -->
              <rect x="2" y="2" width="40" height="20" fill="url(#reflection)" opacity="0.3" rx="2"/>
              <defs>
                <linearGradient id="reflection" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.6" />
                  <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />
                </linearGradient>
              </defs>
              
              <!-- Marco metálico -->
              <rect width="90" height="50" rx="3" fill="none" stroke="#64748b" stroke-width="2.5" opacity="0.8"/>
            </g>
          </g>
          
          <!-- Casa moderna y profesional -->
          <g class="modern-house" filter="url(#shadow)">
            <!-- Estructura principal -->
            <rect x="230" y="250" width="100" height="80" rx="4" fill="url(#houseWall)" stroke="#cbd5e1" stroke-width="2"/>
            
            <!-- Techo moderno plano con ligera inclinación -->
            <path d="M225,250 L335,250 L330,235 L230,235 Z" fill="url(#roofGradient)" stroke="#1e293b" stroke-width="2"/>
            
            <!-- Detalles del techo -->
            <line x1="230" y1="240" x2="330" y2="240" stroke="#1e293b" stroke-width="1" opacity="0.3"/>
            
            <!-- Ventana izquierda moderna -->
            <g class="window-modern wm1">
              <rect x="245" y="270" width="25" height="30" rx="2" fill="#dbeafe" stroke="#64748b" stroke-width="2"/>
              <line x1="257.5" y1="270" x2="257.5" y2="300" stroke="#94a3b8" stroke-width="1.5"/>
              <line x1="245" y1="285" x2="270" y2="285" stroke="#94a3b8" stroke-width="1.5"/>
              <!-- Reflejo en ventana -->
              <rect x="247" y="272" width="10" height="12" fill="#ffffff" opacity="0.4" rx="1"/>
            </g>
            
            <!-- Ventana derecha moderna -->
            <g class="window-modern wm2">
              <rect x="295" y="270" width="25" height="30" rx="2" fill="#dbeafe" stroke="#64748b" stroke-width="2"/>
              <line x1="307.5" y1="270" x2="307.5" y2="300" stroke="#94a3b8" stroke-width="1.5"/>
              <line x1="295" y1="285" x2="320" y2="285" stroke="#94a3b8" stroke-width="1.5"/>
              <!-- Reflejo en ventana -->
              <rect x="297" y="272" width="10" height="12" fill="#ffffff" opacity="0.4" rx="1"/>
            </g>
            
            <!-- Puerta moderna -->
            <rect x="272" y="290" width="22" height="40" rx="2" fill="#475569" stroke="#1e293b" stroke-width="2"/>
            <circle cx="289" cy="310" r="2" fill="#fbbf24" opacity="0.9"/>
            <line x1="272" y1="310" x2="294" y2="310" stroke="#334155" stroke-width="1" opacity="0.3"/>
            
            <!-- Base/jardín minimalista -->
            <rect x="225" y="330" width="110" height="3" fill="#22c55e" opacity="0.6" rx="1"/>
          </g>
          
          <!-- Indicador de energía limpia -->
          <g class="energy-indicator">
            <circle cx="200" cy="365" r="18" fill="#10b981" opacity="0.2" class="indicator-pulse"/>
            <circle cx="200" cy="365" r="12" fill="#10b981" opacity="0.9"/>
            <path d="M200,358 L197,365 L200,365 L203,372 L200,365" fill="#ffffff" stroke="#ffffff" stroke-width="1.5" stroke-linejoin="round"/>
          </g>
          
          <!-- Etiquetas informativas opcionales -->
          <g class="info-labels" font-family="Montserrat" font-size="10" fill="#475569" font-weight="600">
            <text x="200" y="395" text-anchor="middle" opacity="0.7">SISTEMA ON-GRID</text>
          </g>
        </svg>
      </div>

      <!-- Texto de Soinsolar -->
      <div class="company-info">
        <h3 class="company-title">Soinsolar S.A.S</h3>
        <p class="company-description">
          Es una empresa colombiana especializada en el diseño, suministro, instalación y asesoría de sistemas de energía solar, comprometida con la sostenibilidad y el cuidado del medio ambiente.
        </p>
        <p class="company-description">
          A continuación, presentamos nuestra propuesta de cotización para sistemas solares fotovoltaicos conectados a la red (On-Grid), orientada a optimizar el consumo energético y reducir los costos en la factura eléctrica.
        </p>
      </div>

      <!-- Decoración de fondo artística -->
      <div class="panel-glow"></div>
      
      <!-- Partículas flotantes -->
      <div class="particles-container">
        <div class="particle-dot"></div>
        <div class="particle-dot"></div>
        <div class="particle-dot"></div>
        <div class="particle-dot"></div>
        <div class="particle-dot"></div>
        <div class="particle-dot"></div>
      </div>
      
      <!-- Líneas animadas -->
      <div class="lines-container">
        <div class="animated-line line1"></div>
        <div class="animated-line line2"></div>
        <div class="animated-line line3"></div>
      </div>
      
      <!-- Círculos decorativos -->
      <div class="circles-container">
        <div class="deco-circle circle1"></div>
        <div class="deco-circle circle2"></div>
        <div class="deco-circle circle3"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Lógica del componente puede agregarse aquí
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');

.panel2 {
  background: linear-gradient(135deg, #F5B027 0%, #E89B1C 100%);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 48px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(245, 176, 39, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideInUp 0.6s ease-out 0.1s both;
  min-height: 500px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  grid-column: span 2;
}

.panel2:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 30px 80px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(245, 176, 39, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.panel-content {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 40px;
  align-items: center;
}

/* Animación Solar Profesional */
.solar-animation {
  width: 100%;
  max-width: 280px;
  height: auto;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.15));
}

.solar-animation svg {
  width: 100%;
  height: auto;
}

/* Sol profesional */
.sun-pro {
  animation: sun-float 6s ease-in-out infinite;
}

@keyframes sun-float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* Rayos modernos del sol */
.ray-modern {
  animation: ray-pulse 2.5s ease-in-out infinite;
  filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.8));
}

.r1 { animation-delay: 0s; }
.r2 { animation-delay: 0.15s; }
.r3 { animation-delay: 0.3s; }
.r4 { animation-delay: 0.45s; }
.r5 { animation-delay: 0.6s; }
.r6 { animation-delay: 0.75s; }
.r7 { animation-delay: 0.9s; }
.r8 { animation-delay: 1.05s; }

@keyframes ray-pulse {
  0%, 100% {
    opacity: 1;
    stroke-width: 6;
    stroke: #fbbf24;
  }
  50% {
    opacity: 0.7;
    stroke-width: 8;
    stroke: #fcd34d;
  }
}

/* Conexiones de energía */
.energy-path {
  stroke-dasharray: 120;
  stroke-dashoffset: 120;
  animation: energy-flow 3s ease-in-out infinite;
}

.ep1 { animation-delay: 0s; }
.ep2 { animation-delay: 0.5s; }
.ep3 { animation-delay: 1s; }

@keyframes energy-flow {
  0% {
    stroke-dashoffset: 120;
    opacity: 0;
  }
  40%, 60% {
    stroke-dashoffset: 0;
    opacity: 0.8;
  }
  100% {
    stroke-dashoffset: -120;
    opacity: 0;
  }
}

.energy-point {
  animation: point-appear 3s ease-in-out infinite;
}

.ep1.energy-point { animation-delay: 0s; }
.ep2.energy-point { animation-delay: 0.5s; }
.ep3.energy-point { animation-delay: 1s; }

@keyframes point-appear {
  0%, 30% {
    opacity: 0;
    transform: scale(0);
  }
  40%, 60% {
    opacity: 1;
    transform: scale(1.2);
  }
  70%, 100% {
    opacity: 0;
    transform: scale(0);
  }
}

/* Sistema de paneles */
.solar-panel-system {
  animation: panel-shimmer 8s ease-in-out infinite;
}

@keyframes panel-shimmer {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-3px);
  }
}

/* Celdas solares con efecto de carga */
.solar-cell {
  animation: cell-charge 4s ease-in-out infinite;
}

.sc1 { animation-delay: 0s; }
.sc2 { animation-delay: 0.3s; }
.sc3 { animation-delay: 0.6s; }
.sc4 { animation-delay: 0.9s; }
.sc5 { animation-delay: 1.2s; }
.sc6 { animation-delay: 1.5s; }

@keyframes cell-charge {
  0%, 100% {
    opacity: 0.7;
    fill: #2563eb;
  }
  50% {
    opacity: 1;
    fill: #60a5fa;
  }
}

/* Casa moderna */
.modern-house {
  animation: house-settle 5s ease-in-out infinite;
}

@keyframes house-settle {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-2px);
  }
}

/* Ventanas modernas con luz */
.window-modern rect:first-child {
  animation: window-glow 4s ease-in-out infinite alternate;
}

.wm1 rect:first-child {
  animation-delay: 0s;
}

.wm2 rect:first-child {
  animation-delay: 2s;
}

@keyframes window-glow {
  0% {
    fill: #dbeafe;
  }
  100% {
    fill: #bfdbfe;
  }
}

/* Indicador de energía limpia */
.indicator-pulse {
  animation: pulse-indicator 2s ease-in-out infinite;
}

@keyframes pulse-indicator {
  0%, 100% {
    r: 18;
    opacity: 0.2;
  }
  50% {
    r: 24;
    opacity: 0.4;
  }
}

/* Información de la empresa */
.company-info {
  text-align: justify;
  font-family: 'Montserrat', sans-serif;
}

.company-title {
  font-size: 36px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 24px;
  font-family: 'Montserrat', sans-serif;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #1e293b, #0f172a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.company-description {
  font-size: 19px;
  line-height: 1.9;
  color: #334155;
  font-weight: 500;
  font-family: 'Montserrat', sans-serif;
  margin-bottom: 20px;
  text-align: justify;
  hyphens: auto;
}

.company-description:last-child {
  margin-bottom: 0;
}

.panel-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at 30% 50%,
    rgba(255, 255, 255, 0.15) 0%,
    transparent 50%
  );
  animation: rotate-glow 25s linear infinite;
  pointer-events: none;
}

/* Partículas flotantes */
.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.particle-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
}

.particle-dot:nth-child(1) {
  top: 20%;
  left: 15%;
  animation: float-particle 8s ease-in-out infinite;
}

.particle-dot:nth-child(2) {
  top: 60%;
  left: 80%;
  animation: float-particle 10s ease-in-out infinite 1s;
}

.particle-dot:nth-child(3) {
  top: 40%;
  left: 70%;
  animation: float-particle 12s ease-in-out infinite 2s;
}

.particle-dot:nth-child(4) {
  top: 80%;
  left: 25%;
  animation: float-particle 9s ease-in-out infinite 1.5s;
}

.particle-dot:nth-child(5) {
  top: 15%;
  left: 90%;
  animation: float-particle 11s ease-in-out infinite 0.5s;
}

.particle-dot:nth-child(6) {
  top: 70%;
  left: 50%;
  animation: float-particle 13s ease-in-out infinite 2.5s;
}

/* Líneas animadas */
.lines-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.animated-line {
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.line1 {
  width: 150px;
  top: 25%;
  left: -150px;
  animation: slide-line-1 6s ease-in-out infinite;
}

.line2 {
  width: 200px;
  top: 55%;
  left: -200px;
  animation: slide-line-2 8s ease-in-out infinite 2s;
}

.line3 {
  width: 120px;
  top: 75%;
  left: -120px;
  animation: slide-line-3 7s ease-in-out infinite 4s;
}

/* Círculos decorativos */
.circles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.deco-circle {
  position: absolute;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  animation: expand-circle 8s ease-in-out infinite;
}

.circle1 {
  width: 80px;
  height: 80px;
  top: 10%;
  right: 10%;
  animation-delay: 0s;
}

.circle2 {
  width: 120px;
  height: 120px;
  bottom: 15%;
  left: 5%;
  animation-delay: 2s;
}

.circle3 {
  width: 60px;
  height: 60px;
  top: 50%;
  left: 85%;
  animation-delay: 4s;
}

@keyframes rotate-glow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes float-particle {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.4;
  }
  25% {
    transform: translate(30px, -40px) scale(1.2);
    opacity: 0.8;
  }
  50% {
    transform: translate(-20px, -80px) scale(0.9);
    opacity: 0.6;
  }
  75% {
    transform: translate(-40px, -40px) scale(1.1);
    opacity: 0.7;
  }
}

@keyframes slide-line-1 {
  0% {
    left: -150px;
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    left: 100%;
    opacity: 0;
  }
}

@keyframes slide-line-2 {
  0% {
    left: -200px;
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    left: 100%;
    opacity: 0;
  }
}

@keyframes slide-line-3 {
  0% {
    left: -120px;
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    left: 100%;
    opacity: 0;
  }
}

@keyframes expand-circle {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.6;
  }
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

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1024px) {
  .panel-content {
    grid-template-columns: 1fr;
    gap: 30px;
    text-align: center;
  }

  .solar-animation {
    margin: 0 auto;
  }

  .company-description {
    text-align: center;
  }
}

@media (max-width: 768px) {
  .panel2 {
    padding: 24px;
    min-height: 400px;
  }

  .company-title {
    font-size: 28px;
  }

  .company-description {
    font-size: 17px;
    line-height: 1.8;
  }

  .solar-animation {
    max-width: 180px;
  }
}


.panel-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at 30% 50%,
    rgba(255, 255, 255, 0.15) 0%,
    transparent 50%
  );
  animation: rotate-glow 25s linear infinite;
  pointer-events: none;
}

/* Partículas flotantes */
.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.particle-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
}

.particle-dot:nth-child(1) {
  top: 20%;
  left: 15%;
  animation: float-particle 8s ease-in-out infinite;
}

.particle-dot:nth-child(2) {
  top: 60%;
  left: 80%;
  animation: float-particle 10s ease-in-out infinite 1s;
}

.particle-dot:nth-child(3) {
  top: 40%;
  left: 70%;
  animation: float-particle 12s ease-in-out infinite 2s;
}

.particle-dot:nth-child(4) {
  top: 80%;
  left: 25%;
  animation: float-particle 9s ease-in-out infinite 1.5s;
}

.particle-dot:nth-child(5) {
  top: 15%;
  left: 90%;
  animation: float-particle 11s ease-in-out infinite 0.5s;
}

.particle-dot:nth-child(6) {
  top: 70%;
  left: 50%;
  animation: float-particle 13s ease-in-out infinite 2.5s;
}

/* Líneas animadas */
.lines-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.animated-line {
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.line1 {
  width: 150px;
  top: 25%;
  left: -150px;
  animation: slide-line-1 6s ease-in-out infinite;
}

.line2 {
  width: 200px;
  top: 55%;
  left: -200px;
  animation: slide-line-2 8s ease-in-out infinite 2s;
}

.line3 {
  width: 120px;
  top: 75%;
  left: -120px;
  animation: slide-line-3 7s ease-in-out infinite 4s;
}

/* Círculos decorativos */
.circles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.deco-circle {
  position: absolute;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  animation: expand-circle 8s ease-in-out infinite;
}

.circle1 {
  width: 80px;
  height: 80px;
  top: 10%;
  right: 10%;
  animation-delay: 0s;
}

.circle2 {
  width: 120px;
  height: 120px;
  bottom: 15%;
  left: 5%;
  animation-delay: 2s;
}

.circle3 {
  width: 60px;
  height: 60px;
  top: 50%;
  left: 85%;
  animation-delay: 4s;
}

@keyframes rotate-glow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes float-particle {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.4;
  }
  25% {
    transform: translate(30px, -40px) scale(1.2);
    opacity: 0.8;
  }
  50% {
    transform: translate(-20px, -80px) scale(0.9);
    opacity: 0.6;
  }
  75% {
    transform: translate(-40px, -40px) scale(1.1);
    opacity: 0.7;
  }
}

@keyframes slide-line-1 {
  0% {
    left: -150px;
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    left: 100%;
    opacity: 0;
  }
}

@keyframes slide-line-2 {
  0% {
    left: -200px;
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    left: 100%;
    opacity: 0;
  }
}

@keyframes slide-line-3 {
  0% {
    left: -120px;
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    left: 100%;
    opacity: 0;
  }
}

@keyframes expand-circle {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.6;
  }
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

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1024px) {
  .panel-content {
    grid-template-columns: 1fr;
    gap: 30px;
    text-align: center;
  }

  .solar-animation {
    margin: 0 auto;
  }

  .company-description {
    text-align: center;
  }
}

@media (max-width: 768px) {
  .panel2 {
    padding: 24px;
    min-height: 400px;
  }

  .company-title {
    font-size: 24px;
  }

  .company-description {
    font-size: 14px;
    line-height: 1.7;
  }

  .solar-animation {
    max-width: 180px;
  }
}


.panel-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at 30% 50%,
    rgba(255, 255, 255, 0.15) 0%,
    transparent 50%
  );
  animation: rotate-glow 25s linear infinite;
  pointer-events: none;
}

/* Partículas flotantes */
.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.particle-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
}

.particle-dot:nth-child(1) {
  top: 20%;
  left: 15%;
  animation: float-particle 8s ease-in-out infinite;
}

.particle-dot:nth-child(2) {
  top: 60%;
  left: 80%;
  animation: float-particle 10s ease-in-out infinite 1s;
}

.particle-dot:nth-child(3) {
  top: 40%;
  left: 70%;
  animation: float-particle 12s ease-in-out infinite 2s;
}

.particle-dot:nth-child(4) {
  top: 80%;
  left: 25%;
  animation: float-particle 9s ease-in-out infinite 1.5s;
}

.particle-dot:nth-child(5) {
  top: 15%;
  left: 90%;
  animation: float-particle 11s ease-in-out infinite 0.5s;
}

.particle-dot:nth-child(6) {
  top: 70%;
  left: 50%;
  animation: float-particle 13s ease-in-out infinite 2.5s;
}

/* Líneas animadas */
.lines-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.animated-line {
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.line1 {
  width: 150px;
  top: 25%;
  left: -150px;
  animation: slide-line-1 6s ease-in-out infinite;
}

.line2 {
  width: 200px;
  top: 55%;
  left: -200px;
  animation: slide-line-2 8s ease-in-out infinite 2s;
}

.line3 {
  width: 120px;
  top: 75%;
  left: -120px;
  animation: slide-line-3 7s ease-in-out infinite 4s;
}

/* Círculos decorativos */
.circles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.deco-circle {
  position: absolute;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  animation: expand-circle 8s ease-in-out infinite;
}

.circle1 {
  width: 80px;
  height: 80px;
  top: 10%;
  right: 10%;
  animation-delay: 0s;
}

.circle2 {
  width: 120px;
  height: 120px;
  bottom: 15%;
  left: 5%;
  animation-delay: 2s;
}

.circle3 {
  width: 60px;
  height: 60px;
  top: 50%;
  left: 85%;
  animation-delay: 4s;
}

@keyframes rotate-glow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes float-particle {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.4;
  }
  25% {
    transform: translate(30px, -40px) scale(1.2);
    opacity: 0.8;
  }
  50% {
    transform: translate(-20px, -80px) scale(0.9);
    opacity: 0.6;
  }
  75% {
    transform: translate(-40px, -40px) scale(1.1);
    opacity: 0.7;
  }
}

@keyframes slide-line-1 {
  0% {
    left: -150px;
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    left: 100%;
    opacity: 0;
  }
}

@keyframes slide-line-2 {
  0% {
    left: -200px;
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    left: 100%;
    opacity: 0;
  }
}

@keyframes slide-line-3 {
  0% {
    left: -120px;
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    left: 100%;
    opacity: 0;
  }
}

@keyframes expand-circle {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.6;
  }
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

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .panel2 {
    padding: 24px;
    min-height: 320px;
  }

  .panel-icon {
    width: 70px;
    height: 70px;
  }

  .panel-icon svg {
    width: 40px;
    height: 40px;
  }

  .panel-title {
    font-size: 24px;
  }

  .panel-stat {
    font-size: 36px;
  }

  .panel-description {
    font-size: 12px;
  }
}
</style>