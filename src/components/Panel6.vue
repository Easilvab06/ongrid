<template>
  <div class="panel-conectado">
    <!-- HEADER -->
    <div class="header-section">
      <h2 class="panel-title">¿Cómo Funciona un Sistema Conectado a la Red?</h2>
      <p class="panel-subtitle">Visualiza el flujo de energía en tiempo real</p>
    </div>

    <!-- SELECTOR DÍA/NOCHE -->
    <div class="day-night-selector">
      <div class="selector-btn" @click="isDayMode = true" :class="{ active: isDayMode }">
        <span class="selector-icon">☀️</span>
        <span class="selector-text">Día (Generando)</span>
      </div>
      <div class="selector-divider"></div>
      <div class="selector-btn" @click="isDayMode = false" :class="{ active: !isDayMode }">
        <span class="selector-icon">🌙</span>
        <span class="selector-text">Noche (Consumiendo)</span>
      </div>
    </div>

    <!-- FLUJO DE ENERGÍA PRINCIPAL -->
    <div class="energy-flow-section">
      <!-- FILA 1: SOL → PANELES → INVERSOR → MEDIDOR (LINEAL) -->
      <div class="flow-row">
        <!-- SOL -->
        <div class="flow-stage">
          <div class="stage-icon sun-icon">
            <svg viewBox="0 0 100 100" class="sun-svg">
              <defs>
                <radialGradient id="sunGradient">
                  <stop offset="0%" stop-color="#fbbf24" />
                  <stop offset="100%" stop-color="#f59e0b" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <circle cx="50" cy="50" r="20" fill="url(#sunGradient)" filter="url(#glow)">
                <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite"/>
              </circle>
              <g class="sun-rays">
                <line x1="50" y1="10" x2="50" y2="2" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
                <line x1="73" y1="17" x2="78" y2="12" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
                <line x1="90" y1="50" x2="98" y2="50" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
                <line x1="73" y1="83" x2="78" y2="88" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
                <line x1="50" y1="90" x2="50" y2="98" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
                <line x1="27" y1="83" x2="22" y2="88" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
                <line x1="10" y1="50" x2="2" y2="50" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
                <line x1="27" y1="17" x2="22" y2="12" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
                <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="20s" repeatCount="indefinite"/>
              </g>
            </svg>
          </div>
          <div class="stage-label">Sol</div>
          <div class="stage-desc">Luz solar</div>
        </div>

        <!-- LÍNEA 1 -->
        <div class="flow-line">
          <svg viewBox="0 0 120 40" preserveAspectRatio="none" class="connection-line">
            <defs>
              <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.3"/>
                <stop offset="50%" stop-color="#10b981" stop-opacity="0.8"/>
                <stop offset="100%" stop-color="#10b981" stop-opacity="0.3"/>
              </linearGradient>
            </defs>
            <path d="M 0 20 Q 60 20 120 20" stroke="url(#lineGradient1)" stroke-width="3" fill="none" stroke-linecap="round"/>
            <circle r="4" fill="#fbbf24">
              <animateMotion dur="2s" repeatCount="indefinite" path="M 0 20 Q 60 20 120 20"/>
            </circle>
            <circle r="4" fill="#f59e0b">
              <animateMotion dur="2s" begin="0.5s" repeatCount="indefinite" path="M 0 20 Q 60 20 120 20"/>
            </circle>
          </svg>
        </div>

        <!-- PANELES -->
        <div class="flow-stage">
          <div class="stage-icon panel-icon">
            <svg viewBox="0 0 100 100" class="panel-svg">
              <defs>
                <linearGradient id="panelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#3b82f6"/>
                  <stop offset="100%" stop-color="#1d4ed8"/>
                </linearGradient>
              </defs>
              <rect x="15" y="20" width="70" height="60" rx="4" fill="url(#panelGradient)" stroke="#1e40af" stroke-width="2"/>
              <line x1="50" y1="20" x2="50" y2="80" stroke="#60a5fa" stroke-width="1" opacity="0.5"/>
              <line x1="15" y1="50" x2="85" y2="50" stroke="#60a5fa" stroke-width="1" opacity="0.5"/>
              <g class="energy-cells">
                <rect x="20" y="25" width="25" height="20" fill="#93c5fd" opacity="0.3">
                  <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" repeatCount="indefinite"/>
                </rect>
                <rect x="55" y="25" width="25" height="20" fill="#93c5fd" opacity="0.3">
                  <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" begin="0.3s" repeatCount="indefinite"/>
                </rect>
                <rect x="20" y="55" width="25" height="20" fill="#93c5fd" opacity="0.3">
                  <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" begin="0.6s" repeatCount="indefinite"/>
                </rect>
                <rect x="55" y="55" width="25" height="20" fill="#93c5fd" opacity="0.3">
                  <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" begin="0.9s" repeatCount="indefinite"/>
                </rect>
              </g>
            </svg>
          </div>
          <div class="stage-label">Paneles</div>
          <div class="stage-desc">Generan DC</div>
        </div>
        <!-- LÍNEA 2 -->
        <div class="flow-line">
          <svg viewBox="0 0 120 40" preserveAspectRatio="none" class="connection-line">
            <defs>
              <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.3"/>
                <stop offset="50%" stop-color="#8b5cf6" stop-opacity="0.8"/>
                <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.3"/>
              </linearGradient>
            </defs>
            <path d="M 0 20 Q 60 20 120 20" stroke="url(#lineGradient2)" stroke-width="3" fill="none" stroke-linecap="round"/>
            <circle r="4" fill="#3b82f6">
              <animateMotion dur="2s" repeatCount="indefinite" path="M 0 20 Q 60 20 120 20"/>
            </circle>
            <circle r="4" fill="#60a5fa">
              <animateMotion dur="2s" begin="0.5s" repeatCount="indefinite" path="M 0 20 Q 60 20 120 20"/>
            </circle>
          </svg>
        </div>
        
        <!-- INVERSOR -->
        <div class="flow-stage">
          <div class="stage-icon inversor-icon">
            <svg viewBox="0 0 100 100" class="inversor-svg">
              <defs>
                <linearGradient id="inversorGradient">
                  <stop offset="0%" stop-color="#8b5cf6"/>
                  <stop offset="100%" stop-color="#6366f1"/>
                </linearGradient>
              </defs>
              <rect x="20" y="20" width="60" height="60" rx="8" fill="url(#inversorGradient)" stroke="#4f46e5" stroke-width="2"/>
              <g class="inversor-waves">
                <path d="M 30 50 Q 40 40, 50 50 T 70 50" stroke="#a78bfa" stroke-width="3" fill="none" stroke-linecap="round">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite"/>
                </path>
                <path d="M 30 50 Q 40 40, 50 50 T 70 50" stroke="#c4b5fd" stroke-width="2" fill="none" stroke-linecap="round">
                  <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite"/>
                </path>
              </g>
              <circle cx="35" cy="35" r="3" fill="#22c55e">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="0.8s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </div>
          <div class="stage-label">Inversor</div>
          <div class="stage-desc">Convierte AC</div>
        </div>

        <!-- LÍNEA 3 -->
        <div class="flow-line">
          <svg viewBox="0 0 120 40" preserveAspectRatio="none" class="connection-line">
            <defs>
              <linearGradient id="lineGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.3"/>
                <stop offset="50%" stop-color="#6366f1" stop-opacity="0.8"/>
                <stop offset="100%" stop-color="#6366f1" stop-opacity="0.3"/>
              </linearGradient>
            </defs>
            <path d="M 0 20 Q 60 20 120 20" stroke="url(#lineGradient3)" stroke-width="3" fill="none" stroke-linecap="round"/>
            <circle r="4" fill="#8b5cf6">
              <animateMotion dur="2s" repeatCount="indefinite" path="M 0 20 Q 60 20 120 20"/>
            </circle>
            <circle r="4" fill="#a78bfa">
              <animateMotion dur="2s" begin="0.5s" repeatCount="indefinite" path="M 0 20 Q 60 20 120 20"/>
            </circle>
          </svg>
        </div>

        <!-- MEDIDOR -->
        <div class="flow-stage">
          <div class="stage-icon medidor-icon">
            <div class="medidor-container">
              <div class="medidor-display">
                <div class="display-value" :class="{ day: isDayMode, night: !isDayMode }">
                  {{ isDayMode ? '→' : '←' }}
                </div>
              </div>
              <div class="medidor-wheel" :class="{ spinning: isDayMode, reverse: !isDayMode }"></div>
              <div class="medidor-indicator"></div>
            </div>
          </div>
          <div class="stage-label">Medidor</div>
          <div class="stage-desc">Bidirecional</div>
        </div>
      </div>

      <!-- FILA 2: BIFURCACIÓN CLARA DESDE MEDIDOR -->
      <div class="bifurcation-wrapper">
        <svg viewBox="0 0 400 150" class="bifurcation-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="branchHouse" x1="50%" y1="0%" x2="25%" y2="100%">
              <stop offset="0%" stop-color="#6366f1" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#10b981" stop-opacity="0.8"/>
            </linearGradient>
            <linearGradient id="branchRed" x1="50%" y1="0%" x2="75%" y2="100%">
              <stop offset="0%" stop-color="#6366f1" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0.8"/>
            </linearGradient>
          </defs>

          <line x1="200" y1="0" x2="200" y2="40" stroke="#6366f1" stroke-width="4" stroke-linecap="round"/>

          <path d="M 200 40 Q 140 80, 100 140" stroke="url(#branchHouse)" stroke-width="5" fill="none" stroke-linecap="round"/>
          <circle r="5" fill="#10b981" v-if="isDayMode">
            <animateMotion dur="2s" repeatCount="indefinite" path="M 200 40 Q 140 80, 100 140"/>
          </circle>

          <path d="M 200 40 Q 260 80, 300 140" stroke="url(#branchRed)" stroke-width="5" fill="none" stroke-linecap="round"/>
          <circle r="5" fill="#0ea5e9" v-if="!isDayMode">
            <animateMotion dur="2s" repeatCount="indefinite" path="M 200 40 Q 260 80, 300 140"/>
          </circle>

          <text x="100" y="155" font-size="13" font-weight="bold" fill="#10b981" text-anchor="middle">Casa</text>
          <text x="300" y="155" font-size="13" font-weight="bold" fill="#0ea5e9" text-anchor="middle">Red</text>
        </svg>
      </div>

      <!-- FILA 3: CASA Y RED (Destinos finales) -->
      <div class="destinations-final">
        <!-- CASA -->
        <div class="flow-stage">
          <div class="stage-icon house-icon">
            <div class="house-container">
              <div class="roof"></div>
              <div class="house-body">
                <div class="door">
                  <div class="door-handle"></div>
                </div>
                <div class="window window-left">
                  <div class="window-pane"></div>
                  <div class="window-pane"></div>
                  <div class="window-pane"></div>
                  <div class="window-pane"></div>
                </div>
                <div class="window window-right">
                  <div class="window-pane"></div>
                  <div class="window-pane"></div>
                  <div class="window-pane"></div>
                  <div class="window-pane"></div>
                </div>
              </div>
              <div class="house-base"></div>
              <div class="chimney">
                <div class="smoke smoke-1"></div>
                <div class="smoke smoke-2"></div>
                <div class="smoke smoke-3"></div>
              </div>
              <div class="house-glow"></div>
            </div>
          </div>
          <div class="stage-label">Tu Casa</div>
          <div class="stage-desc">Consumo</div>
        </div>

        <!-- RED PÚBLICA -->
        <div class="flow-stage">
          <div class="stage-icon red-icon">
            <div class="red-container">
              <div class="tower tower-left"></div>
              <div class="tower tower-right"></div>
              <svg viewBox="0 0 100 100" class="transmission-lines">
                <path d="M 20 40 Q 50 20 80 40" stroke="#0ea5e9" stroke-width="2" fill="none" opacity="0.6">
                  <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1.5s" repeatCount="indefinite"/>
                </path>
                <path d="M 20 55 Q 50 35 80 55" stroke="#06b6d4" stroke-width="2" fill="none" opacity="0.5">
                  <animate attributeName="opacity" values="0.3;0.7;0.3" dur="1.5s" begin="0.5s" repeatCount="indefinite"/>
                </path>
                <path d="M 20 70 Q 50 50 80 70" stroke="#0284c7" stroke-width="2" fill="none" opacity="0.6">
                  <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1.5s" begin="1s" repeatCount="indefinite"/>
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
    <div class="benefits-row">
      <div class="benefit-item">
        <span class="benefit-icon">💰</span>
        <span class="benefit-text">Factura reducida</span>
      </div>
      <div class="benefit-item">
        <span class="benefit-icon">🔄</span>
        <span class="benefit-text">Conexión bidireccional</span>
      </div>
      <div class="benefit-item">
        <span class="benefit-icon">📊</span>
        <span class="benefit-text">Monitoreo en vivo</span>
      </div>
      <div class="benefit-item">
        <span class="benefit-icon">🌍</span>
        <span class="benefit-text">Energía limpia 24/7</span>
      </div>
    </div>

    <!-- INFORMACIÓN CONTEXTUAL -->
    <div class="info-boxes">
      <div class="info-box day-info" v-if="isDayMode">
        <h4>🌞 Durante el Día</h4>
        <ul>
          <li>El sistema solar fotovoltaico genera energía de forma constante</li>
          <li>Alimenta directamente las cargas de la vivienda</li>
          <li>Cuando la producción es mayor al consumo, los excedentes se inyectan a la red eléctrica</li>
        </ul>
      </div>
      <div class="info-box night-info" v-else>
        <h4>🌙 Durante la Noche</h4>
        <ul>
          <li>El sistema solar no está generando</li>
          <li>La red eléctrica suministra energía a la vivienda</li>
          <li>Se consume de la red cuando el sistema no está generando</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isDayMode = ref(true)
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

