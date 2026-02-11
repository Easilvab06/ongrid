<template>
  <div class="panel8">
    <div class="relative z-10 flex flex-col h-full">
      <!-- Título principal -->
      <div class="title-section">
        <h3 class="panel-title">Proyección Flujo de Caja</h3>
        <div class="title-decoration"></div>
      </div>

      <!-- Contenedor del gráfico -->
      <div class="chart-container" v-if="chartData.length > 0">
        <Bar :key="chartKey" :data="chartJsData" :options="chartOptions" :plugins="chartPlugins" />
      </div>



      <!-- KPIs inferiores -->
      <div class="kpi-section">
        <div class="kpi-item">
          <div class="kpi-label">Inversión Inicial</div>
          <div class="kpi-value">{{ formatearMoneda(inversionInicial) }}</div>
        </div>
        <div class="kpi-item highlight">
          <div class="kpi-label">Payback</div>
          <div class="kpi-value">{{ paybackYears }}</div>
        </div>
        <div class="kpi-item">
          <div class="kpi-label">Ahorro 10 años</div>
          <div class="kpi-value">{{ formatearMoneda(ahorroTotal10Anos) }}</div>
        </div>
        <div class="kpi-item">
          <div class="kpi-label">ROI %</div>
          <div class="kpi-value">{{ roiPercentage }}%</div>
        </div>
      </div>

      <!-- Partículas decorativas -->
      <div class="particles-container">
        <div class="particle-dot"></div>
        <div class="particle-dot"></div>
        <div class="particle-dot"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useCotizacionStore } from '../store/cotizacion.js'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'vue-chartjs'

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const cotizacionStore = useCotizacionStore()

// Datos reactivos
const inversionInicial = ref(0)
const ahorroAnual = ref(0)
const proyectionData = ref([])
const chartKey = ref(0)

// Datos extraídos del Excel (copiados de Panel3)
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

// Función para buscar coincidencia por generación
const buscarCoincidenciaPorGeneracion = (generacionBuscada) => {
  for (let i = datosExcel.length - 1; i >= 0; i--) {
    if (datosExcel[i].generacion <= generacionBuscada) {
      return i
    }
  }
  return 0
}

// ✅ FUNCIÓN PRINCIPAL: Calcular flujo de caja CORRECTAMENTE
const calcularFlujoCaja = () => {
  console.log('📊 Panel8 - Calculando flujo de caja...')

  // Obtener valores del store (con valores por defecto)
  const costoTotal = cotizacionStore.costoTotal || 0
  const generacion = cotizacionStore.generacion || 0
  const tarifaElectricidad = cotizacionStore.tarifaElectricidad || 1000
  const incrementoAnual = (cotizacionStore.incrementoAnual || 0) / 100

  // ✅ CÁLCULO CORRECTO - Ahorro mensual
  const ahorroMensual = generacion * tarifaElectricidad
  console.log('Ahorro Mensual:', ahorroMensual)

  // Ahorro anual base (sin incremento)
  const ahorroAnualBase = ahorroMensual * 12
  console.log('Ahorro Anual Base:', ahorroAnualBase)

  inversionInicial.value = -costoTotal
  ahorroAnual.value = ahorroAnualBase

  // Generar proyección para 10 años
  const nuevosDatos = []
  let saldoAcumulado = -costoTotal

  for (let año = 0; año <= 10; año++) {
    if (año === 0) {
      nuevosDatos.push({
        año: 0,
        saldo: -costoTotal,
        ahorroAnual: 0
      })
    } else {
      // ✅ Aplicar incremento anual correcto
      const ahorroAñoActual = ahorroAnualBase * Math.pow(1 + incrementoAnual, año)
      saldoAcumulado += ahorroAñoActual

      nuevosDatos.push({
        año: año,
        saldo: saldoAcumulado,
        ahorroAnual: ahorroAñoActual
      })

      console.log(`Año ${año}: Ahorro: ${ahorroAñoActual.toFixed(0)}, Saldo: ${saldoAcumulado.toFixed(0)}`)
    }
  }

  proyectionData.value = nuevosDatos
  chartKey.value++ // Force chart re-render
  console.log('✅ Datos finales - Saldo Año 10:', nuevosDatos[10]?.saldo.toFixed(0) || 'N/A')
}

// ✅ WATCHERS: Escuchar cambios en el store
watch(
  () => cotizacionStore.costoTotal,
  (newVal) => {
    if (newVal > 0 && cotizacionStore.generacion > 0) {
      calcularFlujoCaja()
    }
  },
  { immediate: true }
)

watch(
  () => cotizacionStore.generacion,
  (newVal) => {
    if (newVal > 0 && cotizacionStore.costoTotal > 0) {
      calcularFlujoCaja()
    }
  },
  { immediate: true }
)

