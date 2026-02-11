<template>
  <div class="panel-conectado">
    <!-- HEADER -->
    <div class="header-section">
      <h2 class="panel-title">¿Cómo Funciona un Sistema Conectado a la Red?</h2>
      <p class="panel-subtitle">Visualiza el flujo de energía en tiempo real</p>
    </div>

    <!-- INFORMACIÓN CONTEXTUAL -->
    <div class="info-panel-compact transition-all duration-500 ease-in-out transform hover:scale-105" :class="{ day: isDayMode, night: !isDayMode }">
      <div class="info-header">
        <span class="info-icon">{{ isDayMode ? '🌞' : '🌙' }}</span>
        <h3 class="info-title">{{ isDayMode ? 'Durante el Día' : 'Durante la Noche' }}</h3>
      </div>
      <transition name="fade-list" mode="out-in">
        <ul v-if="isDayMode" key="day" class="info-list">
          <li>El sistema solar fotovoltaico genera energía de forma constante</li>
          <li>Alimenta directamente las cargas de la vivienda</li>
          <li>Los excedentes de energía se inyectan a la red eléctrica</li>
        </ul>
        <ul v-else key="night" class="info-list">
          <li>El sistema solar no está generando</li>
          <li>La red eléctrica suministra energía a la vivienda</li>
          <li>Se consume de la red cuando el sistema no está generando</li>
        </ul>
      </transition>
    </div>

    <!-- SELECTOR DÍA/NOCHE -->
    <div class="day-night-selector">
      <button
        class="selector-btn"
        @click="isDayMode = true"
        :class="{ active: isDayMode }"
        type="button"
      >
        <span class="selector-icon">☀️</span>
        <span class="selector-text">Día (Generando)</span>
      </button>
      <div class="selector-divider"></div>
      <button
        class="selector-btn"
        @click="isDayMode = false"
        :class="{ active: !isDayMode }"
        type="button"
      >
        <span class="selector-icon">🌙</span>
        <span class="selector-text">Noche (Consumiendo)</span>
      </button>
    </div>

    <!-- FLUJO DE ENERGÍA PRINCIPAL -->
    <div class="energy-flow-section">
      <!-- FILA 1: SOL → PANELES → INVERSOR → MEDIDOR (LINEAL) -->
      <div class="flow-row-horizontal">
        <!-- SOL -->
        <div class="flow-stage">
          <div class="stage-icon-wrapper">
            <div class="stage-icon sun-icon">
              <svg viewBox="0 0 100 100" class="icon-svg">
                <defs>
                  <radialGradient id="sunGradient">
                    <stop offset="0%" stop-color="#fbbf24" />
                    <stop offset="100%" stop-color="#f59e0b" />
                  </radialGradient>
                </defs>
                <circle cx="50" cy="50" r="22" fill="url(#sunGradient)">
                  <animate attributeName="r" values="22;24;22" dur="2s" repeatCount="indefinite"/>
                </circle>
                <g class="sun-rays">
                  <line v-for="i in 8" :key="i" 
                    :x1="50 + Math.cos((i * 45 - 90) * Math.PI / 180) * 32"
                    :y1="50 + Math.sin((i * 45 - 90) * Math.PI / 180) * 32"
                    :x2="50 + Math.cos((i * 45 - 90) * Math.PI / 180) * 40"
                    :y2="50 + Math.sin((i * 45 - 90) * Math.PI / 180) * 40"
                    stroke="#fbbf24" 
                    stroke-width="3" 
                    stroke-linecap="round"
                  />
                  <animateTransform 
                    attributeName="transform" 
                    type="rotate" 
                    from="0 50 50" 
                    to="360 50 50" 
                    dur="20s" 
                    repeatCount="indefinite"
                  />
                </g>
              </svg>
            </div>
          </div>
          <div class="stage-label">Sol</div>
          <div class="stage-desc">Luz solar</div>
        </div>

        <!-- CONEXIÓN 1 -->
        <div class="flow-connector" :class="{ active: isDayMode }">
          <div class="connector-line">
            <div class="energy-particle" v-if="isDayMode"></div>
            <div class="energy-particle particle-2" v-if="isDayMode"></div>
          </div>
        </div>

        <!-- PANELES -->
        <div class="flow-stage">
          <div class="stage-icon-wrapper">
            <div class="stage-icon panel-icon">
              <svg viewBox="0 0 100 100" class="icon-svg">
                <defs>
                  <linearGradient id="panelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#3b82f6"/>
                    <stop offset="100%" stop-color="#1e40af"/>
                  </linearGradient>
                </defs>
                <rect x="20" y="25" width="60" height="50" rx="4" fill="url(#panelGradient)" stroke="#1e40af" stroke-width="2"/>
                <line x1="50" y1="25" x2="50" y2="75" stroke="#60a5fa" stroke-width="1.5" opacity="0.4"/>
                <line x1="20" y1="50" x2="80" y2="50" stroke="#60a5fa" stroke-width="1.5" opacity="0.4"/>
                <g class="energy-cells">
                  <rect v-for="(cell, idx) in 4" :key="idx"
                    :x="idx % 2 === 0 ? 25 : 55"
                    :y="idx < 2 ? 30 : 55"
                    width="20" 
                    height="15" 
                    fill="#93c5fd" 
                    opacity="0.3"
                  >
                    <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" :begin="`${idx * 0.3}s`" repeatCount="indefinite"/>
                  </rect>
                </g>
              </svg>
            </div>
          </div>
          <div class="stage-label">Paneles</div>
          <div class="stage-desc">Generan DC</div>
        </div>

        <!-- CONEXIÓN 2 -->
        <div class="flow-connector" :class="{ active: isDayMode }">
          <div class="connector-line">
            <div class="energy-particle" v-if="isDayMode"></div>
            <div class="energy-particle particle-2" v-if="isDayMode"></div>
          </div>
        </div>
        
        <!-- INVERSOR -->
        <div class="flow-stage">
          <div class="stage-icon-wrapper">
            <div class="stage-icon inversor-icon">
              <svg viewBox="0 0 100 100" class="icon-svg">
                <defs>
                  <linearGradient id="inversorGradient">
                    <stop offset="0%" stop-color="#8b5cf6"/>
                    <stop offset="100%" stop-color="#6366f1"/>
                  </linearGradient>
                </defs>
                <rect x="25" y="25" width="50" height="50" rx="6" fill="url(#inversorGradient)" stroke="#4f46e5" stroke-width="2"/>
                <path d="M 35 50 Q 43 42, 50 50 T 65 50" stroke="#c4b5fd" stroke-width="3" fill="none" stroke-linecap="round">
                  <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite"/>
                </path>
                <circle cx="35" cy="35" r="3" fill="#22c55e">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite"/>
                </circle>
              </svg>
            </div>
          </div>
          <div class="stage-label">Inversor</div>
          <div class="stage-desc">Convierte AC</div>
        </div>

        <!-- CONEXIÓN 3 -->
        <div class="flow-connector" :class="{ active: isDayMode }">
          <div class="connector-line">
            <div class="energy-particle" v-if="isDayMode"></div>
            <div class="energy-particle particle-2" v-if="isDayMode"></div>
          </div>
        </div>

        <!-- MEDIDOR -->
        <div class="flow-stage">
          <div class="stage-icon-wrapper">
            <div class="stage-icon medidor-icon">
              <div class="medidor-container">
                <div class="medidor-display">
                  <div class="display-value" :class="{ exportando: isDayMode, importando: !isDayMode }">
                    {{ isDayMode ? '→' : '←' }}
                  </div>
                </div>
                <div class="medidor-wheel" :class="{ spinning: isDayMode, reverse: !isDayMode }">
                  <div class="wheel-mark" v-for="n in 8" :key="n"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="stage-label">Medidor</div>
          <div class="stage-desc">Bidireccional</div>
        </div>
      </div>

      <!-- BIFURCACIÓN -->
      <div class="bifurcation-container">
        <svg viewBox="0 0 400 180" class="bifurcation-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="branchHouse" x1="50%" y1="0%" x2="30%" y2="100%">
              <stop offset="0%" stop-color="#6366f1" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#10b981" stop-opacity="0.9"/>
            </linearGradient>
            <linearGradient id="branchRed" x1="50%" y1="0%" x2="70%" y2="100%">
              <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#a78bfa" stop-opacity="0.9"/>
            </linearGradient>
          </defs>

          <!-- Línea central -->
          <line x1="200" y1="0" x2="200" y2="50" stroke="#6366f1" stroke-width="4" stroke-linecap="round" opacity="0.8"/>

          <!-- Rama izquierda (Casa) -->
          <path
            d="M 200 50 Q 150 90, 100 160"
            stroke="url(#branchHouse)"
            stroke-width="4"
            fill="none"
            stroke-linecap="round"
            :opacity="isDayMode ? 1 : 0.3"
          />
          <circle r="6" fill="#10b981" v-if="isDayMode">
            <animateMotion dur="2s" repeatCount="indefinite" begin="0s" path="M 200 0 Q 200 25, 200 50 Q 150 90, 100 160"/>
          </circle>

          <!-- Rama derecha (Red) -->
          <path
            d="M 200 50 Q 250 90, 300 160"
            stroke="url(#branchRed)"
            stroke-width="4"
            fill="none"
            stroke-linecap="round"
            :opacity="isDayMode ? 1 : 0.3"
          />
          <circle r="3" fill="#8b5cf6" v-if="isDayMode">
            <animateMotion dur="2s" repeatCount="indefinite" begin="2s" path="M 200 50 Q 250 90, 300 160"/>
          </circle>
          <circle r="6" fill="#8b5cf6" v-if="!isDayMode">
            <animateMotion dur="2s" repeatCount="indefinite" begin="0s" path="M 300 160 Q 250 90, 200 50 Q 150 90, 100 160"/>
          </circle>
        </svg>
      </div>

      <!-- DESTINOS FINALES -->
      <div class="flow-row-destinations">
        <!-- CASA -->
        <div class="flow-stage destination-stage">
          <div class="stage-icon-wrapper">
            <div class="stage-icon house-icon" :class="{ active: isDayMode }">
              <svg viewBox="0 0 100 100" class="icon-svg">
                <defs>
                  <linearGradient id="houseGradient">
                    <stop offset="0%" stop-color="#dc2626"/>
                    <stop offset="100%" stop-color="#991b1b"/>
                  </linearGradient>
                </defs>
                <!-- Techo -->
                <path d="M 20 45 L 50 20 L 80 45 Z" fill="#b45309" stroke="#92400e" stroke-width="2"/>
                <!-- Cuerpo -->
                <rect x="28" y="45" width="44" height="35" fill="url(#houseGradient)" stroke="#7f1d1d" stroke-width="2" rx="2"/>
                <!-- Puerta -->
                <rect x="43" y="60" width="14" height="20" fill="#78350f" rx="2"/>
                <circle cx="52" cy="70" r="1.5" fill="#fbbf24"/>
                <!-- Ventanas -->
                <g class="windows">
                  <rect x="33" y="52" width="10" height="10" fill="#3b82f6" rx="1" opacity="0.8">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite"/>
                  </rect>
                  <rect x="57" y="52" width="10" height="10" fill="#3b82f6" rx="1" opacity="0.8">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" begin="0.5s" repeatCount="indefinite"/>
                  </rect>
                  <!-- Divisores de ventana -->
                  <line x1="38" y1="52" x2="38" y2="62" stroke="#1e40af" stroke-width="0.5"/>
                  <line x1="33" y1="57" x2="43" y2="57" stroke="#1e40af" stroke-width="0.5"/>
                  <line x1="62" y1="52" x2="62" y2="62" stroke="#1e40af" stroke-width="0.5"/>
                  <line x1="57" y1="57" x2="67" y2="57" stroke="#1e40af" stroke-width="0.5"/>
                </g>
                <!-- Chimenea -->
                <rect x="62" y="32" width="6" height="15" fill="#5b2109" rx="1"/>
                <!-- Humo -->
                <circle cx="65" cy="27" r="2" fill="#9ca3af" opacity="0.6">
                  <animate attributeName="cy" values="27;20;15" dur="3s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.6;0.3;0" dur="3s" repeatCount="indefinite"/>
                </circle>
              </svg>
            </div>
          </div>
          <div class="stage-label">Tu Casa</div>
          <div class="stage-desc">Consumo</div>
        </div>

        <!-- RED PÚBLICA -->
        <div class="flow-stage destination-stage">
          <div class="stage-icon-wrapper">
            <div class="stage-icon red-icon" :class="{ active: !isDayMode }">
              <svg viewBox="0 0 100 100" class="icon-svg">
                <defs>
                  <linearGradient id="towerGradient">
                    <stop offset="0%" stop-color="#0284c7"/>
                    <stop offset="100%" stop-color="#0c4a6e"/>
                  </linearGradient>
                </defs>
                <!-- Torres -->
                <g class="tower-left">
                  <polygon points="25,75 28,35 22,35" fill="url(#towerGradient)" stroke="#075985" stroke-width="1"/>
                  <line x1="25" y1="55" x2="20" y2="55" stroke="#0284c7" stroke-width="1"/>
                  <line x1="25" y1="65" x2="20" y2="65" stroke="#0284c7" stroke-width="1"/>
                </g>
                <g class="tower-right">
                  <polygon points="75,75 78,35 72,35" fill="url(#towerGradient)" stroke="#075985" stroke-width="1"/>
                  <line x1="75" y1="55" x2="80" y2="55" stroke="#0284c7" stroke-width="1"/>
                  <line x1="75" y1="65" x2="80" y2="65" stroke="#0284c7" stroke-width="1"/>
                </g>
                <!-- Cables -->
                <path d="M 25 40 Q 50 30 75 40" stroke="#0ea5e9" stroke-width="1.5" fill="none" opacity="0.7">
                  <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2s" repeatCount="indefinite"/>
                </path>
                <path d="M 25 50 Q 50 40 75 50" stroke="#06b6d4" stroke-width="1.5" fill="none" opacity="0.6">
                  <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" begin="0.5s" repeatCount="indefinite"/>
                </path>
                <path d="M 25 60 Q 50 50 75 60" stroke="#0284c7" stroke-width="1.5" fill="none" opacity="0.7">
                  <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2s" begin="1s" repeatCount="indefinite"/>
                </path>
              </svg>
            </div>
          </div>
          <div class="stage-label">Red Pública</div>
          <div class="stage-desc">24/7</div>
        </div>
      </div>
    </div>

    <!-- BENEFICIOS -->
    <div class="benefits-section">
      <div class="benefit-card">
        <div class="benefit-icon">💰</div>
        <div class="benefit-text">Factura reducida</div>
      </div>
      <div class="benefit-card">
        <div class="benefit-icon">🔄</div>
        <div class="benefit-text">Conexión bidireccional</div>
      </div>
      <div class="benefit-card">
        <div class="benefit-icon">📊</div>
        <div class="benefit-text">Monitoreo en vivo</div>
      </div>
      <div class="benefit-card">
        <div class="benefit-icon">🌍</div>
        <div class="benefit-text">Energía limpia 24/7</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isDayMode = ref(true)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

