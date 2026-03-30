<template>
  <div v-if="!isSharedLink" class="registro no-print">

    <!-- ══ HEADER ══════════════════════════════════════════════════════════════ -->
    <div class="reg-header">
      <div class="reg-header-left">
        <div class="reg-icon-wrap"><span class="reg-icon">📋</span></div>
        <div>
          <h2 class="reg-title">
            Historial de Cotizaciones
            <span v-if="esAdmin" class="admin-badge">👑 Vista Administrador</span>
          </h2>
          <p class="reg-sub">
            <span class="badge-count">{{ cotizaciones.length }}</span>
            cotización{{ cotizaciones.length !== 1 ? 'es' : '' }} guardada{{ cotizaciones.length !== 1 ? 's' : '' }}
            <span v-if="sincronizando" class="sync-badge">🔄 Sincronizando…</span>
            <span v-else-if="sincronizado" class="sync-badge sync-ok">☁️ Sincronizado</span>
            <span v-else-if="errorSync" class="sync-badge sync-error" :title="errorSync">⚠️ {{ errorSync }}</span>
          </p>
        </div>
      </div>
      <div class="reg-header-right">
        <!-- Filtro por usuario (solo admin) -->
        <select v-if="esAdmin && usuariosFiltro.length > 1" v-model="filtroUsuario" class="select-usuario">
          <option value="">👥 Todos los usuarios</option>
          <option v-for="u in usuariosFiltro" :key="u" :value="u">{{ u }}</option>
        </select>
        <button
          v-if="!esAdmin"
          @click="guardarActual"
          class="btn btn-guardar"
          :disabled="!puedeGuardar || guardando"
          :title="!puedeGuardar ? 'Requiere nombre de cliente y datos de consumo/generación' : 'Guardar cotización actual'"
        >
          <span>{{ guardando ? '⏳' : '💾' }}</span>
          {{ guardando ? 'Guardando…' : 'Guardar cotización actual' }}
        </button>
        <button v-if="cotizaciones.length > 0 && !esAdmin" @click="pedirLimpiar" class="btn btn-danger-soft">
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
            <!-- Admin: mostrar de qué usuario es -->
            <span v-if="esAdmin && cot._usuario" class="user-tag">👤 {{ cot._usuario }}</span>
          </div>
          <div class="row-chips">
            <span class="chip chip-blue">{{ cot.consumoCliente || '—' }} kWh/mes</span>
            <span class="chip chip-green">{{ cot.potencia || '—' }} kWp</span>
            <span class="chip chip-purple">{{ cot.nPaneles || '—' }} paneles</span>
          </div>
          <div class="row-right">
            <span class="row-valor">{{ fmtM(cot.valorFinal) }}</span>
            <span class="estado-badge" :class="'estado-' + (cot.estado || 'pendiente')" @click.stop>
              {{ estadoLabel(cot.estado) }}
            </span>
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

            <!-- Selector de estado ───────────────────────────────────────── -->
            <div class="estado-section">
              <span class="estado-label-title">Estado de la cotización:</span>
              <div class="estado-btns">
                <button @click="setEstado(cot, 'pendiente')" class="btn-estado"
                  :class="{ active: (cot.estado || 'pendiente') === 'pendiente' }" data-estado="pendiente">
                  ⏳ Pendiente
                </button>
                <button @click="setEstado(cot, 'aceptada')" class="btn-estado"
                  :class="{ active: cot.estado === 'aceptada' }" data-estado="aceptada">
                  ✅ Aceptada
                </button>
                <button @click="pedirRechazar(cot)" class="btn-estado"
                  :class="{ active: cot.estado === 'rechazada' }" data-estado="rechazada">
                  ❌ Rechazada
                </button>
              </div>
              <Transition name="retract">
                <div v-if="cot.estado === 'rechazada'" class="retract-bar">
                  <span class="retract-ico">🔄</span>
                  <span class="retract-msg">¿El cliente se retractó? Puedes revertir el estado.</span>
                  <button @click="setEstado(cot, 'pendiente')" class="btn-retract">Revertir a Pendiente</button>
                </div>
              </Transition>
            </div>

            <div class="card-actions">
              <button v-if="!esAdmin" @click="cargar(cot)" class="btn btn-cargar">↩️ Cargar en cotizador</button>
              <button @click="exportUno(cot)" class="btn btn-csv">📄 Exportar CSV</button>
              <button @click="eliminar(cot.id, cot._usuario)" class="btn btn-danger-soft">🗑️ Eliminar</button>
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
      <p v-if="cargandoNube" class="loading-text">
        <span class="spinner-inline">⏳</span> Cargando historial desde la nube…
      </p>
      <p v-else-if="q">No hay cotizaciones que coincidan con "<strong>{{ q }}</strong>"</p>
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

    <!-- ══ MODAL CONFIRMAR RECHAZO ════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="modalRechazar" class="modal-bg" @click.self="modalRechazar = false">
          <div class="modal-box modal-rechazar">
            <div class="modal-ico">❌</div>
            <h3>Marcar como Rechazada</h3>
            <p>¿Confirmas que el cliente <strong>{{ cotArechazar?.cliente || 'Sin nombre' }}</strong> rechazó esta cotización?</p>
            <p class="rechazar-sub">Podrás revertirlo en cualquier momento si el cliente se retracta.</p>
            <div class="modal-btns">
              <button @click="modalRechazar = false" class="btn btn-cancelar">Cancelar</button>
              <button @click="confirmarRechazar" class="btn btn-rechazar-confirm">Sí, marcar rechazada</button>
            </div>
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
            <p>Se borrarán las {{ cotizaciones.length }} cotizaciones de <strong>{{ usuarioActual }}</strong>. Esta acción no se puede deshacer.</p>
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

