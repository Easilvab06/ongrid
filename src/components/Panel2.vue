<template>
  <div class="panel2">
  <div class="relative z-10 grid grid-cols-1 gap-4 items-center">
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@reference "tailwindcss";

.panel2 {
  background: linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%);
  border-radius: 16px;
  @apply p-0 shadow-lg min-h-[500px] h-full flex flex-col col-span-2 font-['Inter'] relative overflow-hidden;
}

@keyframes background-flash {
  0%, 100% { background: linear-gradient(135deg, #F5B027 0%, #E89B1C 100%); }
  50% { background: linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%); }
}

/* Custom animations for solar system */

.solar-animation {
  width: 100%;
  max-width: 400px;
  height: auto;
}

.solar-animation svg {
  width: 100%;
  height: auto;
}

.sun-pro {
}

.ray-modern {
  filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.8));
}

.energy-path {
  stroke-dasharray: 120;
  stroke-dashoffset: 120;
}

.energy-point {
}

.solar-panel-system {
}

.solar-cell {
}

.modern-house {
}

.window-modern rect:first-child {
}

.indicator-pulse {
}

.company-info {
  text-align: justify;
  font-family: Montserrat, sans-serif;
  padding: 20px 20px 20px 40px;
  border-radius: 0;
  box-shadow: none;
  position: relative;
  z-index: 1;
  background: inherit;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin: 0;
  width: 100%;
  box-sizing: border-box;
}

.company-title {
  font-size: 3rem;
  font-weight: 900;
  color: #ffffff;
  margin-bottom: 24px;
  font-family: Montserrat, sans-serif;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.company-description {
  font-size: 1.25rem;
  line-height: 1.9;
  color: #ffffff;
  font-weight: 500;
  font-family: Montserrat, sans-serif;
  margin-bottom: 20px;
  text-align: justify;
  hyphens: auto;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
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
  pointer-events: none;
  background: radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 50%);
}

.particles-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.particle-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  background-color: rgba(255, 255, 255, 0.6);
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

.lines-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.animated-line {
  position: absolute;
  height: 2px;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.6), transparent);
  border-radius: 1px;
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

.circles-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.deco-circle {
  position: absolute;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.circle1 {
  width: 80px;
  height: 80px;
  top: 10%;
  right: 10%;
}

.circle2 {
  width: 120px;
  height: 120px;
  bottom: 15%;
  left: 5%;
}

.circle3 {
  width: 60px;
  height: 60px;
  top: 50%;
  left: 85%;
}

@keyframes sun-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

@keyframes ray-pulse {
  0%, 100% { opacity: 1; stroke-width: 6; stroke: #fbbf24; }
  50% { opacity: 0.7; stroke-width: 8; stroke: #fcd34d; }
}

@keyframes energy-flow {
  0% { stroke-dashoffset: 120; opacity: 0; }
  40%, 60% { stroke-dashoffset: 0; opacity: 0.8; }
  100% { stroke-dashoffset: -120; opacity: 0; }
}

@keyframes point-appear {
  0%, 30% { opacity: 0; transform: scale(0); }
  40%, 60% { opacity: 1; transform: scale(1.2); }
  70%, 100% { opacity: 0; transform: scale(0); }
}

@keyframes panel-shimmer {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
}

@keyframes cell-charge {
  0%, 100% { opacity: 0.7; fill: #2563eb; }
  50% { opacity: 1; fill: #60a5fa; }
}

@keyframes house-settle {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-2px); }
}

@keyframes window-glow {
  0% { fill: #dbeafe; }
  100% { fill: #bfdbfe; }
}

@keyframes pulse-indicator {
  0%, 100% { r: 18; opacity: 0.2; }
  50% { r: 24; opacity: 0.4; }
}

@keyframes rotate-glow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes float-particle {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
  25% { transform: translate(30px, -40px) scale(1.2); opacity: 0.8; }
  50% { transform: translate(-20px, -80px) scale(0.9); opacity: 0.6; }
  75% { transform: translate(-40px, -40px) scale(1.1); opacity: 0.7; }
}

@keyframes slide-line-1 {
  0% { left: -150px; opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { left: 100%; opacity: 0; }
}

@keyframes slide-line-2 {
  0% { left: -200px; opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { left: 100%; opacity: 0; }
}

@keyframes slide-line-3 {
  0% { left: -120px; opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { left: 100%; opacity: 0; }
}

@keyframes expand-circle {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.5); opacity: 0.6; }
}

@keyframes slideInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive design */
@media (max-width: 1024px) {
  .solar-animation {
    margin-left: auto;
    margin-right: auto;
  }

  .company-description {
    text-align: center;
  }
}

@media (max-width: 768px) {
  .company-title {
    font-size: 1.875rem;
  }

  .company-description {
    font-size: 1.125rem;
    line-height: 1.8;
  }

  .solar-animation {
    max-width: 180px;
  }
}
</style>