* {
  box-sizing: border-box;
}

.panel-conectado {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%);
  border-radius: 24px;
  padding: 64px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  width: 100%;
  margin: 0;
}

.panel-conectado::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

/* HEADER */
.header-section {
  text-align: center;
  margin-bottom: 32px;
  position: relative;
  z-index: 1;
}

.panel-title {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #1e40af 0%, #0891b2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.panel-subtitle {
  font-size: 15px;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

/* SELECTOR DÍA/NOCHE */
.day-night-selector {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  padding: 6px;
  border-radius: 16px;
  width: fit-content;
  margin: 0 auto 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 1;
}

.selector-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  background: transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  color: #64748b;
  font-size: 14px;
  font-family: inherit;
}

.selector-btn:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: translateY(-1px);
}

.selector-btn.active {
  background: white;
  color: #0f172a;
  box-shadow: 
    0 4px 12px rgba(30, 58, 138, 0.12),
    0 2px 4px rgba(0, 0, 0, 0.08);
}

.selector-icon {
  font-size: 20px;
  line-height: 1;
}

.selector-text {
  white-space: nowrap;
}

.selector-divider {
  width: 1px;
  height: 28px;
  background: rgba(148, 163, 184, 0.2);
}

/* FLUJO DE ENERGÍA */
.energy-flow-section {
  position: relative;
  z-index: 1;
}