// ── Firebase imports ──────────────────────────────────────────────────────────
// Asegúrate de tener instalado firebase: npm install firebase
import { db } from '../firebase.js'
import {
  collection, doc, setDoc, getDocs, deleteDoc, query, orderBy
} from 'firebase/firestore'

const store = useCotizacionStore()
const isSharedLink = new URLSearchParams(window.location.search).has('d') ||
                     new URLSearchParams(window.location.search).has('data')

// ── Constantes técnicas ───────────────────────────────────────────────────────
const POTENCIA_PANEL_KWP = 0.62

// ── Usuario actual ────────────────────────────────────────────────────────────
const _getUserActual = () =>
  localStorage.getItem('soinsolar_user') ||
  sessionStorage.getItem('soinsolar_user') ||
  'default'

const usuarioActual = _getUserActual()
const esAdmin = usuarioActual === 'administracion'

// Si estaba solo en sessionStorage, lo migramos
if (!localStorage.getItem('soinsolar_user') && sessionStorage.getItem('soinsolar_user')) {
  localStorage.setItem('soinsolar_user', sessionStorage.getItem('soinsolar_user'))
}

// ── Estado reactivo ────────────────────────────────────────────────────────────
const cotizaciones   = ref([])
const sincronizando  = ref(false)
const sincronizado   = ref(false)
const errorSync      = ref('')
const cargandoNube   = ref(false)
const guardando      = ref(false)
const filtroUsuario  = ref('')  // solo admin

// ── Colección Firestore: cotizaciones/{usuario}/items/{id} ────────────────────
const colRef = (usuario) => collection(db, 'cotizaciones', usuario, 'items')

// ── Cargar cotizaciones desde Firestore ───────────────────────────────────────
const cargarDesdeFirestore = async (usuario) => {
  const q = query(colRef(usuario), orderBy('fecha', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ ...d.data(), id: d.id, _usuario: usuario }))
}

// ── Guardar una cotización en Firestore ───────────────────────────────────────
const guardarEnFirestore = async (usuario, cot) => {
  const { id, _usuario, ...datos } = cot
  await setDoc(doc(colRef(usuario), String(id)), datos)
}

// ── Eliminar una cotización de Firestore ──────────────────────────────────────
const eliminarDeFirestore = async (usuario, id) => {
  await deleteDoc(doc(colRef(usuario), String(id)))
}

// ── Obtener lista de usuarios (para admin) ────────────────────────────────────
// Firestore no tiene "listar subcolecciones" directo en cliente.
// Estrategia: guardamos un documento "directorio" con la lista de usuarios.
const DIRECTORIO_DOC = doc(db, 'config', 'usuarios')
import { getDoc, updateDoc, arrayUnion } from 'firebase/firestore'

const registrarUsuario = async (usuario) => {
  try {
    const snap = await getDoc(DIRECTORIO_DOC)
    if (snap.exists()) {
      const lista = snap.data().lista || []
      if (!lista.includes(usuario)) {
        await updateDoc(DIRECTORIO_DOC, { lista: arrayUnion(usuario) })
      }
    } else {
      await setDoc(DIRECTORIO_DOC, { lista: [usuario] })
    }
  } catch (_) { /* No crítico */ }
}

const obtenerUsuarios = async () => {
  try {
    const snap = await getDoc(DIRECTORIO_DOC)
    return snap.exists() ? (snap.data().lista || []) : []
  } catch { return [] }
}