// Mostrar años seleccionados (0, 1, 2, 3, 4, 5, 10)
const chartData = computed(() => {
  if (proyectionData.value.length === 0) return []
  
  return [
    proyectionData.value[0],   // Año 0
    proyectionData.value[1],   // Año 1
    proyectionData.value[2],   // Año 2
    proyectionData.value[3],   // Año 3
    proyectionData.value[4],   // Año 4
    proyectionData.value[5],   // Año 5
    proyectionData.value[10]   // Año 10
  ]
})

// Calcular el año de payback
const paybackYears = computed(() => {
  const payback = proyectionData.value.find(item => item.saldo >= 0)
  if (!payback) return 'No recuperado'
  
  // Interpolar para encontrar el año exacto
  if (payback.año === 0) return 'Año 0.0'
  
  const previousYear = proyectionData.value[payback.año - 1]
  if (!previousYear || previousYear.saldo >= 0) {
    return `Año ${payback.año.toFixed(1)}`
  }
  
  // Calcular fracción del año
  const diferencia = payback.saldo - previousYear.saldo
  const fraccion = Math.abs(previousYear.saldo) / diferencia
  const exactYear = payback.año - 1 + fraccion
  
  return `Año ${exactYear.toFixed(1)}`
})

// Ahorro total a 10 años (saldo acumulado)
const ahorroTotal10Anos = computed(() => {
  if (proyectionData.value.length === 0) return 0
  // El saldo ya incluye la inversión inicial negativa
  // Pero el KPI debe mostrar solo el ahorro neto
  const saldo10 = proyectionData.value[10]?.saldo || 0
  return saldo10
})

// Calcular porcentaje para línea de break-even
const breakEvenPercentage = computed(() => {
  const payback = paybackYears.value
  if (payback === 'No recuperado') return 0

  const yearMatch = payback.match(/Año (\d+\.?\d*)/)
  if (!yearMatch) return 0

  const paybackYear = parseFloat(yearMatch[1])
  // Calcular porcentaje desde la parte inferior (año 0 = 100%, año 10 = 0%)
  return ((10 - paybackYear) / 10) * 100
})

// ROI percentage - Ganancia total / Inversión × 100
const roiPercentage = computed(() => {
  if (inversionInicial.value === 0) return 0
  
  // ROI = (Ganancia Final - Inversión Inicial) / |Inversión Inicial| × 100
  // Ganancia Final = Saldo a año 10
  const gananciaNeta = ahorroTotal10Anos.value - inversionInicial.value
  const roi = (gananciaNeta / Math.abs(inversionInicial.value)) * 100
  
  console.log('ROI Cálculo:', {
    ahorroTotal10Anos: ahorroTotal10Anos.value,
    inversionInicial: inversionInicial.value,
    gananciaNeta: gananciaNeta,
    roi: roi
  })
  
  return Math.round(roi)
})

// Configuración de Chart.js
const chartJsData = computed(() => {
  if (chartData.value.length === 0) return { labels: [], datasets: [] }

  return {
    labels: chartData.value.map(item => `Año ${item.año}`),
    datasets: [{
      label: 'Flujo de Caja',
      data: chartData.value.map(item => item.saldo),
      backgroundColor: chartData.value.map(item =>
        item.saldo < 0
          ? '#ef4444'
          : '#3b82f6'
      ),
      borderColor: chartData.value.map(item =>
        item.saldo < 0 ? '#dc2626' : '#0891b2'
      ),
      borderWidth: 1,
      borderRadius: 8,
      borderSkipped: false,
      barThickness: 40,
      maxBarThickness: 50,
    }]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      callbacks: {
        label: function(context) {
          return formatMillion(context.parsed.y)
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#64748b',
        font: {
          size: 12,
          weight: '600'
        }
      }
    },
    y: {
      beginAtZero: false,
      grid: {
        color: '#f1f5f9'
      },
      ticks: {
        color: '#64748b',
        font: {
          size: 12,
          weight: '500'
        },
        callback: function(value) {
          return formatMillion(value)
        }
      }
    }
  },
  elements: {
    bar: {
      borderRadius: 8
    }
  },
  animation: {
    duration: 1000,
    easing: 'easeOutQuart'
  },
  onResize: function(chart, size) {
    // Force re-render on resize to ensure visibility
    chart.update('none')
  }
}))

const chartPlugins = [
  {
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart) => {
      const ctx = chart.canvas.getContext('2d')
      ctx.save()
      ctx.globalCompositeOperation = 'destination-over'
      ctx.fillStyle = 'transparent'
      ctx.fillRect(0, 0, chart.width, chart.height)
      ctx.restore()
    }
  }
]