.flow-row-horizontal {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.flow-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.stage-icon-wrapper {
  position: relative;
}

.stage-icon {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 22px;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.08),
    0 2px 4px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stage-icon::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stage-icon:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 
    0 12px 24px rgba(0, 0, 0, 0.12),
    0 4px 8px rgba(0, 0, 0, 0.08);
}

.stage-icon:hover::before {
  opacity: 1;
}

.icon-svg {
  width: 70%;
  height: 70%;
  position: relative;
  z-index: 1;
}

.stage-label {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.stage-desc {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
  margin: 0;
}

/* EFECTOS DE GLOW POR TIPO */
.sun-icon {
  background: linear-gradient(135deg, #fef3c7 0%, #fef08a 100%);
}

.panel-icon {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.inversor-icon {
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
}

.medidor-icon {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
}

.house-icon {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
}

.house-icon.active {
  animation: house-pulse 2s ease-in-out infinite;
}

@keyframes house-pulse {
  0%, 100% {
    box-shadow: 
      0 4px 12px rgba(34, 197, 94, 0.15),
      0 2px 4px rgba(0, 0, 0, 0.04);
  }
  50% {
    box-shadow: 
      0 8px 24px rgba(34, 197, 94, 0.3),
      0 4px 8px rgba(34, 197, 94, 0.15);
  }
}

.red-icon {
  background: linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%);
}

.red-icon.active {
  animation: red-pulse 2s ease-in-out infinite;
}

@keyframes red-pulse {
  0%, 100% {
    box-shadow: 
      0 4px 12px rgba(14, 165, 233, 0.15),
      0 2px 4px rgba(0, 0, 0, 0.04);
  }
  50% {
    box-shadow: 
      0 8px 24px rgba(14, 165, 233, 0.3),
      0 4px 8px rgba(14, 165, 233, 0.15);
  }
}

/* CONECTORES */
.flow-connector {
  position: relative;
  width: 80px;
  height: 4px;
  margin: 0 8px;
}

.connector-line {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    rgba(148, 163, 184, 0.3) 0%, 
    rgba(99, 102, 241, 0.4) 50%, 
    rgba(148, 163, 184, 0.3) 100%
  );
  border-radius: 2px;
  position: relative;
  transition: all 0.3s ease;
}

.flow-connector.active .connector-line {
  background: linear-gradient(90deg, 
    rgba(99, 102, 241, 0.4) 0%, 
    rgba(59, 130, 246, 0.8) 50%, 
    rgba(99, 102, 241, 0.4) 100%
  );
  box-shadow: 0 0 12px rgba(99, 102, 241, 0.4);
}

.energy-particle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, #3b82f6 0%, #6366f1 100%);
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
  animation: particle-flow 2s linear infinite;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
}

