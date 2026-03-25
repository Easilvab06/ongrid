<template>
  <div v-if="!isSharedLink" class="registro no-print">

    <!-- ══ HEADER ══════════════════════════════════════════════════════════════ -->
    <div class="reg-header">
      <div class="reg-header-left">
        <div class="reg-icon-wrap"><span class="reg-icon">📋</span></div>
        <div>
          <h2 class="reg-title">Historial de Cotizaciones</h2>
          <p class="reg-sub">
            <span class="badge-count">{{ cotizaciones.length }}</span>
            cotización{{ cotizaciones.length !== 1 ? 'es' : '' }} guardada{{ cotizaciones.length !== 1 ? 's' : '' }}
          </p>
        </div>
      </div>
      <div class="reg-header-right">
        <button @click="guardarActual" class="btn btn-guardar" :disabled="!puedeGuardar"
          :title="!puedeGuardar ? 'Requiere nombre de cliente y datos de consumo/generación' : 'Guardar cotización actual'">
          <span>💾</span> Guardar cotización actual
        </button>
        <button v-if="cotizaciones.length > 0" @click="pedirLimpiar" class="btn btn-danger-soft">
          <span>🗑️</span> Limpiar todo
        </button>
      </div>
    </div>

    <!-- ══ BARRA DE BÚSQUEDA ════════════════════════════════════════════════ -->
    <div class="search-wrap" v-if="cotizaciones.length > 0">
      <span class="search-ico">🔍</span>
      <input v-model="q" type="text" placeholder="Buscar por cliente, fecha, valor, paneles…" class="search-input" />
      <button v-if="q" @click="q = ''" class="search-clear">✕</button>
    </div>

    <!-- ══ LISTA ═════════════════════════════════════════════════════════════ -->
    <div class="lista" v-if="filtradas.length > 0">
      <div v-for="cot in filtradas" :key="cot.id" class="card" :class="{ 'card-open': open === cot.id }">

        <!-- Fila resumen ─────────────────────────────────────────────────── -->
        <div class="card-row" @click="toggle(cot.id)">
          <span class="num-badge">#{{ numeroRelativo(cot.id) }}</span>
          <div class="row-main">
            <span class="row-cliente">{{ cot.cliente || 'Sin nombre' }}</span>
            <span class="row-fecha">{{ fmtFecha(cot.fecha) }}</span>
          </div>
          <div class="row-chips">
            <span class="chip chip-blue">{{ cot.consumoCliente || '—' }} kWh/mes</span>
            <span class="chip chip-green">{{ cot.potencia || '—' }} kWp</span>
            <span class="chip chip-purple">{{ cot.nPaneles || '—' }} paneles</span>
          </div>
          <div class="row-right">
            <span class="row-valor">{{ fmtM(cot.valorFinal) }}</span>
            <span class="arrow" :class="{ open: open === cot.id }">▼</span>
          </div>
        </div>

        <!-- Detalle expandido ─────────────────────────────────────────────── -->
        <Transition name="expand">
          <div v-if="open === cot.id" class="card-detail">
            <div class="detail-grid">

              <div class="dcol">
                <div class="dcol-title">📥 Datos de entrada</div>
                <div class="drow"><span>Cliente</span><b>{{ cot.cliente || '—' }}</b></div>
                <div class="drow"><span>Consumo</span><b>{{ cot.consumoCliente || '—' }} kWh/mes</b></div>
                <div class="drow"><span>Generación planta</span><b>{{ cot.generacionPlanta || '—' }} kWh/mes</b></div>
                <div class="drow"><span>HBS</span><b>{{ cot.hbs || '—' }} h/día</b></div>
                <div class="drow"><span>Tarifa kWh</span><b>{{ cot.tarifaKwh ? fmtM(cot.tarifaKwh) : '—' }}</b></div>
                <div class="drow"><span>Contribución</span><b>{{ cot.contribucion ?? '—' }}%</b></div>
                <div class="drow"><span>Alu. Público</span><b>{{ cot.aluPublico ?? '—' }}%</b></div>
                <div class="drow"><span>Autoconsumo</span><b>{{ cot.autoconsumo ?? '—' }}%</b></div>
              </div>

              <div class="dcol">
                <div class="dcol-title">⚡ Resultados técnicos</div>
                <div class="drow"><span>Potencia</span><b class="val-green">{{ cot.potencia || '—' }} kWp</b></div>
                <div class="drow"><span>Nº paneles</span><b class="val-blue">{{ cot.nPaneles || '—' }}</b></div>
                <div class="drow"><span>Generación real</span><b>{{ cot.generacion || '—' }} kWh/mes</b></div>
                <div class="drow"><span>Área requerida</span><b>{{ cot.area || '—' }} m²</b></div>
                <div class="drow"><span>Peso total</span><b>{{ cot.peso || '—' }} kg</b></div>
                <div class="drow">
                  <span>Cobertura</span>
                  <b :class="cot.cobertura >= 100 ? 'val-green' : 'val-orange'">
                    {{ cot.cobertura ? Math.round(cot.cobertura) + '%' : '—' }}
                  </b>
                </div>
              </div>

              <div class="dcol">
                <div class="dcol-title">💰 Financiero</div>
                <div class="drow"><span>Pago mensual</span><b>{{ cot.pagoMensual ? fmtM(cot.pagoMensual) : '—' }}</b></div>
                <div class="drow"><span>Pago anual</span><b>{{ cot.pagoAnual ? fmtM(cot.pagoAnual) : '—' }}</b></div>
                <div class="drow"><span>Ahorro mensual</span><b class="val-green">{{ cot.ahorroMes ? fmtM(cot.ahorroMes) : '—' }}</b></div>
                <div class="drow"><span>Ahorro anual</span><b class="val-green">{{ cot.ahorroMes ? fmtM(cot.ahorroMes * 12) : '—' }}</b></div>
                <div class="drow"><span>Adicionales</span><b>{{ cot.adicionales ? fmtM(cot.adicionales) : '—' }}</b></div>
                <div v-if="cot.itemsAdicionales && cot.itemsAdicionales.length > 0" class="adicionales-items">
                  <div v-for="(item, i) in cot.itemsAdicionales" :key="i" class="adicional-detail-row">
                    <span class="adicional-detail-nombre">{{ item.nombre }}</span>
                    <span class="adicional-detail-precio">{{ fmtM(item.precio) }}</span>
                  </div>
                </div>
                <div class="drow" v-if="cot.descuento > 0"><span>Descuento</span><b class="val-orange">{{ cot.descuento }}%</b></div>
                <div class="drow drow-total">
                  <span>VALOR TOTAL</span>
                  <b class="val-gold">{{ fmtM(cot.valorFinal) }}</b>
                </div>
              </div>

            </div>
            <div class="card-actions">
              <button @click="cargar(cot)" class="btn btn-cargar">↩️ Cargar en cotizador</button>
              <button @click="exportUno(cot)" class="btn btn-csv">📄 Exportar CSV</button>
              <button @click="eliminar(cot.id)" class="btn btn-danger-soft">🗑️ Eliminar</button>
            </div>

            <!-- Fotos de visita técnica -->
            <div v-if="cot.fotos && cot.fotos.length > 0" class="fotos-section">
              <div class="fotos-title">📸 Fotos de visita técnica ({{ cot.fotos.length }})</div>
              <div class="fotos-grid">
                <div v-for="(foto, idx) in cot.fotos" :key="idx" class="foto-card">
                  <img :src="foto.thumb || foto.data || foto.url" :alt="`Foto ${idx + 1}`" class="foto-thumb" @click="abrirFoto(foto)" />
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- ══ VACÍO ══════════════════════════════════════════════════════════════ -->
    <div class="empty" v-else>
      <div class="empty-ico">📭</div>
      <p v-if="q">No hay cotizaciones que coincidan con "<strong>{{ q }}</strong>"</p>
      <p v-else>Aún no hay cotizaciones guardadas.<br/>Complete el formulario y presione <strong>Guardar cotización actual</strong>.</p>
    </div>

    <!-- ══ EXPORT TOTAL ════════════════════════════════════════════════════════ -->
    <div class="export-bar" v-if="cotizaciones.length > 0">
      <button @click="exportTodo" class="btn btn-export">
        📊 Exportar todo a CSV ({{ cotizaciones.length }} cotizaciones)
      </button>
    </div>

    <!-- ══ LIGHTBOX FOTO ══════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="fotoAbierta" class="modal-bg lightbox-bg" @click.self="fotoAbierta = null">
          <div class="lightbox-box">
            <button class="lightbox-close" @click="fotoAbierta = null">✕</button>
            <img :src="fotoAbierta.data || fotoAbierta.url" class="lightbox-img" alt="Foto visita técnica" />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ══ MODAL CONFIRMAR BORRAR ══════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="modalLimpiar" class="modal-bg" @click.self="modalLimpiar = false">
          <div class="modal-box">
            <div class="modal-ico">⚠️</div>
            <h3>¿Eliminar todo el historial?</h3>
            <p>Se borrarán las {{ cotizaciones.length }} cotizaciones. Esta acción no se puede deshacer.</p>
            <div class="modal-btns">
              <button @click="modalLimpiar = false" class="btn btn-cancelar">Cancelar</button>
              <button @click="limpiarTodo" class="btn btn-danger">Sí, eliminar todo</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ══ TOAST ══════════════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="toast">
        <div v-if="toast.show" class="toast" :class="'toast-' + toast.type">{{ toast.msg }}</div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCotizacionStore } from '../store/cotizacion.js'

