<template>
  <div class="panel-container">
    <!-- Header con flecha animada -->
    <div class="panel-header" @click="toggleExpand">
      <div class="header-content">
        <h2 class="panel-title">Marco Legal Sistemas Fotovoltaicos Conectados a la Red</h2>
        <p class="panel-subtitle">Según Ley 2099 de 2021</p>
      </div>
      <div class="arrow-wrapper" :class="{ expanded: isExpanded }">
        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>

    <!-- Contenedor de incentivos expandibles -->
    <transition name="expand-height">
      <div v-if="isExpanded" class="incentives-container">
        <!-- Grid de incentivos con efecto staggered -->
        <div
          v-for="(incentive, index) in incentives"
          :key="index"
          class="incentive-card"
          :style="{ '--delay': `${index * 100}ms` }"
          @mouseenter="hoveredIncentive = index"
          @mouseleave="hoveredIncentive = null"
        >
          <!-- Burbuja con icono en superior derecha -->
          <div class="icon-bubble">{{ incentive.icon }}</div>

          <!-- Animación de fondo -->
          <div class="card-background">
            <div class="gradient-blob blob-1"></div>
            <div class="gradient-blob blob-2"></div>
          </div>

          <!-- Contenido del incentivo -->
          <div class="card-content">
            <!-- Número circular animado -->
            <div class="incentive-number">
              <span class="number-text">{{ index + 1 }}</span>
              <svg class="circle-svg" viewBox="0 0 100 100">
                <circle class="circle-background" cx="50" cy="50" r="45"/>
                <circle class="circle-progress" cx="50" cy="50" r="45"/>
              </svg>
            </div>

            <!-- Icono y texto -->
            <div class="card-text">
              <h3 class="incentive-name">{{ incentive.name }}</h3>
              <p class="incentive-description">{{ incentive.description }}</p>
            </div>
          </div>

          <!-- Línea decorativa animada -->
          <div class="card-line"></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Panel9',
  data() {
    return {
      isExpanded: false,
      hoveredIncentive: null,
      incentives: [
        {
          name: 'Exención de Derechos Arancelarios',
          description: 'Exención de derechos arancelarios para importación de equipos y materiales solares fotovoltaicos en proyectos FNCER.',
          icon: '🚚'
        },
        {
          name: 'Régimen de Depreciación Acelerada',
          description: 'Depreciación acelerada para maquinaria, equipos y obras civiles en proyectos FNCER, incluyendo almacenamiento y nuevas tecnologías energéticas.',
          icon: '⚡'
        },
        {
          name: 'Deducción Especial en el Impuesto de Renta',
          description: 'Deducción del 50% del valor de la inversión en proyectos FNCER del impuesto sobre la renta, en hasta 15 años.',
          icon: '💰'
        },
        {
          name: 'Exclusión de IVA',
          description: 'Exclusión de IVA para los equipos, elementos, maquinaria y servicios en proyectos FNCER.',
          icon: '📊'
        }

      ]
    };
  },
  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

* {
  box-sizing: border-box;
}

.panel-container {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  animation: slideInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e9ecef;
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

/* HEADER SECTION */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 40px;
  background: linear-gradient(135deg, #1f2c51 0%, #2d3f6e 100%);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.panel-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s;
}

.panel-header:hover::before {
  left: 100%;
}

.panel-header:hover {
  box-shadow: inset 0 0 30px rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.header-content {
  flex: 1;
  text-align: center;
}

.panel-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.5px;
  animation: fadeInLeft 0.6s ease-out;
  font-family: 'Poppins', sans-serif;
}

.panel-subtitle {
  margin: 8px 0 0 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  animation: fadeInLeft 0.6s ease-out 0.1s both;
  font-family: 'Poppins', sans-serif;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* ARROW */
.arrow-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  margin-left: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  position: absolute;
  right: 30px;
}

.arrow-wrapper:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: scale(1.1);
}

.arrow-wrapper.expanded {
  background: rgba(255, 255, 255, 0.3);
}

.arrow-icon {
  width: 28px;
  height: 28px;
  color: #ffffff;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.arrow-wrapper.expanded .arrow-icon {
  transform: rotate(180deg);
}

/* INCENTIVES CONTAINER */
.incentives-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
  padding: 40px;
  background: linear-gradient(180deg, rgba(31, 44, 81, 0.02) 0%, rgba(26, 35, 64, 0.02) 100%);
}