.panel-conectado {
  background: linear-gradient(135deg, #f8fafc 0%, #f0fdf4 100%);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  position: relative;
  overflow: hidden;
  animation: slideInUp 0.6s ease-out;
  min-height: auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
  grid-column: span 2;
  font-family: 'Inter', sans-serif;
}

@keyframes slideInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

.header-section {
  text-align: center;
  margin-bottom: 10px;
}

.panel-title {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, #1e3a8a 0%, #0369a1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 8px 0;
}

.panel-subtitle {
  font-size: 16px;
  color: #64748b;
  margin: 0;
}

.day-night-selector {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0;
  background: rgba(226, 232, 240, 0.5);
  padding: 8px;
  border-radius: 14px;
  width: fit-content;
  margin: 0 auto;
  backdrop-filter: blur(10px);
}

.selector-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  border: none;
  background: transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  color: #64748b;
  font-size: 14px;
}

.selector-btn:hover { background: rgba(255, 255, 255, 0.3); }
.selector-btn.active {
  background: white;
  color: #1e293b;
  box-shadow: 0 4px 15px rgba(30, 58, 138, 0.15);
}

.selector-icon { font-size: 20px; }
.selector-divider {
  width: 1px;
  height: 30px;
  background: rgba(148, 163, 184, 0.2);
}