.energy-particle.particle-2 {
  animation-delay: 1s;
}

@keyframes particle-flow {
  0% {
    left: -8px;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    left: calc(100% + 8px);
    opacity: 0;
  }
}

/* MEDIDOR */
.medidor-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.medidor-display {
  position: absolute;
  width: 48px;
  height: 36px;
  background: linear-gradient(135deg, #1e293b, #334155);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #475569;
  z-index: 2;
  box-shadow: 
    inset 0 2px 8px rgba(0, 0, 0, 0.3),
    0 2px 8px rgba(0, 0, 0, 0.1);
}

.display-value {
  font-size: 22px;
  font-weight: 800;
  transition: all 0.3s ease;
  line-height: 1;
}

.display-value.exportando {
  color: #10b981;
  text-shadow: 0 0 12px rgba(16, 185, 129, 0.6);
}

.display-value.importando {
  color: #ef4444;
  text-shadow: 0 0 12px rgba(239, 68, 68, 0.6);
}

.medidor-wheel {
  position: absolute;
  width: 52px;
  height: 52px;
  border: 3px solid #6366f1;
  border-radius: 50%;
  opacity: 0.25;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wheel-mark {
  position: absolute;
  width: 2px;
  height: 8px;
  background: #6366f1;
  border-radius: 1px;
}

.wheel-mark:nth-child(1) { top: 0; left: 50%; transform: translateX(-50%); }
.wheel-mark:nth-child(2) { top: 15%; right: 15%; transform: rotate(45deg); }
.wheel-mark:nth-child(3) { top: 50%; right: 0; transform: translateY(-50%) rotate(90deg); }
.wheel-mark:nth-child(4) { bottom: 15%; right: 15%; transform: rotate(135deg); }
.wheel-mark:nth-child(5) { bottom: 0; left: 50%; transform: translateX(-50%); }
.wheel-mark:nth-child(6) { bottom: 15%; left: 15%; transform: rotate(-135deg); }
.wheel-mark:nth-child(7) { top: 50%; left: 0; transform: translateY(-50%) rotate(-90deg); }
.wheel-mark:nth-child(8) { top: 15%; left: 15%; transform: rotate(-45deg); }

.medidor-wheel.spinning {
  animation: wheel-spin 2s linear infinite;
}

.medidor-wheel.reverse {
  animation: wheel-spin-reverse 2s linear infinite;
}

@keyframes wheel-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes wheel-spin-reverse {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

/* BIFURCACIÓN */
.bifurcation-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto 20px;
  padding: 0 20px;
}

.bifurcation-svg {
  width: 100%;
  height: auto;
  display: block;
}

/* DESTINOS */
.flow-row-destinations {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 120px;
  margin-top: 20px;
}

.destination-stage .stage-icon {
  width: 100px;
  height: 100px;
}

/* BENEFICIOS */
.benefits-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 40px;
}

.benefit-card {
  background: white;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.benefit-card:hover {
  transform: translateY(-4px);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 
    0 8px 16px rgba(59, 130, 246, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.08);
}

.benefit-icon {
  font-size: 32px;
  line-height: 1;
}

.benefit-text {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.4;
}

/* INFO PANEL COMPACT */
.info-panel-compact {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 24px 28px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 4px 16px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.info-panel-compact::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
  pointer-events: none;
}

.info-panel-compact::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(255, 255, 255, 0.1) 60deg,
    transparent 120deg,
    rgba(255, 255, 255, 0.05) 180deg,
    transparent 240deg,
    rgba(255, 255, 255, 0.1) 300deg,
    transparent 360deg
  );
  animation: shimmer 4s linear infinite;
  pointer-events: none;
}