/* INCENTIVE CARDS */
.incentive-card {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 24px;
  overflow: visible;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: scaleInCard 0.5s ease-out;
  animation-delay: var(--delay);
  animation-fill-mode: both;
  border: 2px solid transparent;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

@keyframes scaleInCard {
  from {
    opacity: 0;
    transform: scale(0.85) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.incentive-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: #1f2c51;
  box-shadow: 0 20px 50px rgba(31, 44, 81, 0.15), 0 0 30px rgba(76, 175, 80, 0.1);
}

/* ICON BUBBLE - SUPERIOR DERECHA */
.icon-bubble {
  position: absolute;
  top: -15px;
  right: -15px;
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #e3f2fd, #f3e5f5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.incentive-card:hover .icon-bubble {
  transform: rotate(15deg) scale(1.1);
  background: linear-gradient(135deg, #bbdefb, #e1bee7);
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.gradient-blob {
  position: absolute;
  border-radius: 50%;
  opacity: 0.08;
  animation: float 6s ease-in-out infinite;
}

.blob-1 {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #1f2c51, #2d3f6e);
  top: -30px;
  right: -30px;
}

.blob-2 {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  bottom: -40px;
  left: -40px;
  animation: float 8s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(10px, -10px);
  }
}

.incentive-card:hover .gradient-blob {
  opacity: 0.12;
}

/* CARD CONTENT */
.card-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.incentive-number {
  position: relative;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.number-text {
  position: relative;
  z-index: 2;
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #1f2c51, #4caf50);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'Montserrat', sans-serif;
}

.circle-svg {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
  top: 0;
  left: 0;
}

.circle-background {
  fill: none;
  stroke: #f0f0f0;
  stroke-width: 2;
}

.circle-progress {
  fill: none;
  stroke: url(#gradient);
  stroke-width: 2;
  stroke-dasharray: 283;
  stroke-dashoffset: 283;
  transition: stroke-dashoffset 0.6s ease-out;
  animation: fillCircle 1s ease-out forwards;
  animation-delay: var(--delay);
}

@keyframes fillCircle {
  from {
    stroke-dashoffset: 283;
  }
  to {
    stroke-dashoffset: 0;
  }
}

.incentive-card:hover .circle-progress {
  stroke-dashoffset: 0;
  filter: drop-shadow(0 0 8px rgba(31, 44, 81, 0.4));
}

.card-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.incentive-name {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  transition: color 0.3s;
  font-family: 'Poppins', sans-serif;
}

.incentive-card:hover .incentive-name {
  color: #1f2c51;
}

.incentive-description {
  margin: 0;
  font-size: 14px;
  color: rgba(26, 26, 26, 0.7);
  line-height: 1.6;
  transition: color 0.3s;
  font-family: 'Poppins', sans-serif;
}

.incentive-card:hover .incentive-description {
  color: rgba(26, 26, 26, 0.9);
}

/* DECORATIVE LINE */
.card-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, transparent, #1f2c51, #4caf50, transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.incentive-card:hover .card-line {
  opacity: 1;
  animation: slideLineAnimation 0.6s ease-out;
}

@keyframes slideLineAnimation {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

@keyframes glowPulse {
  0%, 100% {
    box-shadow: 0 20px 50px rgba(31, 44, 81, 0.15), 0 0 30px rgba(76, 175, 80, 0.1);
  }
  50% {
    box-shadow: 0 20px 50px rgba(31, 44, 81, 0.2), 0 0 40px rgba(76, 175, 80, 0.15);
  }
}

/* TRANSITIONS */
.expand-height-enter-active,
.expand-height-leave-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: top center;
}

.expand-height-enter-from,
.expand-height-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transform: perspective(600px) rotateX(90deg);
}

.expand-height-enter-to,
.expand-height-leave-from {
  opacity: 1;
  max-height: 2000px;
  transform: perspective(600px) rotateX(0deg);
}

/* RESPONSIVE */
@media (max-width: 1200px) {
  .panel-container {
    grid-column: span 1;
  }

  .incentives-container {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    padding: 30px;
    gap: 18px;
  }
}

@media (max-width: 992px) {
  .panel-header {
    padding: 25px 30px;
  }

  .panel-title {
    font-size: 22px;
  }

  .panel-subtitle {
    font-size: 13px;
  }

  .arrow-wrapper {
    width: 45px;
    height: 45px;
    right: 25px;
  }

  .arrow-icon {
    width: 24px;
    height: 24px;
  }

  .incentives-container {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    padding: 25px;
    gap: 16px;
  }

  .incentive-card {
    padding: 20px;
    min-height: 160px;
  }

  .incentive-number {
    width: 55px;
    height: 55px;
  }

  .number-text {
    font-size: 20px;
  }

  .incentive-name {
    font-size: 16px;
  }

  .incentive-description {
    font-size: 13px;
  }

  .icon-bubble {
    width: 65px;
    height: 65px;
    font-size: 28px;
    top: -14px;
    right: -14px;
  }
}

@media (max-width: 768px) {
  .panel-header {
    padding: 16px 12px;
    flex-direction: column;
    text-align: center;
  }

  .header-content {
    margin-bottom: 12px;
  }

  .arrow-wrapper {
    position: static;
    margin-left: 0;
    margin-top: 8px;
  }

  .panel-title {
    font-size: 16px;
  }

  .panel-subtitle {
    font-size: 11px;
  }

  .incentives-container {
    grid-template-columns: 1fr;
    padding: 16px;
    gap: 12px;
  }

  .incentive-card {
    padding: 12px;
    min-height: 140px;
  }

  .incentive-number {
    width: 40px;
    height: 40px;
  }

  .number-text {
    font-size: 14px;
  }

  .incentive-name {
    font-size: 12px;
  }

  .incentive-description {
    font-size: 10px;
  }

  .icon-bubble {
    width: 50px;
    height: 50px;
    font-size: 20px;
    top: -8px;
    right: -8px;
  }
}

@media (max-width: 576px) {
  .panel-container {
    border-radius: 15px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  }

  .panel-header {
    padding: 18px 16px;
  }

  .panel-title {
    font-size: 16px;
    letter-spacing: -0.3px;
  }

  .panel-subtitle {
    font-size: 11px;
    margin-top: 6px;
  }

  .arrow-wrapper {
    width: 40px;
    height: 40px;
  }

  .arrow-icon {
    width: 20px;
    height: 20px;
  }

  .incentives-container {
    padding: 16px;
    gap: 14px;
  }

  .incentive-card {
    padding: 14px;
    border-radius: 12px;
    min-height: 150px;
  }

  .card-content {
    gap: 12px;
  }

  .incentive-number {
    width: 45px;
    height: 45px;
  }

  .number-text {
    font-size: 16px;
  }

  .incentive-name {
    font-size: 13px;
  }

  .incentive-description {
    font-size: 10px;
    line-height: 1.4;
  }

  .icon-bubble {
    width: 55px;
    height: 55px;
    font-size: 24px;
    top: -10px;
    right: -10px;
  }

  .blob-1 {
    width: 80px;
    height: 80px;
  }

  .blob-2 {
    width: 60px;
    height: 60px;
  }
}

@media (max-width: 480px) {
  .panel-header {
    padding: 16px 14px;
  }

  .panel-title {
    font-size: 15px;
  }

  .panel-subtitle {
    font-size: 10px;
  }

  .incentives-container {
    padding: 14px;
    gap: 12px;
  }

  .incentive-card {
    padding: 12px;
    min-height: 130px;
  }

  .incentive-number {
    width: 40px;
    height: 40px;
  }

  .number-text {
    font-size: 14px;
  }

  .incentive-name {
    font-size: 12px;
  }

  .incentive-description {
    font-size: 9px;
  }

  .icon-bubble {
    width: 50px;
    height: 50px;
    font-size: 20px;
    top: -8px;
    right: -8px;
  }
}

@media (max-width: 360px) {
  .panel-container {
    border-radius: 8px;
    overflow: visible;
  }

  .panel-header {
    padding: 10px 8px;
  }

  .panel-title {
    font-size: 12px;
  }

  .panel-subtitle {
    font-size: 7px;
  }

  .arrow-wrapper {
    width: 28px;
    height: 28px;
    right: 8px;
  }

  .arrow-icon {
    width: 14px;
    height: 14px;
  }

  .incentives-container {
    padding: 8px;
    gap: 6px;
  }

  .incentive-card {
    padding: 6px;
    border-radius: 4px;
    min-height: 100px;
  }

  .card-content {
    gap: 6px;
  }

  .incentive-number {
    width: 25px;
    height: 25px;
  }

  .number-text {
    font-size: 9px;
  }

  .incentive-name {
    font-size: 9px;
  }

  .incentive-description {
    font-size: 6px;
  }

  .icon-bubble {
    width: 35px;
    height: 35px;
    font-size: 14px;
    top: -4px;
    right: -4px;
  }

  .blob-1 {
    width: 40px;
    height: 40px;
  }

  .blob-2 {
    width: 30px;
    height: 30px;
  }
}

/* Touch devices adjustments */
@media (hover: none) and (pointer: coarse) {
  .incentive-card:hover {
    transform: none;
    border-color: transparent;
    box-shadow: 0 4px 12px rgba(31, 44, 81, 0.15);
  }

  .incentive-card:active {
    transform: scale(0.98);
    border-color: #1f2c51;
    box-shadow: 0 8px 25px rgba(31, 44, 81, 0.2);
  }

  .panel-header:hover {
    box-shadow: none;
  }

  .panel-header:active {
    box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.2);
  }

  .arrow-wrapper:hover {
    transform: none;
  }

  .arrow-wrapper:active {
    transform: scale(0.95);
  }

  .incentive-card:hover .icon-bubble {
    opacity: 0;
    transform: scale(0);
  }

  .incentive-card:active .icon-bubble {
    opacity: 1;
    transform: scale(1);
  }

  .incentive-card:hover .gradient-blob {
    opacity: 0.08;
  }

  .incentive-card:active .gradient-blob {
    opacity: 0.12;
  }

  .incentive-card:hover .card-line {
    opacity: 0;
  }

  .incentive-card:active .card-line {
    opacity: 1;
    animation: slideLineAnimation 0.4s ease-out;
  }
}

/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .panel-container {
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  }

  .incentive-card {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .incentive-card:hover {
    box-shadow: 0 10px 25px rgba(31, 44, 81, 0.15);
  }
}
</style>