// ── Montar: cargar datos ──────────────────────────────────────────────────────
onMounted(async () => {
  cargandoNube.value = true
  errorSync.value = ''
  try {
    if (esAdmin) {
      // Admin: carga cotizaciones de TODOS los usuarios
      const usuarios = await obtenerUsuarios()
      usuariosFiltro.value = usuarios.filter(u => u !== 'administracion')
      const todas = []
      for (const u of usuariosFiltro.value) {
        const cots = await cargarDesdeFirestore(u)
        todas.push(...cots)
      }
      cotizaciones.value = todas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    } else {
      // Usuario normal: carga solo las suyas
      await registrarUsuario(usuarioActual)
      cotizaciones.value = await cargarDesdeFirestore(usuarioActual)
    }
    sincronizado.value = true
    setTimeout(() => { sincronizado.value = false }, 4000)
  } catch (err) {
    errorSync.value = 'Sin conexión (revisa Firebase)'
    console.error('Firebase error:', err)
  } finally {
    cargandoNube.value = false
  }

  window.addEventListener('cotizacion-actualizada', onCotActualizada)
})

onUnmounted(() => {
  window.removeEventListener('cotizacion-actualizada', onCotActualizada)
})

// ── Lista de usuarios para filtro admin ───────────────────────────────────────
const usuariosFiltro = ref([])

// ── Guardar en Firestore + actualizar lista local ─────────────────────────────
const persistir = async (arr) => {
  sincronizando.value = true
  errorSync.value = ''
  try {
    // Solo guarda las cotizaciones del usuario actual (no admin)
    for (const cot of arr) {
      await guardarEnFirestore(usuarioActual, cot)
    }
    sincronizado.value = true
    setTimeout(() => { sincronizado.value = false }, 4000)
  } catch (err) {
    errorSync.value = 'Error al sincronizar'
    console.error(err)
  } finally {
    sincronizando.value = false
  }
}

// ── Capturar el último evento que Panel3 dispara ──────────────────────────────
const _ultimo = ref(null)
const onCotActualizada = (e) => { _ultimo.value = e.detail }

// ── Helpers de cálculo técnico ────────────────────────────────────────────────
const calcGen = (n, h) => Math.round(POTENCIA_PANEL_KWP * n * 30 * h * 100) / 100
const buscarN = (gen, h) => {
  let best = 1, minD = Infinity
  for (let n = 1; n <= 1048; n++) {
    const d = Math.abs(calcGen(n, h) - gen)
    if (d < minD) { minD = d; best = n }
  }
  return best
}