const store = useCotizacionStore()

const isSharedLink = new URLSearchParams(window.location.search).has('data')

// ── Constantes técnicas (solo para cálculos de paneles, área, peso) ───────────
const POTENCIA_PANEL_KWP = 0.62

// ── localStorage con namespace por usuario ────────────────────────────────────
const usuarioActual = sessionStorage.getItem('soinsolar_user') || 'default'
const KEY = `soinsolar_cotizaciones_${usuarioActual}`
const cotizaciones = ref([])
const cargarStorage = () => { try { cotizaciones.value = JSON.parse(localStorage.getItem(KEY) || '[]') } catch { cotizaciones.value = [] } }
const guardarStorage = () => localStorage.setItem(KEY, JSON.stringify(cotizaciones.value))
onMounted(cargarStorage)

// ── Capturar el último evento que Panel3 ya dispara ───────────────────────────
const _ultimo = ref(null)
const onCotActualizada = (e) => { _ultimo.value = e.detail }
onMounted(() => window.addEventListener('cotizacion-actualizada', onCotActualizada))
onUnmounted(() => window.removeEventListener('cotizacion-actualizada', onCotActualizada))

// ── Helpers de cálculo (solo para datos técnicos: paneles, área, peso) ────────
const calcGen = (n, h) => Math.round(POTENCIA_PANEL_KWP * n * 30 * h * 100) / 100
const buscarN = (gen, h) => {
  let best = 1, minD = Infinity
  for (let n = 1; n <= 1048; n++) {
    const d = Math.abs(calcGen(n, h) - gen)
    if (d < minD) { minD = d; best = n }
  }
  return best
}

