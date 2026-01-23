<template>
  <div class="panel3">
    <div class="panel-content">
      <!-- Sección de entradas en dos columnas -->
      <div class="inputs-container">
        <!-- Entrada de Consumo -->
        <div class="input-section">
          <h3 class="section-title">Ingrese el Consumo del Cliente</h3>
          <div class="input-group">
            <input 
              v-model.number="consumoCliente" 
              @input="calcularResultados"
              type="number" 
              placeholder="Ej: 212"
              class="consumo-input"
              min="70"
              max="2827"
            />
            <span class="input-unit">kWh/mes</span>
          </div>
          <p class="input-hint">Rango válido: 70 - 2,827 kWh/mes</p>
        </div>

        <!-- Entrada de Adicionales -->
        <div class="input-section">
          <h3 class="section-title">Adicionales</h3>
          <div class="input-group">
            <span class="currency-symbol">$</span>
            <input 
              v-model.number="adicionales" 
              @input="calcularResultados"
              type="number" 
              placeholder="0"
              class="adicionales-input"
              min="0"
            />
          </div>
          <p class="input-hint">Valor adicional al proyecto</p>
        </div>
      </div>

      <!-- Resultados dinámicos -->
      <div class="results-grid" v-if="resultados">
        <div class="result-card">
          <div class="result-icon">📊</div>
          <div class="result-content">
            <div class="result-label">Número de Paneles</div>
            <div class="result-value">{{ resultados.nPaneles }}</div>
          </div>
        </div>

        <div class="result-card">
          <div class="result-icon">⚡</div>
          <div class="result-content">
            <div class="result-label">Potencia</div>
            <div class="result-value">{{ resultados.potencia }} <span class="unit">kWp</span></div>
          </div>
        </div>

        <div class="result-card">
          <div class="result-icon">📐</div>
          <div class="result-content">
            <div class="result-label">Área Requerida</div>
            <div class="result-value">{{ resultados.area }} <span class="unit">m²</span></div>
          </div>
        </div>

        <div class="result-card">
          <div class="result-icon">⚖️</div>
          <div class="result-content">
            <div class="result-label">Peso Total</div>
            <div class="result-value">{{ resultados.peso }} <span class="unit">kg</span></div>
          </div>
        </div>

        <div class="result-card highlight">
          <div class="result-icon">💰</div>
          <div class="result-content">
            <div class="result-label">Valor Total del Proyecto</div>
            <div class="result-value-large">{{ formatearMoneda(resultados.valorTotalConAdicionales) }}</div>
            <div class="breakdown" v-if="adicionales > 0">
              <span class="breakdown-item">Base: {{ formatearMoneda(resultados.valorTotal) }}</span>
              <span class="breakdown-separator">+</span>
              <span class="breakdown-item">Adicionales: {{ formatearMoneda(adicionales) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensaje cuando no hay resultados -->
      <div class="no-results" v-else>
        <div class="no-results-icon">🔍</div>
        <p>Ingrese un consumo para ver los resultados</p>
      </div>

      <!-- Decoración de fondo -->
      <div class="panel-glow"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Datos extraídos del Excel
const datosExcel = [
  { nPaneles: 1, potencia: 0.62, generacion: 70, area: 2, peso: 30, valorTotal: 2418000 },
  { nPaneles: 2, potencia: 1.24, generacion: 141, area: 5, peso: 60, valorTotal: 4836000 },
  { nPaneles: 3, potencia: 1.86, generacion: 212, area: 8, peso: 90, valorTotal: 7254000 },
  { nPaneles: 4, potencia: 2.48, generacion: 282, area: 11, peso: 120, valorTotal: 9672000 },
  { nPaneles: 5, potencia: 3.1, generacion: 353, area: 14, peso: 150, valorTotal: 12090000 },
  { nPaneles: 6, potencia: 3.72, generacion: 424, area: 17, peso: 180, valorTotal: 14508000 },
  { nPaneles: 7, potencia: 4.34, generacion: 494, area: 20, peso: 210, valorTotal: 16926000 },
  { nPaneles: 8, potencia: 4.96, generacion: 565, area: 23, peso: 240, valorTotal: 19344000 },
  { nPaneles: 9, potencia: 5.58, generacion: 636, area: 26, peso: 270, valorTotal: 21762000 },
  { nPaneles: 10, potencia: 6.2, generacion: 706, area: 29, peso: 300, valorTotal: 24180000 },
  { nPaneles: 11, potencia: 6.82, generacion: 777, area: 31, peso: 330, valorTotal: 26598000 },
  { nPaneles: 12, potencia: 7.44, generacion: 848, area: 34, peso: 360, valorTotal: 29016000 },
  { nPaneles: 13, potencia: 8.06, generacion: 918, area: 37, peso: 390, valorTotal: 31434000 },
  { nPaneles: 14, potencia: 8.68, generacion: 989, area: 40, peso: 420, valorTotal: 33852000 },
  { nPaneles: 15, potencia: 9.3, generacion: 1060, area: 43, peso: 450, valorTotal: 36270000 },
  { nPaneles: 16, potencia: 9.92, generacion: 1130, area: 46, peso: 480, valorTotal: 38688000 },
  { nPaneles: 17, potencia: 10.54, generacion: 1201, area: 49, peso: 510, valorTotal: 41106000 },
  { nPaneles: 18, potencia: 11.16, generacion: 1272, area: 52, peso: 540, valorTotal: 43524000 },
  { nPaneles: 19, potencia: 11.78, generacion: 1342, area: 55, peso: 570, valorTotal: 45942000 },
  { nPaneles: 20, potencia: 12.4, generacion: 1413, area: 58, peso: 600, valorTotal: 48360000 },
  { nPaneles: 21, potencia: 13.02, generacion: 1484, area: 60, peso: 630, valorTotal: 50778000 },
  { nPaneles: 22, potencia: 13.64, generacion: 1554, area: 63, peso: 660, valorTotal: 53196000 },
  { nPaneles: 23, potencia: 14.26, generacion: 1625, area: 66, peso: 690, valorTotal: 55614000 },
  { nPaneles: 24, potencia: 14.88, generacion: 1696, area: 69, peso: 720, valorTotal: 58032000 },
  { nPaneles: 25, potencia: 15.5, generacion: 1767, area: 72, peso: 750, valorTotal: 60450000 },
  { nPaneles: 26, potencia: 16.12, generacion: 1837, area: 75, peso: 780, valorTotal: 62868000 },
  { nPaneles: 27, potencia: 16.74, generacion: 1908, area: 78, peso: 810, valorTotal: 65286000 },
  { nPaneles: 28, potencia: 17.36, generacion: 1979, area: 81, peso: 840, valorTotal: 67704000 },
  { nPaneles: 29, potencia: 17.98, generacion: 2049, area: 84, peso: 870, valorTotal: 70122000 },
  { nPaneles: 30, potencia: 18.6, generacion: 2120, area: 87, peso: 900, valorTotal: 72540000 },
  { nPaneles: 31, potencia: 19.22, generacion: 2191, area: 89, peso: 930, valorTotal: 74958000 },
  { nPaneles: 32, potencia: 19.84, generacion: 2261, area: 92, peso: 960, valorTotal: 77376000 },
  { nPaneles: 33, potencia: 20.46, generacion: 2332, area: 95, peso: 990, valorTotal: 79794000 },
  { nPaneles: 34, potencia: 21.08, generacion: 2403, area: 98, peso: 1020, valorTotal: 82212000 },
  { nPaneles: 35, potencia: 21.7, generacion: 2473, area: 101, peso: 1050, valorTotal: 84630000 },
  { nPaneles: 36, potencia: 22.32, generacion: 2544, area: 104, peso: 1080, valorTotal: 87048000 },
  { nPaneles: 37, potencia: 22.94, generacion: 2615, area: 107, peso: 1110, valorTotal: 89466000 },
  { nPaneles: 38, potencia: 23.56, generacion: 2685, area: 110, peso: 1140, valorTotal: 91884000 },
  { nPaneles: 39, potencia: 24.18, generacion: 2756, area: 113, peso: 1170, valorTotal: 94302000 },
  { nPaneles: 40, potencia: 24.8, generacion: 2827, area: 116, peso: 1200, valorTotal: 96720000 }
]

const consumoCliente = ref(null)
const adicionales = ref(0)
const resultados = ref(null)

// Función equivalente a COINCIDIR de Excel
const buscarCoincidencia = (valorBuscado) => {
  // Buscar el valor más cercano menor o igual
  for (let i = datosExcel.length - 1; i >= 0; i--) {
    if (datosExcel[i].generacion <= valorBuscado) {
      return i
    }
  }
  return 0 // Si no encuentra, devuelve el primero
}

// Calcular resultados basados en el consumo
const calcularResultados = () => {
  if (!consumoCliente.value || consumoCliente.value < 70) {
    resultados.value = null
    return
  }

  const indice = buscarCoincidencia(consumoCliente.value)
  const datos = datosExcel[indice]

  // Calcular valor total con adicionales
  const valorBase = datos.valorTotal
  const valorAdicionales = adicionales.value || 0
  const valorTotalConAdicionales = valorBase + valorAdicionales

  resultados.value = {
    nPaneles: datos.nPaneles,
    potencia: datos.potencia,
    area: datos.area,
    peso: datos.peso,
    valorTotal: valorBase,
    valorTotalConAdicionales: valorTotalConAdicionales
  }
}

// Formatear moneda colombiana
const formatearMoneda = (valor) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(valor)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');

.panel3 {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(14, 165, 233, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideInUp 0.6s ease-out 0.2s both;
  min-height: 500px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  grid-column: span 2;
  font-family: 'Montserrat', sans-serif;
}

.panel3:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 30px 80px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(14, 165, 233, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 1);
}

.panel-content {
  position: relative;
  z-index: 2;
}

/* Contenedor de entradas en dos columnas */
.inputs-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
  padding: 0 20px;
}

/* Sección de entrada */
.input-section {
  text-align: center;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;
  position: relative;
}

.consumo-input {
  font-size: 32px;
  font-weight: 700;
  font-family: 'Montserrat', sans-serif;
  color: #0ea5e9;
  border: 3px solid #0ea5e9;
  border-radius: 16px;
  padding: 16px 24px;
  width: 100%;
  max-width: 280px;
  text-align: center;
  outline: none;
  transition: all 0.3s ease;
  background: rgba(14, 165, 233, 0.05);
}

.consumo-input:focus {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.adicionales-input {
  font-size: 32px;
  font-weight: 700;
  font-family: 'Montserrat', sans-serif;
  color: #10b981;
  border: 3px solid #10b981;
  border-radius: 16px;
  padding: 16px 24px 16px 50px;
  width: 100%;
  max-width: 280px;
  text-align: right;
  outline: none;
  transition: all 0.3s ease;
  background: rgba(16, 185, 129, 0.05);
}

.adicionales-input:focus {
  border-color: #059669;
  background: rgba(5, 150, 105, 0.1);
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
}

.currency-symbol {
  position: absolute;
  left: 50%;
  transform: translateX(-125px);
  font-size: 32px;
  font-weight: 700;
  color: #10b981;
  pointer-events: none;
}

.input-unit {
  font-size: 20px;
  font-weight: 600;
  color: #64748b;
}

.input-hint {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 500;
  min-height: 20px;
}

/* Grid de resultados */
.results-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.result-card {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.05), rgba(59, 130, 246, 0.05));
  border: 2px solid rgba(14, 165, 233, 0.2);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  animation: fadeInScale 0.5s ease-out;
}