// ── Snapshot ──────────────────────────────────────────────────────────────────
const calcularSnapshot = () => {
  const ev = _ultimo.value || {}
  const genPlanta        = ev.generacion    || 0
  const consumo          = ev.consumo       || 0
  const hbsVal           = ev.hbs           || 3.8
  const tarifa           = ev.tarifaKwh     || 0
  const contrib          = ev.contribucion  || 0
  const alu              = ev.aluPublico    || 0
  const auto             = ev.autoconsumo   || 0
  const adicionales      = ev.adicionales   || 0
  const itemsAdicionales = ev.itemsAdicionales || []
  const descuento        = ev.descuento     || 0
  if (!genPlanta) return null

  const n          = buscarN(genPlanta, hbsVal)
  const potencia   = Math.round(n * POTENCIA_PANEL_KWP * 100) / 100
  const generacion = calcGen(n, hbsVal)
  const area       = n * 3 + 4
  const peso       = n * 31
  const cobertura  = consumo > 0 ? (genPlanta / consumo) * 100 : 0

  const valorTotalConAdicionales = ev.costoTotal || 0
  const valorConDescuento        = ev.valorConDescuento || valorTotalConAdicionales
  const valorFinal               = descuento > 0 ? valorConDescuento : valorTotalConAdicionales

  let pagoMensual = 0, pagoAnual = 0, ahorroMes = 0
  if (consumo > 0 && tarifa > 0) {
    const L3    = consumo * tarifa
    pagoMensual = Math.round(L3 + L3 * (contrib / 100) + L3 * (alu / 100))
    pagoAnual   = pagoMensual * 12
  }
  if (genPlanta > 0 && tarifa > 0 && auto > 0) {
    const J14  = genPlanta * (auto / 100) * tarifa * (1 + contrib / 100 + alu / 100)
    const K14  = genPlanta * (1 - auto / 100) * (tarifa - 200)
    ahorroMes  = Math.round(J14 + K14)
  }

  return {
    cliente: store.userName || 'Sin nombre',
    consumoCliente: consumo, generacionPlanta: genPlanta, hbs: hbsVal,
    tarifaKwh: tarifa,
    contribucion: contrib, aluPublico: alu, autoconsumo: auto,
    adicionales, itemsAdicionales, descuento,
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

// ── Guardar cotización actual ─────────────────────────────────────────────────
const guardarActual = async () => {
  const snap = calcularSnapshot()
  if (!snap) { showToast('⚠️ Ingrese datos en el cotizador primero', 'warn'); return }
  guardando.value = true
  const id  = Date.now()
  const nueva = { id, fecha: new Date().toISOString(), ...snap }
  try {
    await guardarEnFirestore(usuarioActual, nueva)
    cotizaciones.value = [{ ...nueva, _usuario: usuarioActual }, ...cotizaciones.value]
    sincronizado.value = true
    setTimeout(() => { sincronizado.value = false }, 4000)
    showToast('✅ Cotización guardada en la nube ☁️', 'ok')
  } catch (err) {
    showToast('⚠️ Error al guardar en la nube', 'warn')
    console.error(err)
  } finally {
    guardando.value = false
  }
}

// ── Cargar cotización al formulario ──────────────────────────────────────────
const cargar = (cot) => {
  window.dispatchEvent(new CustomEvent('registro-cargar-cotizacion', { detail: cot }))
  store.userName = cot.cliente
  showToast('↩️ Cotización cargada en el formulario', 'info')
}

// ── Eliminar ──────────────────────────────────────────────────────────────────
const eliminar = async (id, usuarioCot) => {
  const owner = usuarioCot || usuarioActual
  try {
    await eliminarDeFirestore(owner, id)
    cotizaciones.value = cotizaciones.value.filter(c => c.id !== id)
    if (open.value === id) open.value = null
    showToast('🗑️ Eliminada', 'warn')
  } catch (err) {
    showToast('⚠️ Error al eliminar', 'warn')
    console.error(err)
  }
}

const pedirLimpiar = () => { modalLimpiar.value = true }
const limpiarTodo  = async () => {
  try {
    // Elimina una por una de Firestore
    for (const cot of cotizaciones.value) {
      await eliminarDeFirestore(usuarioActual, cot.id)
    }
    cotizaciones.value = []
    modalLimpiar.value = false
    open.value = null
    showToast('🗑️ Historial eliminado', 'warn')
  } catch (err) {
    showToast('⚠️ Error al limpiar', 'warn')
  }
}

// ── UI ────────────────────────────────────────────────────────────────────────
const open         = ref(null)
const q            = ref('')
const modalLimpiar = ref(false)
const fotoAbierta  = ref(null)
const toast        = ref({ show: false, msg: '', type: 'ok' })
let toastTimer     = null

// ── Estado de cotizaciones ────────────────────────────────────────────────────
const modalRechazar  = ref(false)
const cotArechazar   = ref(null)

const estadoLabel = (estado) => {
  if (estado === 'aceptada')  return '✅ Aceptada'
  if (estado === 'rechazada') return '❌ Rechazada'
  return '⏳ Pendiente'
}

const setEstado = async (cot, nuevoEstado) => {
  const idx = cotizaciones.value.findIndex(c => c.id === cot.id)
  if (idx === -1) return
  cotizaciones.value[idx] = { ...cotizaciones.value[idx], estado: nuevoEstado }
  cotizaciones.value = [...cotizaciones.value]
  const owner = cot._usuario || usuarioActual
  try {
    await guardarEnFirestore(owner, cotizaciones.value[idx])
  } catch (_) {}
  const labels = { pendiente: '⏳ Marcada como Pendiente', aceptada: '✅ ¡Cotización Aceptada!', rechazada: '❌ Marcada como Rechazada' }
  showToast(labels[nuevoEstado] || 'Estado actualizado',
    nuevoEstado === 'aceptada' ? 'ok' : nuevoEstado === 'rechazada' ? 'warn' : 'info')
}

const pedirRechazar = (cot) => {
  if (cot.estado === 'rechazada') return
  cotArechazar.value = cot
  modalRechazar.value = true
}

const confirmarRechazar = async () => {
  if (cotArechazar.value) await setEstado(cotArechazar.value, 'rechazada')
  modalRechazar.value = false
  cotArechazar.value = null
}

const abrirFoto = (foto) => { fotoAbierta.value = foto }

// ── Lista filtrada (admin: por usuario; todos: por búsqueda) ──────────────────
const filtradas = computed(() => {
  let base = cotizaciones.value
  if (esAdmin && filtroUsuario.value) {
    base = base.filter(c => c._usuario === filtroUsuario.value)
  }
  if (!q.value.trim()) return base
  const busq = q.value.toLowerCase()
  return base.filter(c =>
    (c.cliente || '').toLowerCase().includes(busq) ||
    fmtFecha(c.fecha).includes(busq) ||
    String(c.consumoCliente).includes(busq) ||
    String(c.nPaneles).includes(busq) ||
    fmtM(c.valorFinal).toLowerCase().includes(busq)
  )
})

const toggle         = (id) => { open.value = open.value === id ? null : id }
const numeroRelativo = (id) => filtradas.value.findIndex(c => c.id === id) + 1

// ── CSV ───────────────────────────────────────────────────────────────────────
const CABECERAS = ['N°','Fecha','Cliente','Usuario','Consumo (kWh/mes)','Generacion Planta (kWh/mes)','HBS (h/dia)','Tarifa kWh','Contribucion (%)','Alu. Publico (%)','Autoconsumo (%)','Descuento (%)','Adicionales','Potencia (kWp)','N Paneles','Area (m2)','Peso (kg)','Cobertura (%)','Pago Mensual','Pago Anual','Ahorro Mensual','Ahorro Anual','Valor Final','Estado']

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
    escaparCSV(c._usuario || usuarioActual),
    c.consumoCliente   ?? '',
    c.generacionPlanta ?? '',
    c.hbs              ?? '',
    c.tarifaKwh        ?? '',
    c.contribucion     ?? '',
    c.aluPublico       ?? '',
    c.autoconsumo      ?? '',
    c.descuento        ?? '',
    c.adicionales      ?? '',
    c.potencia         ?? '',
    c.nPaneles         ?? '',
    c.area             ?? '',
    c.peso             ?? '',
    c.cobertura        ? Math.round(c.cobertura) : '',
    c.pagoMensual      ?? '',
    c.pagoAnual        ?? '',
    c.ahorroMes        ?? '',
    c.ahorroMes        ? c.ahorroMes * 12 : '',
    c.valorFinal       ?? '',
    c.estado           || 'pendiente',
  ]
  return fila.join(';')
}