// ── Snapshot: lee valores financieros DIRECTAMENTE del evento de Panel3 ───────
const calcularSnapshot = () => {
  const ev = _ultimo.value || {}
  const genPlanta   = ev.generacion    || 0
  const consumo     = ev.consumo       || 0
  const hbsVal      = ev.hbs           || 3.8
  const tarifa      = ev.tarifaKwh     || 0
  const contrib     = ev.contribucion  || 0
  const alu         = ev.aluPublico    || 0
  const auto        = ev.autoconsumo   || 0
  const adicionales = ev.adicionales   || 0
  const itemsAdicionales = ev.itemsAdicionales || []
  const descuento   = ev.descuento     || 0
  if (!genPlanta) return null

  // Datos técnicos
  const n          = buscarN(genPlanta, hbsVal)
  const potencia   = Math.round(n * POTENCIA_PANEL_KWP * 100) / 100
  const generacion = calcGen(n, hbsVal)
  const area       = n * 3 + 4
  const peso       = n * 31
  const cobertura  = consumo > 0 ? (genPlanta / consumo) * 100 : 0

  // ✅ Valores financieros tomados directamente de Panel3 (sin recalcular)
  // ev.costoTotal        = valorBase + adicionales  (sin descuento)
  // ev.valorConDescuento = costoTotal * (1 - descuento/100)
  const valorTotalConAdicionales = ev.costoTotal || 0
  const valorConDescuento        = ev.valorConDescuento || valorTotalConAdicionales
  const valorFinal               = descuento > 0 ? valorConDescuento : valorTotalConAdicionales

  // Pago mensual / anual
  let pagoMensual = 0, pagoAnual = 0, ahorroMes = 0
  if (consumo > 0 && tarifa > 0) {
    const L3 = consumo * tarifa
    pagoMensual = Math.round(L3 + L3 * (contrib / 100) + L3 * (alu / 100))
    pagoAnual   = pagoMensual * 12
  }
  if (genPlanta > 0 && tarifa > 0 && auto > 0) {
    const J14 = genPlanta * (auto / 100) * tarifa * (1 + contrib / 100 + alu / 100)
    const K14 = genPlanta * (1 - auto / 100) * (tarifa - 200)
    ahorroMes  = Math.round(J14 + K14)
  }

  return {
    cliente: store.userName || 'Sin nombre',
    consumoCliente: consumo, generacionPlanta: genPlanta, hbs: hbsVal,
    tarifaKwh: tarifa,
    contribucion: contrib, aluPublico: alu, autoconsumo: auto,
    adicionales, itemsAdicionales,
    descuento,
    nPaneles: n, potencia, generacion, area, peso, cobertura,
    pagoMensual, pagoAnual, ahorroMes, valorFinal,
    fotos: (() => {
      try { return JSON.parse(localStorage.getItem('savedTechnicalImages') || '[]') }
      catch { return [] }
    })(),
  }
}