.energy-flow-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  margin: 20px 0;
}

.flow-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  width: 100%;
}

.flow-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stage-icon {
  font-size: 48px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.sun-icon { animation: sun-glow 6s ease-in-out infinite; }
.panel-icon { animation: panel-glow 6s ease-in-out 0.3s infinite; }
.inversor-icon { animation: inversor-glow 6s ease-in-out 0.6s infinite; }
.medidor-icon { animation: medidor-glow 6s ease-in-out 0.9s infinite; }
.house-icon { animation: house-glow 6s ease-in-out 1.2s infinite; }
.red-icon { animation: red-glow 6s ease-in-out 1.5s infinite; }

@keyframes sun-glow {
  0%, 100% { box-shadow: 0 8px 24px rgba(245, 158, 11, 0.2), 0 0 30px rgba(245, 158, 11, 0.1); transform: scale(1); }
  50% { box-shadow: 0 12px 40px rgba(245, 158, 11, 0.5), 0 0 60px rgba(245, 158, 11, 0.3); transform: scale(1.05); }
}

@keyframes panel-glow {
  0%, 100% { box-shadow: 0 8px 24px rgba(16, 185, 129, 0.2), 0 0 30px rgba(16, 185, 129, 0.1); transform: scale(1); }
  50% { box-shadow: 0 12px 40px rgba(16, 185, 129, 0.5), 0 0 60px rgba(16, 185, 129, 0.3); transform: scale(1.05); }
}

@keyframes inversor-glow {
  0%, 100% { box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2), 0 0 30px rgba(139, 92, 246, 0.1); transform: scale(1); }
  50% { box-shadow: 0 12px 40px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.3); transform: scale(1.05); }
}