.info-panel-compact .floating-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.info-panel-compact .particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.info-panel-compact .particle:nth-child(1) {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.info-panel-compact .particle:nth-child(2) {
  top: 60%;
  left: 80%;
  animation-delay: 2s;
}

.info-panel-compact .particle:nth-child(3) {
  top: 40%;
  left: 60%;
  animation-delay: 4s;
}

.info-panel-compact .particle:nth-child(4) {
  top: 80%;
  left: 30%;
  animation-delay: 1s;
}

.info-panel-compact .particle:nth-child(5) {
  top: 10%;
  left: 90%;
  animation-delay: 3s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.8;
  }
}

@keyframes shimmer {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.info-panel-compact.day {
  background:
    linear-gradient(135deg, rgba(254, 243, 199, 0.6) 0%, rgba(255, 255, 255, 0.95) 50%, rgba(254, 243, 199, 0.4) 100%),
    radial-gradient(circle at 30% 30%, rgba(245, 158, 11, 0.1) 0%, transparent 70%),
    radial-gradient(circle at 70% 70%, rgba(251, 191, 36, 0.08) 0%, transparent 70%);
  border-left: 6px solid #f59e0b;
  text-align: left;
  box-shadow:
    0 12px 40px rgba(245, 158, 11, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -1px 0 rgba(245, 158, 11, 0.1);
}

.info-panel-compact.day::before {
  background:
    radial-gradient(circle at 20% 20%, rgba(245, 158, 11, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(251, 191, 36, 0.1) 0%, transparent 50%);
}

.info-panel-compact.night {
  background:
    linear-gradient(135deg, rgba(219, 234, 254, 0.6) 0%, rgba(255, 255, 255, 0.95) 50%, rgba(219, 234, 254, 0.4) 100%),
    radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 70%),
    radial-gradient(circle at 70% 70%, rgba(14, 165, 233, 0.08) 0%, transparent 70%);
  border-left: 6px solid #3b82f6;
  text-align: left;
  box-shadow:
    0 12px 40px rgba(59, 130, 246, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -1px 0 rgba(59, 130, 246, 0.1);
}

.info-panel-compact.night::before {
  background:
    radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(14, 165, 233, 0.1) 0%, transparent 50%);
}

.info-panel-compact:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 12px 32px rgba(0, 0, 0, 0.1);
}

.info-panel-compact.day:hover {
  box-shadow:
    0 20px 60px rgba(245, 158, 11, 0.2),
    0 12px 32px rgba(0, 0, 0, 0.1),
    0 0 40px rgba(245, 158, 11, 0.1);
}

.info-panel-compact.night:hover {
  box-shadow:
    0 20px 60px rgba(59, 130, 246, 0.2),
    0 12px 32px rgba(0, 0, 0, 0.1),
    0 0 40px rgba(59, 130, 246, 0.1);
}

/* INFO PANEL */
.info-panel {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-top: 32px;
  border-left: 4px solid #3b82f6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  position: relative;
}

.info-panel.day {
  border-left-color: #f59e0b;
  background: linear-gradient(135deg, rgba(254, 243, 199, 0.3) 0%, white 100%);
  text-align: left;
}

.info-panel.night {
  border-left-color: #3b82f6;
  background: linear-gradient(135deg, rgba(219, 234, 254, 0.3) 0%, white 100%);
  text-align: right;
  border-left: none;
  border-right: 4px solid #3b82f6;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.info-icon {
  font-size: 28px;
  line-height: 1;
}

.info-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-list li {
  font-size: 14px;
  color: #475569;
  padding-left: 28px;
  position: relative;
  line-height: 1.6;
}

.info-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #10b981;
  font-weight: 700;
  font-size: 18px;
  top: -2px;
}