// Formatear a millones
const formatMillion = (value) => {
  const millones = value / 1000000
  if (millones >= 0) {
    return `$${millones.toFixed(1)}M`
  } else {
    return `-$${Math.abs(millones).toFixed(1)}M`
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

  // ✅ INICIALIZAR EN MONTAJE
onMounted(() => {
  console.log('🚀 Panel8 montado')
  // Panel8 now relies on Panel3 to load URL data and update the store
  // The watchers will automatically recalculate when store values change
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

.panel8 {
  background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #f0fdf4 100%);
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  width: 100%;
  margin: 0;
}

.panel8::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

/* ESTILOS BASE DEL GRÁFICO */
.title-section {
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

.title-decoration {
  height: 4px;
  width: 60px;
  background: linear-gradient(to right, #3b82f6, #10b981);
  border-radius: 2px;
  margin: 16px auto 0;
}

.chart-container {
  margin-bottom: 32px;
  flex: 1;
  min-height: 300px;
  position: relative;
  z-index: 1;
}

.chart-canvas {
  height: 300px !important;
  width: 100% !important;
}

.y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-end;
  padding-right: 12px;
  border-right: 2px solid #e2e8f0;
  text-align: right;
}

.y-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
  min-width: 40px;
}

.chart-content {
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 24px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e2e8f0;
  padding-left: 0;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
  scroll-behavior: smooth;
}

.chart-content::-webkit-scrollbar {
  height: 6px;
}

.chart-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.chart-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.chart-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column-reverse;
  pointer-events: none;
}

.grid-line {
  flex: 1;
  border-top: 1px solid #f1f5f9;
}

.bars-wrapper {
  display: flex;
  gap: 24px;
  align-items: flex-end;
  justify-content: space-around;
  flex: 1;
  position: relative;
  z-index: 1;
  width: 100%;
  min-width: max-content;
}

.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 50px;
  flex: 0 0 auto;
  position: relative;
  height: 100%;
}

  .bar {
    width: 40px;
    background: linear-gradient(135deg, #3b82f6 0%, #0891b2 100%);
    border-radius: 8px 8px 0 0;
    min-height: 20px;
    position: absolute;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
    transition: all 0.3s ease;
    cursor: pointer;
    min-width: 20px;
  }

.bar:hover {
  transform: scaleY(1.05);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
}

.bar-positive {
  background: linear-gradient(135deg, #3b82f6 0%, #0891b2 100%);
}

.bar-negative {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 0 0 8px 8px;
}

.bar-negative .bar-value {
  top: auto;
  bottom: -24px;
}

  .bar-value {
    position: absolute;
    top: -24px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    font-weight: 700;
    color: #0f172a;
    white-space: nowrap;
    display: block !important;
  }

.bar-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-align: center;
  width: 100%;
  white-space: nowrap;
}

.breakeven-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(to right, transparent, #f59e0b, transparent);
  z-index: 2;
}

/* KPIs SECTION */
.kpi-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 24px;
  margin-top: 24px;
  background: linear-gradient(135deg, #f0f9ff 0%, #f0fdf4 100%);
  border-radius: 16px;
  position: relative;
  z-index: 1;
}

.kpi-item {
  text-align: center;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.kpi-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.kpi-item.highlight {
  background: linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 100%);
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.kpi-label {
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.kpi-value {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  font-family: 'Monaco', 'Courier New', monospace;
}

/* PARTICLES */
.particles-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.particle-dot {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  opacity: 0.03;
  background: radial-gradient(circle, #3b82f6 0%, transparent 70%);
  animation: float-particle 15s ease-in-out infinite;
}

.particle-dot:nth-child(1) {
  top: 10%;
  left: 5%;
  animation-delay: 0s;
}

.particle-dot:nth-child(2) {
  top: 60%;
  right: 10%;
  background: radial-gradient(circle, #10b981 0%, transparent 70%);
  animation-delay: 3s;
}

.particle-dot:nth-child(3) {
  bottom: 10%;
  left: 50%;
  background: radial-gradient(circle, #f59e0b 0%, transparent 70%);
  animation-delay: 6s;
}

@keyframes float-particle {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(50px, -50px) scale(1.1); }
  50% { transform: translate(-30px, -100px) scale(0.9); }
  75% { transform: translate(-50px, -50px) scale(1.05); }
}

/* ========== RESPONSIVE MEDIA QUERIES ========== */

@media (max-width: 1024px) {
  .chart-container {
    min-height: 280px;
    gap: 12px;
    margin-bottom: 28px;
  }

  .y-axis {
    width: 50px;
  }

  .y-label {
    font-size: 11px;
    min-width: 35px;
  }

  .bars-wrapper {
    gap: 20px;
  }

  .bar-group {
    min-width: 45px;
  }

  .bar {
    width: 36px;
  }

  .bar-value {
    font-size: 10px;
  }

  .bar-label {
    font-size: 11px;
  }

  .kpi-section {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding: 20px;
    margin-top: 20px;
  }

  .kpi-item {
    padding: 14px;
  }

  .kpi-label {
    font-size: 10px;
  }

  .kpi-value {
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .panel8 {
    padding: 32px 24px;
  }

  .panel-title {
    font-size: 24px;
  }

  .chart-container {
    min-height: 280px;
    gap: 12px;
    margin-bottom: 26px;
    grid-template-columns: 50px 1fr;
  }

  .y-axis {
    width: 50px;
    border-right: 1.5px solid #e2e8f0;
  }

  .y-label {
    font-size: 11px;
    min-width: 35px;
  }

  .bars-wrapper {
    gap: 18px;
  }

  .bar-group {
    min-width: 44px;
  }

  .bar {
    width: 34px;
  }

  .bar-value {
    font-size: 10px;
  }

  .bar-label {
    font-size: 11px;
  }

  .kpi-section {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding: 20px;
    margin-top: 20px;
  }

  .kpi-item {
    padding: 14px;
  }

  .kpi-label {
    font-size: 10px;
  }

  .kpi-value {
    font-size: 15px;
  }
}

@media (max-width: 640px) {
  .panel8 {
    padding: 20px 16px;
  }

  .panel-title {
    font-size: 18px;
  }

  .title-decoration {
    width: 50px;
  }

  .chart-container {
    min-height: 240px;
    gap: 8px;
    margin-bottom: 20px;
    grid-template-columns: 40px 1fr;
  }

  .y-axis {
    width: 40px;
    padding-right: 8px;
  }

  .y-label {
    font-size: 9px;
    min-width: 25px;
  }

  .chart-content {
    gap: 12px;
    padding-bottom: 16px;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .bars-wrapper {
    gap: 16px;
    min-width: max-content;
  }

  .bar-group {
    min-width: 45px;
  }

  .bar {
    width: 32px;
    min-width: 20px;
  }

  .bar-value {
    font-size: 9px;
    display: block !important;
    top: -20px;
  }

  .bar-label {
    font-size: 9px;
  }

  .kpi-section {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 16px;
    margin-top: 16px;
  }

  .kpi-item {
    padding: 12px;
    display: flex;
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }

  .kpi-label {
    font-size: 8px;
  }

  .kpi-value {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .panel8 {
    padding: 16px 12px;
  }

  .panel-title {
    font-size: 16px;
  }

  .title-section {
    margin-bottom: 20px;
  }

  .chart-container {
    min-height: 220px;
    grid-template-columns: 35px 1fr;
    gap: 6px;
    margin-bottom: 16px;
  }

  .y-axis {
    width: 35px;
    padding-right: 6px;
  }

  .y-label {
    font-size: 8px;
    min-width: 20px;
    line-height: 1.1;
  }

  .chart-content {
    gap: 10px;
    padding-bottom: 12px;
  }

  .bars-wrapper {
    gap: 10px;
  }

  .bar-group {
    min-width: 30px;
  }

  .bar {
    width: 24px;
  }

  .bar-label {
    font-size: 8px;
  }

  .kpi-section {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 12px;
    margin-top: 12px;
  }

  .kpi-item {
    padding: 10px;
    display: flex;
    flex-direction: column;
  }

  .kpi-label {
    font-size: 7px;
  }

  .kpi-value {
    font-size: 12px;
    text-align: center;
  }
}

@media (max-width: 360px) {
  .panel8 {
    padding: 14px 10px;
  }

  .panel-title {
    font-size: 15px;
  }

  .title-decoration {
    width: 40px;
  }

  .chart-container {
    min-height: 200px;
    grid-template-columns: 30px 1fr;
    gap: 4px;
    margin-bottom: 14px;
  }

  .y-axis {
    width: 30px;
    padding-right: 4px;
  }

  .y-label {
    font-size: 7px;
    min-width: 15px;
  }

  .chart-content {
    gap: 8px;
    padding-bottom: 10px;
  }

  .bars-wrapper {
    gap: 8px;
  }

  .bar-group {
    min-width: 26px;
  }

  .bar {
    width: 20px;
    min-height: 15px;
  }

  .bar-label {
    font-size: 7px;
  }

  .kpi-section {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 10px;
    margin-top: 10px;
  }

  .kpi-item {
    padding: 8px;
  }

  .kpi-label {
    font-size: 6px;
  }

  .kpi-value {
    font-size: 11px;
  }
}
</style>