const descargar = (contenido, nombre) => {
  const blob = new Blob(['sep=;\n' + contenido], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement('a'), { href: url, download: nombre })
  a.click(); URL.revokeObjectURL(url)
}

const exportTodo = () => {
  const filas = [CABECERAS.join(';'), ...filtradas.value.map((c, i) => cotACsv(c, i))]
  descargar(filas.join('\n'), `soinsolar_cotizaciones_${hoy()}.csv`)
  showToast('📊 CSV exportado', 'ok')
}

const exportUno = (cot) => {
  const idx   = filtradas.value.findIndex(c => c.id === cot.id)
  const filas = [CABECERAS.join(';'), cotACsv(cot, idx)]
  descargar(filas.join('\n'), `cotizacion_${slug(cot.cliente)}_${hoy()}.csv`)
  showToast('📄 CSV exportado', 'ok')
}

// ── Formateo ──────────────────────────────────────────────────────────────────
const fmtM     = (v) => (!v && v !== 0) ? '—' : new Intl.NumberFormat('es-CO', {style:'currency',currency:'COP',maximumFractionDigits:0}).format(v)
const fmtFecha = (iso) => !iso ? '—' : new Date(iso).toLocaleString('es-CO', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})
const hoy      = () => new Date().toISOString().slice(0,10)
const slug     = (s) => (s||'cliente').toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')