/* TRANSITIONS */
.fade-list-enter-active,
.fade-list-leave-active {
  transition: all 0.5s ease;
}

.fade-list-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* RESPONSIVE */
@media (max-width: 1200px) {
  .panel-conectado {
    padding: 32px;
  }

  .panel-title {
    font-size: 24px;
  }

  .benefits-section {
    grid-template-columns: repeat(4, 1fr);
  }

  .flow-row-destinations {
    gap: 100px;
  }
}

@media (max-width: 1024px) {
  .panel-conectado {
    padding: 32px;
  }

  .panel-title {
    font-size: 24px;
  }

  .benefits-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .flow-row-destinations {
    gap: 90px;
  }

  .stage-icon {
    width: 85px;
    height: 85px;
  }

  .destination-stage .stage-icon {
    width: 95px;
    height: 95px;
  }
}

@media (max-width: 768px) {
  .panel-conectado {
    padding: 24px 20px;
    border-radius: 16px;
  }

  .panel-title {
    font-size: 20px;
    margin-bottom: 8px;
    line-height: 1.3;
  }

  .panel-subtitle {
    font-size: 14px;
    margin-bottom: 24px;
  }

  .info-panel-compact {
    padding: 20px 22px;
    margin-bottom: 20px;
    border-radius: 16px;
  }

  .info-title {
    font-size: 16px;
  }

  .info-list li {
    font-size: 14px;
    padding-left: 24px;
    line-height: 1.5;
  }

  .day-night-selector {
    margin-bottom: 24px;
    padding: 6px;
    border-radius: 12px;
    width: 100%;
    max-width: 320px;
  }

  .selector-btn {
    padding: 12px 16px;
    font-size: 13px;
    flex: 1;
    justify-content: center;
  }

  .selector-icon {
    font-size: 18px;
  }

  .selector-text {
    font-size: 12px;
  }

  /* Reorganizar flujo en 2 filas para móviles */
  .flow-row-horizontal {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    align-items: center;
    margin-bottom: 16px;
  }

  .flow-connector {
    display: block;
    width: 4px;
    height: 40px;
    margin: 0 auto;
  }

  .stage-icon {
    width: 85px;
    height: 85px;
    border-radius: 18px;
  }

  .panel-icon, .inversor-icon {
    width: 85px;
    height: 85px;
  }

  .destination-stage .stage-icon {
    width: 95px;
    height: 95px;
  }

  .stage-label {
    font-size: 13px;
    font-weight: 600;
  }

  .stage-desc {
    font-size: 11px;
  }

  .bifurcation-container {
    max-width: 320px;
    margin-bottom: 16px;
    padding: 0 15px;
  }

  .flow-row-destinations {
    flex-direction: column;
    gap: 24px;
    margin-top: 16px;
    align-items: center;
  }

  .benefits-section {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-top: 24px;
  }

  .benefit-card {
    padding: 16px 12px;
    border-radius: 12px;
  }

  .benefit-icon {
    font-size: 26px;
  }

  .benefit-text {
    font-size: 12px;
  }
}