// ── ¿Puede guardar? ───────────────────────────────────────────────────────────
const puedeGuardar = computed(() => !!(store.userName && _ultimo.value?.generacion))

// ── Guardar ───────────────────────────────────────────────────────────────────
const guardarActual = () => {
  const snap = calcularSnapshot()
  if (!snap) { showToast('⚠️ Ingrese datos en el cotizador primero', 'warn'); return }
  cotizaciones.value.unshift({ id: Date.now(), fecha: new Date().toISOString(), ...snap })
  guardarStorage()
  showToast('✅ Cotización guardada', 'ok')
}

// ── Cargar cotización → Panel3 escucha este evento ────────────────────────────
const cargar = (cot) => {
  window.dispatchEvent(new CustomEvent('registro-cargar-cotizacion', { detail: cot }))
  store.userName = cot.cliente
  showToast('↩️ Cotización cargada en el formulario', 'info')
}

// ── Eliminar ──────────────────────────────────────────────────────────────────
const eliminar = (id) => {
  cotizaciones.value = cotizaciones.value.filter(c => c.id !== id)
  guardarStorage()
  if (open.value === id) open.value = null
  showToast('🗑️ Eliminada', 'warn')
}
const pedirLimpiar = () => { modalLimpiar.value = true }
const limpiarTodo  = () => {
  cotizaciones.value = []; guardarStorage()
  modalLimpiar.value = false; open.value = null
  showToast('🗑️ Historial eliminado', 'warn')
}

// ── UI ────────────────────────────────────────────────────────────────────────
const open = ref(null)
const q = ref('')
const modalLimpiar = ref(false)
const fotoAbierta = ref(null)
const toast = ref({ show: false, msg: '', type: 'ok' })
let toastTimer = null

const abrirFoto = (foto) => { fotoAbierta.value = foto }

const filtradas = computed(() => {
  if (!q.value.trim()) return cotizaciones.value
  const busq = q.value.toLowerCase()
  return cotizaciones.value.filter(c =>
    (c.cliente || '').toLowerCase().includes(busq) ||
    fmtFecha(c.fecha).includes(busq) ||
    String(c.consumoCliente).includes(busq) ||
    String(c.nPaneles).includes(busq) ||
    fmtM(c.valorFinal).toLowerCase().includes(busq)
  )
})
const toggle = (id) => { open.value = open.value === id ? null : id }
const numeroRelativo = (id) => cotizaciones.value.findIndex(c => c.id === id) + 1

// ── CSV ───────────────────────────────────────────────────────────────────────
const CABECERAS = ['N°','Fecha','Cliente','Consumo (kWh/mes)','Generacion Planta (kWh/mes)','HBS (h/dia)','Tarifa kWh','Contribucion (%)','Alu. Publico (%)','Autoconsumo (%)','Descuento (%)','Adicionales','Potencia (kWp)','N Paneles','Area (m2)','Peso (kg)','Cobertura (%)','Pago Mensual','Pago Anual','Ahorro Mensual','Ahorro Anual','Valor Final']