@keyframes medidor-glow {
  0%, 100% { box-shadow: 0 8px 24px rgba(99, 102, 241, 0.2), 0 0 30px rgba(99, 102, 241, 0.1); transform: scale(1); }
  50% { box-shadow: 0 12px 40px rgba(99, 102, 241, 0.5), 0 0 60px rgba(99, 102, 241, 0.3); transform: scale(1.05); }
}

@keyframes house-glow {
  0%, 100% { box-shadow: 0 8px 24px rgba(34, 197, 94, 0.2), 0 0 30px rgba(34, 197, 94, 0.1); transform: scale(1); }
  50% { box-shadow: 0 12px 40px rgba(34, 197, 94, 0.5), 0 0 60px rgba(34, 197, 94, 0.3); transform: scale(1.05); }
}

@keyframes red-glow {
  0%, 100% { box-shadow: 0 8px 24px rgba(14, 165, 233, 0.2), 0 0 30px rgba(14, 165, 233, 0.1); transform: scale(1); }
  50% { box-shadow: 0 12px 40px rgba(14, 165, 233, 0.5), 0 0 60px rgba(14, 165, 233, 0.3); transform: scale(1.05); }
}

.stage-icon:hover {
  transform: scale(1.12);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.stage-label {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
}

.stage-desc {
  font-size: 12px;
  color: #64748b;
}

.flow-line {
  width: 60px;
  height: 20px;
  position: relative;
  margin: 0 8px;
}

.flow-line svg {
  width: 100%;
  height: 100%;
}

.bifurcation-wrapper {
  width: 100%;
  max-width: 500px;
  margin: 20px auto 0;
  padding: 0 20px;
}

.bifurcation-svg {
  width: 100%;
  height: auto;
  min-height: 200px;
}

.destinations-final {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 80px;
  margin-top: 20px;
}

.medidor-container {
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.medidor-display {
  position: absolute;
  width: 45px;
  height: 35px;
  background: linear-gradient(135deg, #1e293b, #334155);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #475569;
  z-index: 3;
  box-shadow: inset 0 4px 12px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.1);
}

.display-value {
  font-size: 18px;
  font-weight: 800;
  transition: all 0.6s ease;
  min-width:30px;
text-align: center;
}
.display-value.day {
color: #10b981;
text-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}
.display-value.night {
color: #ef4444;
text-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
}
.medidor-wheel {
position: absolute;
width: 45px;
height: 45px;
border: 2px solid #6366f1;
border-radius: 50%;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
opacity: 0.4;
}
.medidor-wheel.spinning { animation: wheel-spin 3s linear infinite; }
.medidor-wheel.reverse { animation: wheel-spin-reverse 3s linear infinite; }
@keyframes wheel-spin {
0% { transform: translate(-50%, -50%) rotate(0deg); }
100% { transform: translate(-50%, -50%) rotate(360deg); }
}
@keyframes wheel-spin-reverse {
0% { transform: translate(-50%, -50%) rotate(0deg); }
100% { transform: translate(-50%, -50%) rotate(-360deg); }
}
.medidor-indicator {
position: absolute;
width: 2px;
height: 14px;
background: linear-gradient(180deg, #6366f1, #a5b4fc);
border-radius: 2px;
top: 16px;
left: 50%;
transform: translateX(-50%);
z-index: 2;
animation: indicator-pulse 1.5s ease-in-out infinite;
}
@keyframes indicator-pulse {
0%, 100% { height: 14px; opacity: 1; }
50% { height: 18px; opacity: 0.7; }
}
.red-container {
position: relative;
width: 60px;
height: 60px;
}
.tower {
position: absolute;
bottom: 0;
width: 3px;
height: 28px;
background: linear-gradient(180deg, #0284c7, #0c4a6e);
border-radius: 2px;
}
.tower-left {
left: 12px;
animation: tower-sway 3s ease-in-out infinite;
}
.tower-right {
right: 12px;
animation: tower-sway 3s ease-in-out 0.5s infinite;
}
@keyframes tower-sway {
0%, 100% { transform: scaleY(1); opacity: 0.8; }
50% { transform: scaleY(1.05); opacity: 1; }
}
.transmission-lines {
position: absolute;
top: 12px;
width: 100%;
height: 45px;
}

.house-container {
  position: relative;
  width: 60px;
  height: 60px;
}

.roof {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 18px solid #b45309;
  filter: drop-shadow(0 2px 8px rgba(139, 69, 19, 0.3));
  animation: roof-shine 3s ease-in-out infinite;
}

@keyframes roof-shine {
  0%, 100% { filter: drop-shadow(0 2px 8px rgba(139, 69, 19, 0.3)); }
  50% { filter: drop-shadow(0 4px 16px rgba(180, 83, 9, 0.6)); }
}

.house-body {
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 28px;
  background: linear-gradient(135deg, #dc2626, #991b1b);
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(220, 38, 38, 0.25);
  animation: body-pulse 2.5s ease-in-out infinite;
}

@keyframes body-pulse {
  0%, 100% { box-shadow: 0 4px 16px rgba(220, 38, 38, 0.25); }
  50% { box-shadow: 0 6px 24px rgba(220, 38, 38, 0.4); }
}

.door {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 14px;
  background: #78350f;
  border-radius: 3px 3px 0 0;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.door-handle {
  position: absolute;
  right: 2px;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 2px;
  background: #fbbf24;
  border-radius: 50%;
  animation: door-shine 2s ease-in-out infinite;
}

@keyframes door-shine {
  0%, 100% { opacity: 0.6; box-shadow: 0 0 4px rgba(251, 191, 36, 0.4); }
  50% { opacity: 1; box-shadow: 0 0 8px rgba(251, 191, 36, 0.8); }
}

.window {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #1e40af;
  border-radius: 2px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3), 0 0 8px rgba(30, 64, 175, 0.2);
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  padding: 1px;
  gap: 1px;
}

.window-left { top: 8px; left: 6px; }
.window-right { top: 8px; right: 6px; }

.window-pane {
  background: #3b82f6;
  border-radius: 1px;
  animation: light-flicker 3s ease-in-out infinite;
}

.window-pane:nth-child(1) { animation-delay: 0s; }
.window-pane:nth-child(2) { animation-delay: 0.3s; }
.window-pane:nth-child(3) { animation-delay: 0.6s; }
.window-pane:nth-child(4) { animation-delay: 0.9s; }

@keyframes light-flicker {
  0%, 100% { background: #3b82f6; box-shadow: 0 0 6px rgba(59, 130, 246, 0.4); }
  50% { background: #60a5fa; box-shadow: 0 0 10px rgba(96, 165, 250, 0.7); }
}

.house-base {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 42px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #78350f, transparent);
  border-radius: 2px;
  opacity: 0.6;
}

.chimney {
  position: absolute;
  top: 6px;
  right: 8px;
  width: 4px;
  height: 12px;
  background: #5b2109;
  border-radius: 2px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.smoke {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: #d1d5db;
  border-radius: 50%;
  opacity: 0.8;
}

.smoke-1 { animation: smoke-rise 2.5s ease-out infinite; }
.smoke-2 { animation: smoke-rise 2.5s ease-out 0.7s infinite; }
.smoke-3 { animation: smoke-rise 2.5s ease-out 1.4s infinite; }

@keyframes smoke-rise {
  0% { transform: translateX(-50%) translateY(0); opacity: 0.8; }
  50% { transform: translateX(-50%) translateY(-10px); opacity: 0.4; }
  100% { transform: translateX(-50%) translateY(-20px); opacity: 0; width: 6px; height: 6px; }
}

.house-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70px;
  height: 70px;
  background: radial-gradient(circle, rgba(220, 38, 38, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  animation: glow-pulse 3s ease-in-out infinite;
  pointer-events: none;
}

@keyframes glow-pulse {
  0%, 100% { filter: blur(4px); opacity: 0.3; }
  50% { filter: blur(8px); opacity: 0.6; }
}

.benefits-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin: 20px 0;
}

.benefit-item {
  background: linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%);
  border: 1px solid rgba(30, 58, 138, 0.1);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.benefit-item:hover {
  transform: translateY(-5px);
  border-color: rgba(30, 58, 138, 0.3);
  background: linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
  box-shadow: 0 8px 24px rgba(30, 58, 138, 0.15);
}

.benefit-icon { font-size: 28px; }
.benefit-text { font-size: 12px; font-weight: 600; color: #1e293b; }

.info-boxes { margin-top: 20px; }

.info-box {
  background: white;
  border-left: 4px solid #1e3a8a;
  border-radius: 12px;
  padding: 20px;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.day-info {
  border-left-color: #f59e0b;
  background: linear-gradient(135deg, rgba(245, 176, 39, 0.05) 0%, rgba(245, 158, 11, 0.05) 100%);
}

.night-info {
  border-left-color: #0369a1;
  background: linear-gradient(135deg, rgba(3, 105, 161, 0.05) 0%, rgba(30, 58, 138, 0.05) 100%);
}

.info-box h4 { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0 0 12px 0; }

.info-box ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-box li {
  font-size: 14px;
  color: #475569;
  padding-left: 24px;
  position: relative;
}

.info-box li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #10b981;
  font-weight: bold;
  font-size: 16px;
}

@media (max-width: 1024px) {
  .benefits-row { grid-template-columns: repeat(2, 1fr); }
  .destinations-final { gap: 50px; }
}

@media (max-width: 768px) {
  .panel-conectado { padding: 32px 20px; }
  .panel-title { font-size: 24px; }
  .energy-flow-section { gap: 20px; }
  .flow-row { flex-direction: column; gap: 15px; }
  .flow-line { width: 20px; height: 60px; margin: 0; transform: rotate(90deg); }
  .bifurcation-svg { min-height: 150px; }
  .destinations-final { flex-direction: column; gap: 30px; }
  .benefits-row { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .benefit-text { font-size: 11px; }
  .stage-icon { width: 70px; height: 70px; font-size: 40px; }
}

@media (max-width: 480px) {
  .panel-conectado { padding: 24px 16px; gap: 20px; }
  .panel-title { font-size: 20px; }
  .stage-icon { width: 60px; height: 60px; font-size: 32px; }
  .benefits-row { grid-template-columns: 1fr; }
  .selector-btn { padding: 10px 16px; font-size: 12px; }
  .destinations-final { gap: 20px; }
  .bifurcation-svg { min-height: 120px; }
}
</style>
```

---

¡Listo! Ahora tienes el código completo dividido en 4 partes más manejables. Los paneles de "Tu Casa 30%" y "Red Pública 70%" han sido eliminados correctamente.