@media (max-width: 1024px) {
  .flow-row-horizontal {
    gap: 16px;
  }

  .stage-icon {
    width: 80px;
    height: 80px;
  }

  .stage-label {
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .panel-conectado {
    padding: 28px 20px;
  }

  .panel-title {
    font-size: 22px;
  }

  .flow-row-horizontal {
    gap: 14px;
  }

  .stage-icon {
    width: 75px;
    height: 75px;
  }

  .bifurcation-container {
    max-width: 300px;
  }
}

@media (max-width: 640px) {
  .panel-conectado {
    padding: 20px 16px;
  }

  .panel-title {
    font-size: 18px;
  }

  .panel-subtitle {
    font-size: 13px;
  }

  .info-panel-compact {
    padding: 16px 18px;
    margin-bottom: 18px;
  }

  .day-night-selector {
    margin-bottom: 24px;
    width: 100%;
  }

  /* FLUJO EN 2 FILAS PARA 640px - ESPACIO ADECUADO PARA MÓVILES */
  .flow-row-horizontal {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 16px !important;
    margin-bottom: 20px;
    padding: 0 12px;
  }

  .flow-connector {
    display: block !important;
    width: 4px !important;
    height: 50px !important;
    margin: 0 auto !important;
  }

  .flow-connector .connector-line {
    display: none !important;
  }

  .stage-icon {
    width: 80px;
    height: 80px;
    border-radius: 18px;
  }

  .panel-icon, .inversor-icon {
    width: 80px;
    height: 80px;
  }

  .destination-stage .stage-icon {
    width: 90px;
    height: 90px;
  }

  .stage-label {
    font-size: 16px;
    font-weight: 700;
  }

  .stage-desc {
    font-size: 14px;
  }

  .bifurcation-container {
    max-width: 280px;
    margin-bottom: 12px;
    padding: 0 10px;
  }

  .flow-row-destinations {
    display: flex;
    gap: 30px;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 12px;
  }

  .benefits-section {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-top: 20px;
  }

  .benefit-card {
    padding: 14px;
  }

  .benefit-icon {
    font-size: 24px;
  }

  .benefit-text {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .panel-conectado {
    padding: 16px 12px;
    border-radius: 12px;
  }

  .panel-title {
    font-size: 16px;
    line-height: 1.3;
  }

  .panel-subtitle {
    font-size: 12px;
    margin-bottom: 16px;
  }

  .info-panel-compact {
    padding: 14px 16px;
    margin-bottom: 14px;
    border-radius: 12px;
  }

  .info-title {
    font-size: 14px;
  }

  .info-list li {
    font-size: 12px;
    padding-left: 20px;
    line-height: 1.5;
  }

  .day-night-selector {
    margin-bottom: 16px;
    padding: 4px;
    border-radius: 10px;
  }

  .selector-btn {
    padding: 8px 12px;
    font-size: 11px;
  }

  .selector-icon {
    font-size: 14px;
  }

  .selector-text {
    font-size: 10px;
  }

  .flow-row-horizontal {
    gap: 12px 8px;
    margin-bottom: 10px;
  }

  .stage-icon {
    width: 70px;
    height: 70px;
    border-radius: 14px;
  }

  .panel-icon, .inversor-icon {
    width: 70px;
    height: 70px;
  }

  .destination-stage .stage-icon {
    width: 75px;
    height: 75px;
  }

  .stage-label {
    font-size: 11px;
    font-weight: 600;
  }

  .stage-desc {
    font-size: 9px;
  }

  .bifurcation-container {
    max-width: 220px;
    margin-bottom: 10px;
  }

  .flow-row-destinations {
    gap: 30px;
    margin-top: 10px;
  }

  .benefits-section {
    grid-template-columns: 1fr;
    gap: 8px;
    margin-top: 20px;
  }

  .benefit-card {
    padding: 12px;
    flex-direction: row;
    justify-content: flex-start;
    gap: 12px;
    text-align: left;
  }

  .benefit-icon {
    font-size: 22px;
  }

  .benefit-text {
    font-size: 12px;
  }
}


@media (max-width: 360px) {
  .panel-conectado {
    padding: 14px 10px;
    border-radius: 12px;
  }

  .panel-title {
    font-size: 15px;
    line-height: 1.3;
  }

  .panel-subtitle {
    font-size: 11px;
    margin-bottom: 14px;
  }

  .info-panel-compact {
    padding: 12px 14px;
    margin-bottom: 12px;
    border-radius: 10px;
  }

  .info-title {
    font-size: 13px;
  }

  .info-list li {
    font-size: 11px;
    padding-left: 18px;
    line-height: 1.4;
  }

  .day-night-selector {
    margin-bottom: 14px;
    padding: 3px;
    border-radius: 8px;
  }

  .selector-btn {
    padding: 6px 10px;
    font-size: 10px;
  }

  .selector-icon {
    font-size: 13px;
  }

  .selector-text {
    font-size: 9px;
  }

  .flow-row-horizontal {
    gap: 10px 6px;
    margin-bottom: 8px;
  }

  .stage-icon {
    width: 58px;
    height: 58px;
    border-radius: 12px;
  }

  .panel-icon, .inversor-icon {
    width: 58px;
    height: 58px;
  }

  .destination-stage .stage-icon {
    width: 68px;
    height: 68px;
  }

  .stage-label {
    font-size: 10px;
    font-weight: 600;
  }

  .stage-desc {
    font-size: 8px;
  }

  .bifurcation-container {
    max-width: 180px;
    margin-bottom: 8px;
  }

  .flow-row-destinations {
    gap: 20px;
    margin-top: 8px;
  }

  .benefits-section {
    grid-template-columns: 1fr;
    gap: 6px;
    margin-top: 16px;
  }

  .benefit-card {
    padding: 10px;
    flex-direction: row;
    justify-content: flex-start;
    gap: 10px;
  }

  .benefit-icon {
    font-size: 20px;
  }

  .benefit-text {
    font-size: 11px;
  }
}

</style>