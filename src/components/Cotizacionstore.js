// src/store/cotizacion.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCotizacionStore = defineStore('cotizacion', () => {

  // ── Datos de identidad ────────────────────────────────────────────────────
  const userName = ref('')
  const _quoteId = ref('')

  // ── Datos calculados por Panel3 ───────────────────────────────────────────
  const costoTotal    = ref(0)
  const consumo       = ref(0)
  const generacion    = ref(0)
  const adicionales   = ref(0)
  const ahorroMes     = ref(0)
  const tarifaKwh     = ref(0)
  const contribucion  = ref(0)
  const aluPublico    = ref(0)
  const autoconsumo   = ref(0)
  const descuento     = ref(0)

  // ── Snapshot completo para historial ─────────────────────────────────────
  // Panel3 llama a guardarSnapshot() cuando el usuario hace clic en "Guardar"
  // y también cada vez que recalcula (para que RegistroCotizaciones siempre
  // tenga los datos más recientes disponibles con store.snapshot)
  const snapshot = ref(null)

  const guardarSnapshot = (datos) => {
    snapshot.value = { ...datos, fecha: new Date().toISOString() }
  }

  // ── Métodos de actualización (llamados por Panel3) ────────────────────────
  const actualizarCostoTotal   = (v) => { costoTotal.value   = v }
  const actualizarConsumo      = (v) => { consumo.value      = v }
  const actualizarGeneracion   = (v) => { generacion.value   = v }
  const actualizarAdicionales  = (v) => { adicionales.value  = v }
  const actualizarAhorroMes    = (v) => { ahorroMes.value    = v }
  const actualizarTarifaKwh    = (v) => { tarifaKwh.value    = v }
  const actualizarContribucion = (v) => { contribucion.value = v }
  const actualizarAluPublico   = (v) => { aluPublico.value   = v }
  const actualizarAutoconsumo  = (v) => { autoconsumo.value  = v }
  const actualizarDescuento    = (v) => { descuento.value    = v }

  return {
    // estado
    userName, _quoteId,
    costoTotal, consumo, generacion, adicionales,
    ahorroMes, tarifaKwh, contribucion, aluPublico,
    autoconsumo, descuento, snapshot,
    // métodos
    actualizarCostoTotal, actualizarConsumo, actualizarGeneracion,
    actualizarAdicionales, actualizarAhorroMes, actualizarTarifaKwh,
    actualizarContribucion, actualizarAluPublico, actualizarAutoconsumo,
    actualizarDescuento, guardarSnapshot,
  }
})