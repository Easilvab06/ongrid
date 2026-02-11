// store/cotizacion.js - Pinia Store
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCotizacionStore = defineStore('cotizacion', () => {
  // Estado reactivo
  const consumoCliente = ref(0)
  const generacionPlanta = ref(0)
  const costoTotal = ref(0)
  const adicionales = ref(0)
  const tarifaElectricidad = ref(1000) // En pesos por kWh
  const incrementoAnual = ref(0.02) // 2% de incremento anual
  const userName = ref('Usuario')

  // Ahorro calculado
  const ahorroAnual = computed(() => {
    return consumoCliente.value * tarifaElectricidad.value
  })

  // Payback en años
  const paybackAnios = computed(() => {
    if (ahorroAnual.value === 0) return 0
    return costoTotal.value / ahorroAnual.value
  })

  // Ahorro a 10 años con incremento
  const ahorroTotal10Anos = computed(() => {
    let total = 0
    for (let año = 1; año <= 10; año++) {
      total += ahorroAnual.value * Math.pow(1 + incrementoAnual.value, año)
    }
    return total
  })

  // ROI
  const roi = computed(() => {
    if (costoTotal.value === 0) return 0
    return ((ahorroTotal10Anos.value / costoTotal.value) * 100).toFixed(2)
  })

  // Métodos
  const actualizarConsumo = (valor) => {
    consumoCliente.value = valor
  }

  const actualizarGeneracion = (valor) => {
    generacionPlanta.value = valor
  }

  const actualizarCostoTotal = (valor) => {
    costoTotal.value = valor
  }

  const actualizarAdicionales = (valor) => {
    adicionales.value = valor
  }

  const actualizarTarifa = (valor) => {
    tarifaElectricidad.value = valor
  }

  const actualizarIncrementoAnual = (valor) => {
    incrementoAnual.value = valor
  }

  const resetear = () => {
    consumoCliente.value = 0
    generacionPlanta.value = 0
    costoTotal.value = 0
    adicionales.value = 0
  }

  return {
    // Estado
    consumoCliente,
    generacionPlanta,
    costoTotal,
    adicionales,
    tarifaElectricidad,
    incrementoAnual,
    userName,
    
    // Computados
    ahorroAnual,
    paybackAnios,
    ahorroTotal10Anos,
    roi,
    
    // Métodos
    actualizarConsumo,
    actualizarGeneracion,
    actualizarCostoTotal,
    actualizarAdicionales,
    actualizarTarifa,
    actualizarIncrementoAnual,
    resetear
  }
})