.result-card:hover {
  transform: translateY(-5px);
  border-color: rgba(14, 165, 233, 0.4);
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(59, 130, 246, 0.1));
  box-shadow: 0 10px 30px rgba(14, 165, 233, 0.2);
}

.result-card.highlight {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
  border-color: #0284c7;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.result-card.highlight:hover {
  background: linear-gradient(135deg, #0284c7, #2563eb);
  box-shadow: 0 15px 40px rgba(14, 165, 233, 0.4);
}

.result-icon {
  font-size: 40px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  flex-shrink: 0;
}

.result-card.highlight .result-icon {
  background: rgba(255, 255, 255, 0.95);
}

.result-content {
  flex: 1;
}

.result-label {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.result-card.highlight .result-label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  margin-bottom: 12px;
}

.result-value {
  font-size: 32px;
  font-weight: 800;
  color: #0ea5e9;
  line-height: 1;
}

.result-card.highlight .result-value-large {
  font-size: 36px;
  font-weight: 900;
  color: #ffffff;
  line-height: 1;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.unit {
  font-size: 18px;
  font-weight: 600;
  color: #64748b;
  margin-left: 4px;
}

/* Desglose del valor total */
.breakdown {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
  flex-wrap: wrap;
}

.breakdown-item {
  background: rgba(255, 255, 255, 0.15);
  padding: 6px 12px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.breakdown-separator {
  font-weight: 700;
  font-size: 16px;
}

/* Sin resultados */
.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
}

.no-results-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.no-results p {
  font-size: 18px;
  font-weight: 500;
}

/* Decoración de fondo */
.panel-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at 30% 50%,
    rgba(14, 165, 233, 0.08) 0%,
    transparent 50%
  );
  animation: rotate-glow 25s linear infinite;
  pointer-events: none;
}

/* Animaciones */
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

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes rotate-glow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 968px) {
  .inputs-container {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .currency-symbol {
    transform: translateX(-50%);
    margin-left: -110px;
  }
}

@media (max-width: 768px) {
  .panel3 {
    padding: 24px;
  }

  .inputs-container {
    padding: 0;
  }

  .section-title {
    font-size: 18px;
    min-height: 44px;
  }

  .consumo-input,
  .adicionales-input {
    font-size: 24px;
    max-width: 100%;
    padding: 12px 16px;
  }

  .adicionales-input {
    padding-left: 45px;
  }

  .currency-symbol {
    font-size: 24px;
    transform: translateX(-50%);
    margin-left: -120px;
  }

  .input-unit {
    font-size: 16px;
  }

  .results-grid {
    grid-template-columns: 1fr;
  }

  .result-card {
    padding: 20px;
  }

  .result-icon {
    font-size: 32px;
    width: 50px;
    height: 50px;
  }

  .result-value {
    font-size: 24px;
  }

  .result-card.highlight .result-value-large {
    font-size: 28px;
  }

  .breakdown {
    font-size: 12px;
    gap: 8px;
  }

  .breakdown-item {
    padding: 4px 10px;
  }
}
</style>