// ── Toast ─────────────────────────────────────────────────────────────────────
const showToast = (msg, type = 'ok') => {
  clearTimeout(toastTimer)
  toast.value = { show: true, msg, type }
  toastTimer  = setTimeout(() => { toast.value.show = false }, 3200)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');

* { box-sizing:border-box; margin:0; padding:0; }

.registro {
  font-family:'Montserrat',sans-serif;
  padding:24px;
  max-width:1100px;
  margin:0 auto;
}

/* ── Header ───────────────────────────────────────────────────────────────── */
.reg-header {
  display:flex; justify-content:space-between; align-items:center;
  flex-wrap:wrap; gap:14px; margin-bottom:20px;
}
.reg-header-left { display:flex; align-items:center; gap:14px; }
.reg-icon-wrap { width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#1f2c51,#2d3f75);display:flex;align-items:center;justify-content:center;flex-shrink:0; }
.reg-icon { font-size:1.5rem; }
.reg-title { font-size:1.25rem;font-weight:800;color:#1f2c51;margin-bottom:4px;display:flex;align-items:center;gap:10px;flex-wrap:wrap; }
.reg-sub { font-size:13px;color:#64748b;display:flex;align-items:center;gap:8px;flex-wrap:wrap; }
.badge-count { background:linear-gradient(135deg,#1f2c51,#2d3f75);color:#fff;font-weight:700;font-size:12px;padding:2px 8px;border-radius:20px; }
.sync-badge { font-size:11px;font-weight:600;padding:3px 9px;border-radius:20px;background:#f1f5f9;color:#64748b; }
.sync-ok { background:#dcfce7;color:#166534; }
.sync-error { background:#fef9c3;color:#92400e;cursor:help; }
.reg-header-right { display:flex;align-items:center;gap:10px;flex-wrap:wrap; }

/* Badge admin */
.admin-badge {
  font-size:12px; font-weight:700; padding:3px 10px;
  background:linear-gradient(135deg,#7c3aed,#6d28d9);
  color:#fff; border-radius:20px;
}

/* Filtro usuario admin */
.select-usuario {
  padding:8px 14px; border-radius:10px; border:1.5px solid #e2e8f0;
  font-family:'Montserrat',sans-serif; font-size:13px; font-weight:600;
  color:#1f2c51; background:#fff; cursor:pointer; outline:none;
  transition:border-color 0.2s;
}
.select-usuario:focus { border-color:#1f2c51; }

/* Tag usuario en tarjeta */
.user-tag {
  font-size:11px; font-weight:700; padding:2px 8px;
  background:#ede9fe; color:#7c3aed; border-radius:20px;
  white-space:nowrap;
}

/* Botones */
.btn { display:inline-flex;align-items:center;gap:8px;padding:9px 18px;border-radius:10px;font-family:'Montserrat',sans-serif;font-size:13px;font-weight:700;cursor:pointer;border:none;transition:all 0.22s ease; }
.btn-guardar { background:linear-gradient(135deg,#1f2c51,#2d3f75);color:#fff; }
.btn-guardar:hover:not(:disabled) { transform:translateY(-1px);box-shadow:0 6px 20px rgba(31,44,81,0.3); }
.btn-guardar:disabled { opacity:0.45;cursor:not-allowed;transform:none; }
.btn-danger-soft { background:#fef2f2;color:#dc2626;border:1.5px solid #fecaca; }
.btn-danger-soft:hover { background:#fee2e2;transform:translateY(-1px); }
.btn-danger { background:linear-gradient(135deg,#dc2626,#b91c1c);color:#fff; }
.btn-cargar { background:linear-gradient(135deg,#0ea5e9,#0284c7);color:#fff; }
.btn-cargar:hover { transform:translateY(-1px);box-shadow:0 4px 14px rgba(14,165,233,0.35); }
.btn-csv { background:#f1f5f9;color:#475569;border:1.5px solid #e2e8f0; }
.btn-csv:hover { background:#e2e8f0;transform:translateY(-1px); }
.btn-export { background:linear-gradient(135deg,#059669,#047857);color:#fff; }
.btn-export:hover { transform:translateY(-1px);box-shadow:0 4px 14px rgba(5,150,105,0.3); }
.btn-cancelar { background:#f1f5f9;color:#475569;border:1.5px solid #e2e8f0;border-radius:10px;padding:9px 18px;font-family:'Montserrat',sans-serif;font-size:13px;font-weight:700;cursor:pointer; }

/* ── Search ──────────────────────────────────────────────────────────────── */
.search-wrap { position:relative;display:flex;align-items:center;margin-bottom:18px; }
.search-ico { position:absolute;left:14px;font-size:1rem; }
.search-input { width:100%;padding:11px 40px 11px 42px;border-radius:12px;border:1.5px solid #e2e8f0;font-family:'Montserrat',sans-serif;font-size:14px;background:#f8fafc;outline:none;transition:border-color 0.2s,box-shadow 0.2s; }
.search-input:focus { border-color:#1f2c51;box-shadow:0 0 0 3px rgba(31,44,81,0.08);background:#fff; }
.search-clear { position:absolute;right:12px;background:none;border:none;cursor:pointer;font-size:14px;color:#94a3b8;padding:4px;border-radius:6px; }
.search-clear:hover { color:#1f2c51;background:#f1f5f9; }

/* ── Lista ────────────────────────────────────────────────────────────────── */
.lista { display:flex;flex-direction:column;gap:10px; }

/* ── Card ─────────────────────────────────────────────────────────────────── */
.card { background:#fff;border-radius:16px;border:1.5px solid #e2e8f0;overflow:hidden;transition:box-shadow 0.2s,border-color 0.2s; }
.card:hover { box-shadow:0 4px 20px rgba(31,44,81,0.1); }
.card-open { border-color:#1f2c51;box-shadow:0 6px 24px rgba(31,44,81,0.14); }

.card-row { display:flex;align-items:center;gap:12px;padding:14px 18px;cursor:pointer;flex-wrap:wrap; }
.num-badge { background:linear-gradient(135deg,#f1f5f9,#e2e8f0);color:#475569;font-weight:800;font-size:11px;min-width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:8px;flex-shrink:0; }
.row-main { flex:1;min-width:0;display:flex;flex-direction:column;gap:2px; }
.row-cliente { font-weight:700;font-size:14px;color:#1f2c51;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
.row-fecha { font-size:11px;color:#94a3b8;font-weight:500; }
.row-chips { display:flex;gap:6px;flex-wrap:wrap;flex-shrink:0; }
.chip { font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;white-space:nowrap; }
.chip-blue { background:#dbeafe;color:#1d4ed8; }
.chip-green { background:#dcfce7;color:#166534; }
.chip-purple { background:#f3e8ff;color:#7e22ce; }
.row-right { display:flex;align-items:center;gap:10px;margin-left:auto;flex-shrink:0; }
.row-valor { font-weight:800;font-size:14px;color:#1f2c51; }
.arrow { font-size:11px;color:#94a3b8;transition:transform 0.25s;display:inline-block; }
.arrow.open { transform:rotate(180deg); }

/* ── Detalle ──────────────────────────────────────────────────────────────── */
.card-detail { padding:0 18px 18px; border-top:1px solid #f1f5f9; }
.detail-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:16px 0; }
.dcol { background:#f8fafc;border-radius:12px;padding:14px 16px; }
.dcol-title { font-size:11px;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px; }
.drow { display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid #f1f5f9;font-size:12px; }
.drow:last-child { border-bottom:none; }
.drow span { color:#64748b;font-weight:500; }
.drow b { font-weight:700;color:#1f2c51; }
.val-green { color:#059669!important; }
.val-blue  { color:#2563eb!important; }
.val-orange{ color:#d97706!important; }
.val-gold  { color:#d97706!important;font-size:14px!important; }
.adicionales-items { margin:6px 0; }
.adicional-detail-row { display:flex;justify-content:space-between;align-items:center;padding:4px 8px;background:#f0fdf4;border-radius:6px;margin-bottom:3px; }
.adicional-detail-nombre { color:#059669;font-weight:600;flex:1;font-size:12px; }
.adicional-detail-precio { font-weight:700;color:#10b981;font-size:12px; }
.drow-total span { font-weight:800!important;color:#1f2c51!important;font-size:13px; }
.card-actions { display:flex;gap:10px;flex-wrap:wrap;padding-top:14px;border-top:1px solid #f1f5f9; }

/* ── Vacío ────────────────────────────────────────────────────────────────── */
.empty { text-align:center;padding:56px 20px;color:#94a3b8; }
.empty-ico { font-size:4rem;margin-bottom:14px;opacity:0.5; }
.empty p { font-size:15px;line-height:1.8; }
.loading-text { display:flex;align-items:center;justify-content:center;gap:8px;font-size:15px;color:#64748b; }
.spinner-inline { display:inline-block;animation:spin 1s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }

/* ── Export bar ──────────────────────────────────────────────────────────── */
.export-bar { margin-top:18px;display:flex;justify-content:flex-end; }

/* ── Expand transition ───────────────────────────────────────────────────── */
.expand-enter-active { animation:slideDown 0.22s ease-out; }
.expand-leave-active { animation:slideDown 0.18s ease-in reverse; }
@keyframes slideDown { from { opacity:0;transform:translateY(-8px); } to { opacity:1;transform:translateY(0); } }

/* ── Modal ───────────────────────────────────────────────────────────────── */
.modal-bg { position:fixed;inset:0;background:rgba(0,0,0,0.48);display:flex;align-items:center;justify-content:center;z-index:9999;backdrop-filter:blur(4px); }
.modal-box { background:#fff;border-radius:20px;padding:36px 30px;max-width:400px;width:90%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.22); }
.modal-ico { font-size:3rem;margin-bottom:10px; }
.modal-box h3 { font-size:1.15rem;font-weight:800;color:#1f2c51;margin:0 0 8px; }
.modal-box p  { font-size:14px;color:#64748b;line-height:1.6;margin:0 0 22px; }
.modal-btns   { display:flex;gap:12px;justify-content:center; }
.modal-enter-active,.modal-leave-active { transition:opacity 0.2s; }
.modal-enter-from,.modal-leave-to { opacity:0; }

/* ── Toast ───────────────────────────────────────────────────────────────── */
.toast { position:fixed;bottom:28px;right:28px;z-index:10000;padding:12px 20px;border-radius:12px;font-family:'Montserrat',sans-serif;font-size:14px;font-weight:600;pointer-events:none;box-shadow:0 8px 24px rgba(0,0,0,0.16); }
.toast-ok   { background:#1f2c51;color:#fff; }
.toast-info { background:#0ea5e9;color:#fff; }
.toast-warn { background:#dc2626;color:#fff; }
.toast-enter-active,.toast-leave-active { transition:all 0.28s ease; }
.toast-enter-from,.toast-leave-to { opacity:0;transform:translateY(10px); }

/* ── Fotos ───────────────────────────────────────────────────────────────── */
.fotos-section { margin-top:16px;padding-top:14px;border-top:1px solid #f1f5f9; }
.fotos-title { font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px; }
.fotos-grid { display:flex;flex-wrap:wrap;gap:10px; }
.foto-card { position:relative;border-radius:10px;overflow:hidden;border:2px solid #e2e8f0;transition:border-color 0.2s,transform 0.2s;cursor:pointer; }
.foto-card:hover { border-color:#F5B027;transform:scale(1.03); }
.foto-thumb { width:90px;height:70px;object-fit:cover;display:block; }

/* ── Lightbox ────────────────────────────────────────────────────────────── */
.lightbox-bg { align-items:center;justify-content:center; }
.lightbox-box { position:relative;max-width:92vw;max-height:90vh;display:flex;align-items:center;justify-content:center; }
.lightbox-img { max-width:92vw;max-height:86vh;border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,0.5);object-fit:contain; }
.lightbox-close { position:absolute;top:-14px;right:-14px;width:34px;height:34px;border-radius:50%;background:#fff;border:none;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,0.2);z-index:1;transition:background 0.2s; }
.lightbox-close:hover { background:#fee2e2;color:#dc2626; }

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width:900px) { .detail-grid { grid-template-columns:1fr 1fr; } }
@media (max-width:640px) {
  .registro { padding:16px; }
  .reg-header { flex-direction:column;align-items:flex-start; }
  .card-row { flex-direction:column;align-items:flex-start;gap:8px; }
  .row-right { margin-left:0; }
  .detail-grid { grid-template-columns:1fr; }
  .card-actions { flex-direction:column; }
  .card-actions .btn { width:100%;justify-content:center; }
  .foto-thumb { width:72px;height:58px; }
  .estado-btns { flex-direction:column; }
  .btn-estado { width:100%;text-align:center; }
}

/* ── Estados ─────────────────────────────────────────────────────────────── */
.estado-badge { font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;white-space:nowrap;flex-shrink:0;letter-spacing:0.2px;transition:all 0.2s; }
.estado-pendiente { background:#fef9c3;color:#a16207;border:1px solid #fde68a; }
.estado-aceptada  { background:#dcfce7;color:#166534;border:1px solid #86efac; }
.estado-rechazada { background:#fee2e2;color:#991b1b;border:1px solid #fca5a5; }

.estado-section { margin-bottom:16px;padding:14px 16px;background:#f8fafc;border-radius:12px;border:1.5px solid #e2e8f0; }
.estado-label-title { display:block;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px; }
.estado-btns { display:flex;gap:8px;flex-wrap:wrap; }

.btn-estado { padding:8px 16px;border-radius:10px;font-family:'Montserrat',sans-serif;font-size:12px;font-weight:700;cursor:pointer;border:2px solid transparent;transition:all 0.22s ease;background:#f1f5f9;color:#475569; }
.btn-estado:hover { transform:translateY(-1px); }
.btn-estado[data-estado="pendiente"]:hover,.btn-estado[data-estado="pendiente"].active { background:#fef9c3;color:#92400e;border-color:#fde68a; }
.btn-estado[data-estado="aceptada"]:hover,.btn-estado[data-estado="aceptada"].active { background:#dcfce7;color:#166534;border-color:#86efac;box-shadow:0 3px 10px rgba(22,163,74,0.18); }
.btn-estado[data-estado="rechazada"]:hover,.btn-estado[data-estado="rechazada"].active { background:#fee2e2;color:#991b1b;border-color:#fca5a5;box-shadow:0 3px 10px rgba(239,68,68,0.15); }

.retract-bar { display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:12px;padding:10px 14px;background:linear-gradient(135deg,#fff7ed,#fef3c7);border:1.5px dashed #fbbf24;border-radius:10px; }
.retract-ico { font-size:1.1rem;flex-shrink:0; }
.retract-msg { font-size:12px;color:#92400e;font-weight:600;flex:1;min-width:120px; }
.btn-retract { padding:6px 14px;border-radius:8px;border:none;background:linear-gradient(135deg,#f59e0b,#F5B027);color:#fff;font-family:'Montserrat',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all 0.2s;white-space:nowrap;flex-shrink:0; }
.btn-retract:hover { transform:translateY(-1px);box-shadow:0 4px 12px rgba(245,176,39,0.35); }

.retract-enter-active { animation:slideDown 0.28s ease-out; }
.retract-leave-active { animation:slideDown 0.2s ease-in reverse; }

.modal-rechazar .rechazar-sub { font-size:12px;color:#16a34a;font-weight:600;margin-top:-8px!important; }
.btn-rechazar-confirm { background:linear-gradient(135deg,#dc2626,#b91c1c);color:#fff;border:none;border-radius:10px;padding:9px 18px;font-family:'Montserrat',sans-serif;font-weight:700;font-size:13px;cursor:pointer;transition:all 0.22s; }
.btn-rechazar-confirm:hover { transform:translateY(-1px);box-shadow:0 4px 14px rgba(220,38,38,0.3); }
</style>