const escaparCSV = (v) => {
  if (v == null || v === '') return ''
  const s = String(v)
  if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`
  return s
}

const cotACsv = (c, i) => {
  const fechaISO = c.fecha ? new Date(c.fecha).toLocaleString('es-CO', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}) : ''
  const fila = [
    i + 1,
    escaparCSV(fechaISO),
    escaparCSV(c.cliente),
    c.consumoCliente    ?? '',
    c.generacionPlanta  ?? '',
    c.hbs               ?? '',
    c.tarifaKwh         ?? '',
    c.contribucion      ?? '',
    c.aluPublico        ?? '',
    c.autoconsumo       ?? '',
    c.descuento         ?? '',
    c.adicionales       ?? '',
    c.potencia          ?? '',
    c.nPaneles          ?? '',
    c.area              ?? '',
    c.peso              ?? '',
    c.cobertura         ? Math.round(c.cobertura) : '',
    c.pagoMensual       ?? '',
    c.pagoAnual         ?? '',
    c.ahorroMes         ?? '',
    c.ahorroMes         ? c.ahorroMes * 12 : '',
    c.valorFinal        ?? '',
  ]
  return fila.join(';')
}
const descargar = (contenido, nombre) => {
  const blob = new Blob(['sep=;\n' + contenido], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: nombre })
  a.click(); URL.revokeObjectURL(url)
}
const exportTodo = () => {
  const filas = [CABECERAS.join(';'), ...cotizaciones.value.map((c, i) => cotACsv(c, i))]
  descargar(filas.join('\n'), `soinsolar_cotizaciones_${hoy()}.csv`)
  showToast('📊 CSV exportado', 'ok')
}
const exportUno = (cot) => {
  const idx = cotizaciones.value.findIndex(c => c.id === cot.id)
  const filas = [CABECERAS.join(';'), cotACsv(cot, idx)]
  descargar(filas.join('\n'), `cotizacion_${slug(cot.cliente)}_${hoy()}.csv`)
  showToast('📄 CSV exportado', 'ok')
}

// ── Formateo ──────────────────────────────────────────────────────────────────
const fmtM = (v) => (!v && v!==0) ? '—' : new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(v)
const fmtFecha = (iso) => !iso ? '—' : new Date(iso).toLocaleString('es-CO',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})
const hoy  = () => new Date().toISOString().slice(0,10)
const slug = (s) => (s||'cliente').toLowerCase().replace(/\s+/g,'_').replace(/[^a-z0-9_]/g,'')
const showToast = (msg, type='ok') => {
  toast.value = {show:true,msg,type}; clearTimeout(toastTimer)
  toastTimer = setTimeout(()=>{ toast.value.show=false },3200)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');

.registro {
  font-family:'Montserrat',sans-serif;
  background:linear-gradient(135deg,#f8fafc 0%,#f1f5f9 100%);
  border-radius:20px; padding:28px 28px 20px;
  box-shadow:0 4px 24px rgba(0,0,0,0.08); position:relative;
}

/* Header */
.reg-header { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:14px; margin-bottom:22px; }
.reg-header-left { display:flex; align-items:center; gap:14px; }
.reg-icon-wrap { width:52px; height:52px; border-radius:14px; background:linear-gradient(135deg,#F5B027,#f59e0b); display:flex; align-items:center; justify-content:center; box-shadow:0 4px 14px rgba(245,176,39,0.35); flex-shrink:0; }
.reg-icon { font-size:1.6rem; }
.reg-title { font-size:1.35rem; font-weight:800; color:#1f2c51; margin:0 0 4px; }
.reg-sub { font-size:13px; color:#64748b; margin:0; display:flex; align-items:center; gap:6px; }
.badge-count { background:linear-gradient(135deg,#F5B027,#f59e0b); color:#fff; font-weight:700; font-size:12px; padding:1px 8px; border-radius:20px; }
.reg-header-right { display:flex; gap:10px; flex-wrap:wrap; }

/* Botones */
.btn { padding:9px 16px; border:none; border-radius:10px; font-family:'Montserrat',sans-serif; font-weight:600; font-size:13px; cursor:pointer; transition:all 0.22s ease; display:inline-flex; align-items:center; gap:6px; }
.btn:disabled { opacity:0.42; cursor:not-allowed; }
.btn-guardar { background:linear-gradient(135deg,#F5B027,#f59e0b); color:#fff; box-shadow:0 3px 12px rgba(245,176,39,0.3); }
.btn-guardar:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 6px 18px rgba(245,176,39,0.4); }
.btn-danger-soft { background:#fee2e2; color:#dc2626; }
.btn-danger-soft:hover { background:#fecaca; }
.btn-cargar { background:linear-gradient(135deg,#0ea5e9,#3b82f6); color:#fff; box-shadow:0 3px 10px rgba(14,165,233,0.25); }
.btn-cargar:hover { transform:translateY(-1px); }
.btn-csv { background:#f0fdf4; color:#16a34a; border:1px solid #bbf7d0; }
.btn-csv:hover { background:#dcfce7; }
.btn-danger { background:linear-gradient(135deg,#dc2626,#b91c1c); color:#fff; }
.btn-danger:hover { transform:translateY(-1px); }
.btn-cancelar { background:#f1f5f9; color:#475569; }
.btn-cancelar:hover { background:#e2e8f0; }
.btn-export { background:linear-gradient(135deg,#6366f1,#4f46e5); color:#fff; box-shadow:0 3px 12px rgba(99,102,241,0.25); }
.btn-export:hover { transform:translateY(-1px); }

/* Search */
.search-wrap { display:flex; align-items:center; background:#fff; border:2px solid #e2e8f0; border-radius:12px; padding:4px 12px; margin-bottom:18px; transition:border-color 0.2s; }
.search-wrap:focus-within { border-color:#F5B027; box-shadow:0 0 0 3px rgba(245,176,39,0.1); }
.search-ico { color:#94a3b8; margin-right:8px; }
.search-input { flex:1; border:none; outline:none; font-family:'Montserrat',sans-serif; font-size:14px; color:#1e293b; background:transparent; padding:8px 0; }
.search-clear { background:none; border:none; cursor:pointer; color:#94a3b8; padding:4px 6px; border-radius:6px; }
.search-clear:hover { background:#f1f5f9; color:#475569; }

/* Tarjetas */
.lista { display:flex; flex-direction:column; gap:10px; }
.card { background:#fff; border-radius:14px; border:2px solid #e2e8f0; overflow:hidden; transition:border-color 0.25s,box-shadow 0.25s; }
.card:hover { border-color:#cbd5e1; box-shadow:0 3px 14px rgba(0,0,0,0.07); }
.card-open { border-color:#F5B027; box-shadow:0 6px 24px rgba(245,176,39,0.14); }

.card-row { display:flex; align-items:center; gap:14px; padding:15px 18px; cursor:pointer; user-select:none; flex-wrap:wrap; }
.card-row:hover { background:#fafafa; }
.num-badge { background:linear-gradient(135deg,#1f2c51,#334155); color:#fff; font-size:11px; font-weight:700; padding:3px 8px; border-radius:6px; white-space:nowrap; flex-shrink:0; }
.row-main { display:flex; flex-direction:column; min-width:130px; }
.row-cliente { font-weight:700; color:#1f2c51; font-size:15px; }
.row-fecha { font-size:12px; color:#94a3b8; margin-top:2px; }
.row-chips { display:flex; gap:8px; flex-wrap:wrap; flex:1; }
.chip { font-size:12px; font-weight:600; padding:4px 10px; border-radius:20px; white-space:nowrap; }
.chip-blue   { background:#eff6ff; color:#2563eb; }
.chip-green  { background:#f0fdf4; color:#16a34a; }
.chip-purple { background:#fdf4ff; color:#9333ea; }
.row-right { display:flex; align-items:center; gap:12px; margin-left:auto; }
.row-valor { font-size:16px; font-weight:800; color:#1f2c51; white-space:nowrap; }
.arrow { color:#94a3b8; font-size:12px; transition:transform 0.3s; }
.arrow.open { transform:rotate(180deg); }

/* Detalle */
.card-detail { border-top:1px solid #f1f5f9; padding:20px 18px; }
.detail-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; margin-bottom:16px; }
.dcol-title { font-size:12px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:10px; padding-bottom:8px; border-bottom:2px solid #f1f5f9; }
.drow { display:flex; justify-content:space-between; align-items:center; padding:5px 0; border-bottom:1px solid #f8fafc; font-size:13px; gap:8px; }
.drow span { color:#64748b; font-weight:500; white-space:nowrap; }
.drow b { font-weight:700; color:#1e293b; text-align:right; }
.val-green  { color:#16a34a !important; }
.val-blue   { color:#2563eb !important; }
.val-orange { color:#d97706 !important; }
.val-gold   { color:#F5B027 !important; font-size:17px; }
.drow-total { margin-top:8px; padding-top:10px; border-top:2px solid #e2e8f0; border-bottom:none; }

/* Adicionales items in history */
.adicionales-items {
  margin: 8px 0;
  padding: 8px 0;
  border-top: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
}
.adicional-detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  font-size: 12px;
}
.adicional-detail-nombre {
  color: #059669;
  font-weight: 600;
  flex: 1;
}
.adicional-detail-precio {
  font-weight: 700;
  color: #10b981;
}
.drow-total span { font-weight:800 !important; color:#1f2c51 !important; font-size:13px; }
.card-actions { display:flex; gap:10px; flex-wrap:wrap; padding-top:14px; border-top:1px solid #f1f5f9; }

/* Vacío */
.empty { text-align:center; padding:56px 20px; color:#94a3b8; }
.empty-ico { font-size:4rem; margin-bottom:14px; opacity:0.5; }
.empty p { font-size:15px; line-height:1.8; }

/* Export bar */
.export-bar { margin-top:18px; display:flex; justify-content:flex-end; }

/* Expand transition */
.expand-enter-active { animation:slideDown 0.22s ease-out; }
.expand-leave-active { animation:slideDown 0.18s ease-in reverse; }
@keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }

/* Modal */
.modal-bg { position:fixed; inset:0; background:rgba(0,0,0,0.48); display:flex; align-items:center; justify-content:center; z-index:9999; backdrop-filter:blur(4px); }
.modal-box { background:#fff; border-radius:20px; padding:36px 30px; max-width:400px; width:90%; text-align:center; box-shadow:0 20px 60px rgba(0,0,0,0.22); }
.modal-ico { font-size:3rem; margin-bottom:10px; }
.modal-box h3 { font-size:1.15rem; font-weight:800; color:#1f2c51; margin:0 0 8px; }
.modal-box p  { font-size:14px; color:#64748b; line-height:1.6; margin:0 0 22px; }
.modal-btns   { display:flex; gap:12px; justify-content:center; }
.modal-enter-active,.modal-leave-active { transition:opacity 0.2s; }
.modal-enter-from,.modal-leave-to { opacity:0; }

/* Toast */
.toast { position:fixed; bottom:28px; right:28px; z-index:10000; padding:12px 20px; border-radius:12px; font-family:'Montserrat',sans-serif; font-size:14px; font-weight:600; pointer-events:none; box-shadow:0 8px 24px rgba(0,0,0,0.16); }
.toast-ok   { background:#1f2c51; color:#fff; }
.toast-info { background:#0ea5e9; color:#fff; }
.toast-warn { background:#dc2626; color:#fff; }
.toast-enter-active,.toast-leave-active { transition:all 0.28s ease; }
.toast-enter-from,.toast-leave-to { opacity:0; transform:translateY(10px); }

/* Fotos de visita técnica */
.fotos-section { margin-top:16px; padding-top:14px; border-top:1px solid #f1f5f9; }
.fotos-title { font-size:12px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:12px; }
.fotos-grid { display:flex; flex-wrap:wrap; gap:10px; }
.foto-card { position:relative; border-radius:10px; overflow:hidden; border:2px solid #e2e8f0; transition:border-color 0.2s,transform 0.2s; cursor:pointer; }
.foto-card:hover { border-color:#F5B027; transform:scale(1.03); }
.foto-thumb { width:90px; height:70px; object-fit:cover; display:block; }

/* Lightbox */
.lightbox-bg { align-items:center; justify-content:center; }
.lightbox-box { position:relative; max-width:92vw; max-height:90vh; display:flex; align-items:center; justify-content:center; }
.lightbox-img { max-width:92vw; max-height:86vh; border-radius:14px; box-shadow:0 20px 60px rgba(0,0,0,0.5); object-fit:contain; }
.lightbox-close { position:absolute; top:-14px; right:-14px; width:34px; height:34px; border-radius:50%; background:#fff; border:none; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 14px rgba(0,0,0,0.2); z-index:1; transition:background 0.2s; }
.lightbox-close:hover { background:#fee2e2; color:#dc2626; }

/* Responsive */
@media (max-width:900px) { .detail-grid { grid-template-columns:1fr 1fr; } }
@media (max-width:640px) {
  .registro { padding:16px; }
  .reg-header { flex-direction:column; align-items:flex-start; }
  .card-row { flex-direction:column; align-items:flex-start; gap:8px; }
  .row-right { margin-left:0; }
  .detail-grid { grid-template-columns:1fr; }
  .card-actions { flex-direction:column; }
  .card-actions .btn { width:100%; justify-content:center; }
  .foto-thumb { width:72px; height:58px; }
}
</style>