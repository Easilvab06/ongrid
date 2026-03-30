<template>
  <div class="panel3">
    <div class="panel-content">
      <!-- Layout principal: izquierda entradas, derecha gráfica -->
      <div class="main-layout">
        <!-- Panel izquierdo: entradas apiladas -->
        <div class="left-panel">
          <!-- Entrada de Consumo del Cliente -->
          <div class="input-section">
            <h3 class="section-title">{{ isSharedLink ? 'Consumo del cliente' : 'Ingrese el Consumo del Cliente' }}</h3>
            <div class="input-group">
              <input
                v-model.number="consumoCliente"
                @input="actualizarInstantaneo"
                type="number"
                placeholder="Ej: 800"
                class="consumo-input"
                :class="{ 'input-error': consumoCliente !== null && consumoCliente !== '' && (consumoCliente < 1 || consumoCliente > 999999) }"
                :disabled="isSharedLink"
              />
              <span class="input-unit">kWh/mes</span>
            </div>
          </div>

          <!-- Tarifa KWh -->
          <div class="input-section" v-if="!isSharedLink">
            <h3 class="section-title">Tarifa kWh</h3>
            <div class="input-group tarifa-group">
              <span class="currency-symbol-purple">$</span>
              <input
                v-model.number="tarifaKwh"
                @input="actualizarInstantaneo"
                type="number"
                placeholder="Ej: 821"
                class="tarifa-input"
                :class="{ 'input-error-purple': tarifaKwh !== null && tarifaKwh !== '' && (tarifaKwh < 1 || tarifaKwh > 9999999) }"
                min="0"
              />
            </div>
          </div>

          <!-- Opciones avanzadas colapsables -->
          <div class="advanced-toggle" v-if="!isSharedLink">
            <button @click="mostrarAvanzados = !mostrarAvanzados" class="toggle-btn">
              <span class="toggle-arrow">{{ mostrarAvanzados ? '▲' : '▼' }}</span>
              {{ mostrarAvanzados ? 'Ocultar opciones' : 'Más opciones' }}
            </button>
          </div>

          <template v-if="mostrarAvanzados && !isSharedLink">
            <!-- Contribución y Alumbrado Público en fila -->
            <div class="input-doble">
              <div class="input-doble-col">
                <h3 class="section-title-sm">Contribución</h3>
                <div class="input-group">
                  <input
                    v-model.number="contribucion"
                    @input="actualizarInstantaneo"
                    type="number"
                    placeholder="20"
                    class="pct-input"
                    :class="{ 'input-error-indigo': contribucion !== null && contribucion !== '' && (contribucion < 0 || contribucion > 100) }"
                    min="0" max="100"
                  />
                  <span class="input-unit">%</span>
                </div>
              </div>
              <div class="input-doble-col">
                <h3 class="section-title-sm">Alu. Público</h3>
                <div class="input-group">
                  <input
                    v-model.number="aluPublico"
                    @input="actualizarInstantaneo"
                    type="number"
                    placeholder="15"
                    class="pct-input"
                    :class="{ 'input-error-indigo': aluPublico !== null && aluPublico !== '' && (aluPublico < 0 || aluPublico > 100) }"
                    min="0" max="100"
                  />
                  <span class="input-unit">%</span>
                </div>
              </div>
            </div>

            <!-- % Autoconsumo -->
            <div class="input-section">
              <h3 class="section-title">% de Autoconsumo</h3>
              <div class="input-group">
                <input
                  v-model.number="autoconsumo"
                  @input="actualizarInstantaneo"
                  type="number"
                  placeholder="60"
                  class="auto-input"
                  :class="{ 'input-error-green': autoconsumo !== null && autoconsumo !== '' && (autoconsumo < 0 || autoconsumo > 100) }"
                  min="0" max="100"
                />
                <span class="input-unit">%</span>
              </div>
            </div>

            <!-- Entrada HBS -->
            <div class="input-section">
              <h3 class="section-title">Horas de Brillo Solar (HBS)</h3>
              <div class="input-group">
                <input
                  v-model.number="hbs"
                  @input="actualizarInstantaneo"
                  type="number"
                  placeholder="Ej: 3.8"
                  step="0.1"
                  min="1"
                  max="8"
                  class="hbs-input"
                  :class="{ 'input-error-amber': hbs !== null && hbs !== '' && (hbs < 1 || hbs > 8) }"
                />
                <span class="input-unit">h/día</span>
              </div>
            </div>
          </template>

          <!-- Entrada de Generación de la Planta -->
          <div class="input-section">
            <h3 class="section-title">{{ isSharedLink ? 'Generación de la Planta' : 'Ingrese Generación de la Planta' }}</h3>
            <div class="input-group">
              <input
                v-model.number="generacionPlanta"
                @input="actualizarInstantaneo"
                type="number"
                placeholder="Ej: 1000"
                class="consumo-input"
                :class="{ 'input-error': generacionPlanta !== null && generacionPlanta !== '' && (generacionPlanta < 1 || generacionPlanta > 2480000) }"
                :disabled="isSharedLink"
              />
              <span class="input-unit">kWh/mes</span>
            </div>
            <template v-if="!isSharedLink">
              <p class="validation-hint" v-if="generacionPlanta !== null && generacionPlanta !== '' && generacionPlanta < 1">
                ⚠️ Valor mínimo permitido: <strong>70 kWh/mes</strong>
              </p>
              <p class="validation-hint" v-else-if="generacionPlanta !== null && generacionPlanta !== '' && generacionPlanta > 2480000">
                ⚠️ Valor máximo permitido: <strong>282.720 kWh/mes</strong> (4.000 paneles)
              </p>
              <p class="validation-hint valid" v-else-if="generacionPlanta > 0">
                ✅ Rango válido: 70 – 282.720 kWh/mes
              </p>
              <p class="input-hint" v-else>Rango válido: 70 – 282.720 kWh/mes (máx. 4.000 paneles)</p>
            </template>
          </div>

          <!-- Entrada de Adicionales -->
          <div class="input-section adicionales-section" v-if="!isSharedLink">
            <h3 class="section-title">Adicionales</h3>

            <!-- Lista de ítems agregados -->
            <div class="adicionales-list" v-if="itemsAdicionales.length > 0">
              <div
                v-for="(item, index) in itemsAdicionales"
                :key="index"
                class="adicional-item"
              >
                <!-- MODO EDICIÓN -->
                <template v-if="editandoIndex === index">
                  <input
                    v-model="editandoNombre"
                    type="text"
                    class="edit-nombre-input"
                    placeholder="Nombre"
                    @keyup.enter="guardarEdicion"
                    @keyup.esc="cancelarEdicion"
                  />
                  <div class="edit-precio-wrapper">
                    <span class="edit-precio-symbol">$</span>
                    <input
                      v-model.number="editandoPrecio"
                      type="number"
                      class="edit-precio-input"
                      min="0"
                      @keyup.enter="guardarEdicion"
                      @keyup.esc="cancelarEdicion"
                    />
                  </div>
                  <button @click="guardarEdicion" class="edit-save-btn" title="Guardar">✔</button>
                  <button @click="cancelarEdicion" class="edit-cancel-btn" title="Cancelar">✕</button>
                </template>

                <!-- MODO LECTURA -->
                <template v-else>
                  <span class="adicional-item-nombre">{{ item.nombre }}</span>
                  <span class="adicional-item-precio">{{ formatearMoneda(item.precio) }}</span>
                  <button @click="iniciarEdicion(index)" class="adicional-edit-btn" title="Editar">✏️</button>
                  <button @click="eliminarAdicional(index)" class="adicional-delete-btn" title="Eliminar">✕</button>
                </template>
              </div>

              <div class="adicionales-total-row">
                <span>Total adicionales:</span>
                <span class="adicionales-total-valor">{{ formatearMoneda(adicionales) }}</span>
              </div>
            </div>

            <!-- Formulario: nombre, precio, total en vivo y botón en columna -->
            <div class="adicional-form">
              <input
                v-model="nuevoAdicionalNombre"
                type="text"
                placeholder="Nombre del ítem"
                class="adicional-nombre-input"
              />
              <div class="adicional-precio-wrapper">
                <span class="adicional-precio-symbol">$</span>
                <input
                  v-model.number="nuevoAdicionalPrecio"
                  type="number"
                  placeholder="0"
                  class="adicional-precio-input"
                  min="0"
                />
              </div>
              <div
                class="adicional-total-live"
                v-if="adicionales > 0 || (nuevoAdicionalPrecio && nuevoAdicionalPrecio > 0)"
              >
                <span class="adicional-total-live-label">Total acumulado</span>
                <span class="adicional-total-live-valor">
                  {{ formatearMoneda((adicionales || 0) + (nuevoAdicionalPrecio && nuevoAdicionalPrecio > 0 ? nuevoAdicionalPrecio : 0)) }}
                </span>
              </div>
              <button @click="agregarAdicional" class="adicional-add-btn">+ Agregar</button>
            </div>

            <p class="input-hint">Agrega ítems adicionales al proyecto</p>
          </div>

          <!-- % Descuento -->
          <div class="input-section" v-if="!isSharedLink">
            <h3 class="section-title descuento-title">% Descuento</h3>
            <div class="input-group">
              <input
                v-model.number="descuento"
                @input="actualizarInstantaneo"
                type="number"
                placeholder="0"
                class="descuento-input"
                :class="{ 'input-error-dark': descuento !== null && descuento !== '' && (descuento < 0 || descuento > 100) }"
                min="0" max="100"
              />
              <span class="input-unit">%</span>
            </div>
            <p class="validation-hint dark" v-if="descuento !== null && descuento !== '' && (descuento < 0 || descuento > 100)">
              ⚠️ Rango válido: <strong>0% – 100%</strong>
            </p>
            <p class="validation-hint valid" v-else-if="descuento > 0 && descuento <= 100">
              ✅ Descuento de {{ descuento }}% aplicado
            </p>
            <p class="input-hint" v-else>Rango válido: 0% – 100% sobre el valor total</p>
          </div>
        </div>

        <!-- Panel derecho: gráfica -->
        <div class="right-panel">
          <div class="grafica-section" v-if="porcentajeCobertura !== null">
            <h3 class="section-title">Porcentaje de Cobertura</h3>
            <div class="pie-chart-container">
              <svg width="350" height="350" viewBox="0 0 200 200" class="pie-chart">
                <circle cx="100" cy="100" r="80" fill="none" :stroke="porcentajeCobertura >= 100 ? '#10b981' : '#e5e7eb'" stroke-width="20"/>
                <path
                  :d="arcoPorcentaje"
                  fill="none"
                  :stroke="porcentajeCobertura >= 100 ? '#10b981' : '#F5B027'"
                  stroke-width="20"
                  stroke-linecap="round"
                />
                <text x="100" y="95" text-anchor="middle" font-size="24" font-weight="bold" fill="#1f2937">{{ Math.round(porcentajeCobertura) }}%</text>
                <text x="100" y="115" text-anchor="middle" font-size="14" fill="#6b7280">Cobertura</text>
              </svg>
            </div>
            <p class="grafica-hint" v-if="porcentajeCobertura > 100">¡Exceso de generación! {{ Math.round(porcentajeCobertura - 100) }}% adicional</p>
          </div>
        </div>
      </div>

      <!-- Resultados dinámicos -->
      <div class="results-grid" v-if="resultados">
        <div class="result-card">
          <div class="result-icon">🌞</div>
          <div class="result-content">
            <div class="result-label">Generación de la Planta</div>
            <div class="result-value">{{ resultados.generacion }} <span class="unit">kWh/mes</span></div>
          </div>
        </div>

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

        <div class="result-card hbs-card">
          <div class="result-icon">☀️</div>
          <div class="result-content">
            <div class="result-label">Horas de Brillo Solar</div>
            <div class="result-value">{{ resultados.hbs }} <span class="unit">h/día</span></div>
          </div>
        </div>

        <div class="result-card kwp-card" v-if="!isSharedLink">
          <div class="result-icon">📈</div>
          <div class="result-content">
            <div class="result-label">Precio por KWp</div>
            <div class="result-value">{{ formatearMoneda(resultados.precioPorKwp) }}</div>
          </div>
        </div>

        <!-- LO QUE PAGAS MENSUAL -->
        <div class="result-card pago-card" v-if="resultados && resultados.pagoMensual > 0">
          <div class="result-icon pago-icon-anim">💡</div>
          <div class="result-content">
            <div class="result-label">Lo que pagas mensual</div>
            <div class="result-value pago-value">{{ formatearMoneda(resultados.pagoMensual) }}</div>
          </div>
        </div>

        <!-- LO QUE PAGAS ANUAL -->
        <div class="result-card pago-anual-card" v-if="resultados && resultados.pagoAnual > 0">
          <div class="result-icon pago-icon-anim2">📅</div>
          <div class="result-content">
            <div class="result-label">Lo que pagas anual</div>
            <div class="result-value pago-anual-value">{{ formatearMoneda(resultados.pagoAnual) }}</div>
          </div>
        </div>

        <!-- AHORRO MES + ANUAL -->
        <div class="result-card ahorro-card" v-if="resultados && resultados.ahorroMes > 0">
          <div class="ahorro-icon-wrap">
            <div class="result-icon ahorro-icon-anim">💲</div>
          </div>
          <div class="result-content">
            <div class="ahorro-header-label">Ahorro estimado</div>
            <div class="ahorro-row">
              <div class="ahorro-col">
                <div class="ahorro-col-label">Mensual</div>
                <div class="ahorro-col-value">{{ formatearMoneda(resultados.ahorroMes) }}</div>
              </div>
              <div class="ahorro-divider"></div>
              <div class="ahorro-col">
                <div class="ahorro-col-label">Anual</div>
                <div class="ahorro-col-value ahorro-col-value--anual">{{ formatearMoneda(resultados.ahorroMes * 12) }}</div>
              </div>
            </div>
            <div class="ahorro-detail" v-if="!isSharedLink">
              <span class="ahorro-pct">{{ resultados.autoconsumo }}% autoconsumo</span>
            </div>
          </div>
        </div>

        <!-- DESCUENTO -->
        <div class="result-card descuento-card" v-if="resultados && descuento > 0 && !isSharedLink">
          <div class="descuento-badge">-{{ descuento }}%</div>
          <div class="descuento-body">
            <div class="descuento-top-label">Valor con descuento aplicado</div>
            <div class="descuento-valores">
              <div class="descuento-col">
                <div class="descuento-col-label">Precio base</div>
                <div class="descuento-col-original">{{ formatearMoneda(resultados.valorTotalConAdicionales) }}</div>
              </div>
              <div class="descuento-separador"></div>
              <div class="descuento-col">
                <div class="descuento-col-label">Precio final</div>
                <div class="descuento-col-final">{{ formatearMoneda(resultados.valorConDescuento) }}</div>
              </div>
              <div class="descuento-separador"></div>
              <div class="descuento-col">
                <div class="descuento-col-label">Descuento</div>
                <div class="descuento-col-ahorro">{{ formatearMoneda(resultados.valorTotalConAdicionales - resultados.valorConDescuento) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- VALOR TOTAL -->
        <div class="result-card highlight">
          <div class="result-icon">💰</div>
          <div class="result-content">
            <div class="result-label">Valor Total del Proyecto</div>
            <div class="result-value-large">
              {{ formatearMoneda(descuento > 0 ? resultados.valorConDescuento : resultados.valorTotalConAdicionales) }}
            </div>
            <div class="breakdown" v-if="adicionales > 0 && !isSharedLink">
              <span class="breakdown-item">Base: {{ formatearMoneda(resultados.valorTotal) }}</span>
              <template v-for="(item, i) in itemsAdicionales" :key="i">
                <span class="breakdown-separator">+</span>
                <span class="breakdown-item">{{ item.nombre }}: {{ formatearMoneda(item.precio) }}</span>
              </template>
            </div>
            <div class="share-options" v-if="!isSharedLink">
              <button @click="generarLink" class="share-btn clipboard-btn">
                📋 Copiar Link
              </button>
              <button @click="compartirWhatsApp" class="share-btn whatsapp-btn">
                📱 WhatsApp
              </button>
              <button @click="compartirEmail" class="share-btn email-btn">
                ✉️ Email
              </button>
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useCotizacionStore } from '../store/cotizacion.js'

// Importar imágenes estáticas para structureImages
import img01  from '@/assets/01.png'
import img02  from '@/assets/02.png'
import img03  from '@/assets/03.png'
import img04  from '@/assets/04.png'
import img05  from '@/assets/05.png'
import img06  from '@/assets/06.png'
import img07  from '@/assets/07.png'
import img08  from '@/assets/08.png'
import img09  from '@/assets/09.png'
import img010 from '@/assets/010.png'

const cotizacionStore = useCotizacionStore()

// ─── CONSTANTES DEL EXCEL ────────────────────────────────────────────────────
const POTENCIA_PANEL_KWP = 0.62
const MAX_PANELES = 4000

const preciosExcel = [
  11394386, 15318213, 19698060, 21242040, 23577907, 25892013, 26806119, 27931369,
  29056619, 32107118, 34412352, 36427052, 38456453, 40692246, 43340819, 45765858,
  47951645, 49738028, 51528544, 53327331, 55060850, 57794370, 59303269, 61812167,
  63077909, 66051195, 69024481, 70491601, 71958721, 72701249, 74434465, 76167680,
  76545627, 77971023, 79396420, 80800320, 82204221, 85497400, 88629543, 91761685,
  92242452, 93646536, 95050619, 96438081, 97825543, 98285699, 99659875, 101034052,
  102321196, 103608340, 104690133, 107711522, 110732911, 111229648, 112583108, 113936569,
  115279367, 116622166, 117154186, 118488229, 119822272, 121249165, 122577833, 123906501,
  127052804, 130199106, 130744941, 132068445, 133391949, 133962344, 135278839, 136595333,
  137904712, 142290381, 144483216, 149427700, 153205914, 156984129, 159862800, 162741471,
  164169150, 165228099, 166287048, 167707546, 169128044, 170541945, 171601530, 172661116,
  174068571, 175476026, 177468873, 181167657, 184866442, 186274570, 187325978, 188377387,
  189779635, 191181883, 192504956, 193593964, 194682972, 196074394, 197465816, 198858577,
  200245916, 201633255, 203015811, 204398367, 205517749, 206904013, 207450046, 208839527,
  210226616, 212864319, 213830938, 215243540, 217947944, 219123262, 220199742, 221339876,
  222823772, 224307669, 225677750, 226746286, 227814821, 229181076, 230547332, 231910076,
  233272821, 234750300, 236110535, 237470770, 238250046, 239606806, 240963567, 242317159,
  243670751, 244456942, 245807282, 247157623, 249103037, 250803552, 252504067, 253850921,
  255197775, 255989131, 257332976, 258676822, 259946376, 261215930, 262156328, 263494607,
  264832885, 265636123, 268846141, 272056158, 273393850, 274731541, 275525616, 276860632,
  278195649, 279572195, 280905301, 282238408, 283569139, 284899870, 285702567, 287383153,
  289063739, 289869105, 291195744, 292522384, 293846828, 295171273, 295981279, 297303413,
  298625547, 299945599, 301265651, 302080063, 303750491, 305420919, 306237519, 307553973,
  308870427, 310184944, 311499462, 312320094, 313632552, 314945009, 315769829, 317080269,
  318390710, 320052140, 321295994, 322539848, 323847267, 325154687, 326538848, 327923008,
  330691330, 333063616, 336435903, 339643834, 341961761, 344279687, 347448727, 350617767,
  353403756, 355718572, 357033389, 358823713, 360136645, 361449576, 362760770, 363813506,
  364866242, 366175627, 367229465, 368283303, 369943068, 371602833, 372909434, 373962742,
  375016049, 376320939, 377625829, 378929150, 380232470, 381036014, 382337689, 383639364,
  384446520, 386098927, 387751335, 389050500, 390349665, 391158270, 392455871, 393510672,
  394565472, 397814629, 401063786, 402361575, 403659365, 404464706, 406113509, 407762312,
  408986199, 410210086, 411159931, 412453912, 413747893, 414557852, 415850392, 417142933,
  418434160, 419725388, 421538265, 423180783, 426067770, 428954757, 432255154, 435555550,
  438854560, 440153570, 442935436, 444233019, 446530602, 448315825, 450612002, 451908178,
  453555868, 455203557, 455990329, 457284331, 458578332, 459871059, 461163786, 461953597,
  463245003, 464536409, 465329301, 466619404, 467909507, 469551356, 471193204, 471987447,
  473275553, 474563659, 475360828, 476647684, 477934541, 479220242, 480505943, 481305808,
  482590298, 483874787, 485439674, 487004561, 487948720, 489231368, 490514016, 491317763,
  492599248, 493880732, 495161144, 496441556, 497247784, 499527066, 501945599, 504364132,
  505644639, 506925146, 508204606, 509484066, 510287947, 511566306, 512844664, 513651058,
  514928329, 516205599, 517481869, 518758139, 520271239, 521546872, 522822506, 524097163,
  525371821, 526181449, 527455074, 528728698, 529540666, 530813270, 532085873, 533357543,
  534629212, 536147987, 537419067, 538690148, 539505215, 540775310, 542045405, 543314602,
  544583798, 545400904, 546669140, 547937377, 549133181, 550328985, 551996110, 553262925,
  554529740, 555349695, 556615582, 557881469, 559146513, 560411557, 561233410, 562497549,
  563761687, 564585540, 566201358, 567817176, 569079984, 570342793, 571167273, 572429205,
  573691137, 574517539, 575778604, 577039669, 578299952, 579560236, 580388365, 582000485,
  583612604, 584871640, 586130676, 586959356, 588217562, 589475769, 590306255, 591563641,
  592821026, 594077675, 595334324, 596166429, 597775058, 599383687, 600216420, 601471823,
  602727225, 603981914, 605236604, 606070892, 607324802, 608578713, 610760369, 613942025,
  616920948, 619526277, 621131606, 623164889, 625198172, 627459819, 630720715, 633981611,
  636789523, 639049625, 641309728, 643119493, 646378809, 647638125, 649249682, 650861239,
  651671678, 652929829, 654187979, 655000208, 656257594, 657514980, 658771665, 660028349,
  660842224, 662098160, 663354096, 664962394, 666570692, 667385174, 668640008, 669894843,
  670711020, 671965127, 673219233, 674472674, 675726114, 676543845, 677796572, 680049300,
  682868662, 685473321, 688077980, 691664144, 693355741, 696047338, 699305578, 702563819,
  705749816, 707313734, 708877652, 710134489, 711163139, 712191789, 713800641, 715409492,
  716665255, 717921017, 718722164, 719977228, 721232291, 722035123, 723289493, 724543864,
  725797590, 726826654, 727855719, 731382819, 733546428, 735710037, 736964289, 738218542,
  739472157, 740725772, 741527454, 742780399, 744033343, 745285663, 746537983, 747341201,
  748945749, 750550297, 751354209, 752605501, 753856794, 755107479, 756358164, 757163563,
  758413606, 759663648, 760470587, 761719993, 762969399, 764571175, 766172951, 766980452,
  768228919, 769477386, 770653714, 771830042, 772782072, 774029343, 775276613, 776086998,
  777333657, 778580317, 780179443, 781778568, 782589467, 783835232, 785080996, 785893324,
  787138492, 788383659, 789628277, 790872895, 791686545, 792930577, 794174608, 795694480,
  796938193, 798181906, 799425084, 800668261, 801483748, 802726352, 803968956, 805211033,
  806453111, 807269859, 808511372, 809752886, 811275956, 812517167, 813758379, 814999076,
  816239773, 817058261, 818298407, 819538553, 820358329, 821597927, 822837526, 824076625,
  825315723, 826841833, 828080644, 829319455, 830486215, 831652976, 832617430, 833855217,
  835093003, 835915578, 837152838, 838390098, 839626878, 840863657, 842392659, 843629165,
  844865671, 845689809, 846925798, 848161788, 849107374, 850052960, 850878826, 852113639,
  853348453, 854175484, 855762511, 857349538, 858583631, 859817724, 860645065, 861878661,
  863112257, 864345402, 865578548, 866406939, 867639595, 868872251, 869701762, 871286715,
  872871668, 874103633, 875335598, 876165391, 877396876, 878628360, 879459247, 880690255,
  882921263, 884551842, 887382421, 889914297, 892797253, 895380209, 898538566, 901696924,
  905672171, 907901622, 910932941, 913964259, 917239428, 920514597, 923755026, 926995455,
  929792285, 931385123, 934977960, 937775341, 940015000, 943254658, 945493850, 946512732,
  947531615, 948770318, 950009020, 950808821, 952047038, 953285254, 954875981, 956466707,
  957266974, 958504475, 959741976, 960979027, 962216078, 963017491, 964254069, 965490647,
  966293242, 967529350, 968765458, 970354148, 971942838, 972745869, 973981288, 975216708,
  976020895, 977255853, 978490811, 979725339, 980959866, 981765140, 982999213, 984233285,
  985395376, 986557467, 988212412, 989445822, 990679231, 991486028, 992718991, 993951953,
  995184500, 996417047, 997224890, 998456996, 999689102, 1000498032, 1002082501, 1003666970,
  1004898438, 1006129905, 1006939205, 1008170239, 1009401274, 1010211638, 1011442242, 1012672847,
  1013903052, 1015133257, 1015944616, 1017527253, 1019109890, 1020339479, 1021569068, 1022380772,
  1023609942, 1024839111, 1025651844, 1026880596, 1028109348, 1029337715, 1030566081, 1031379773,
  1032960637, 1034541501, 1035355573, 1036583316, 1037811059, 1039038423, 1040265787, 1041080796,
  1042307756, 1043534715, 1044689744, 1045844772, 1046803822, 1048382970, 1049580690, 1050778410,
  1052946291, 1055114171, 1056340304, 1057566437, 1058382008, 1059607746, 1060833484, 1061650015,
  1062875361, 1064100706, 1065678701, 1067256697, 1068073518, 1069298305, 1070523092, 1071340855,
  1072565256, 1073789656, 1075013702, 1076237748, 1077056385, 1078280049, 1079503713, 1081080086,
  1082656459, 1083475366, 1084698490, 1086921614, 1088741434, 1089964183, 1091186931, 1093409336,
  1095631740, 1097653089, 1099674438, 1100590404, 1101506371, 1102729552, 1103952733, 1105175570,
  1106398407, 1107216034, 1108438501, 1109660969, 1110811539, 1111962110, 1112923694, 1114145457,
  1115367220, 1116891941, 1118113523, 1119335104, 1120556352, 1121777599, 1122597207, 1123818095,
  1125038984, 1125859462, 1127079993, 1128300523, 1129520727, 1130740930, 1132267681, 1133487709,
  1134707738, 1135529312, 1136748988, 1137968665, 1139188019, 1142407374, 1143229737, 1146448743,
  1149667750, 1152886438, 1156260137, 1159633836, 1161852356, 1165873325, 1169894294, 1173112471,
  1176330647, 1180548511, 1183766375, 1187287229, 1190808083, 1193025608, 1194609496, 1196188044,
  1197766593, 1198992140, 1200217688, 1201016133, 1202241323, 1203466512, 1204619806, 1205773099,
  1206715548, 1207940045, 1209164541, 1209964791, 1211541812, 1213118833, 1214342815, 1215566796,
  1216367380, 1217591012, 1218814644, 1219616128, 1220839413, 1222062697, 1223285655, 1224508612,
  1225310949, 1226886485, 1228462021, 1229264712, 1230487151, 1231709590, 1232931707, 1234153824,
  1234957352, 1236179131, 1237400909, 1238622370, 1239843830, 1240648186, 1242222277, 1243796368,
  1244601062, 1245822018, 1247042974, 1248263617, 1249484260, 1250289767, 1251510080, 1252730393,
  1253536742, 1254756726, 1255976710, 1257549394, 1259122078, 1259928712, 1261148224, 1262367737,
  1263515388, 1264663038, 1265613576, 1266832462, 1268051348, 1268859591, 1270078155, 1271296720,
  1272868034, 1274439348, 1275247860, 1276465967, 1277684074, 1278493393, 1279711184, 1280928974,
  1282146470, 1283363966, 1284174043, 1285391226, 1286608408, 1287419277, 1288988988, 1290558698,
  1291775436, 1292992173, 1293803291, 1295019720, 1296236148, 1297452289, 1298668431, 1299480286,
  1300696122, 1301911957, 1302724584, 1304292996, 1305861409, 1307076812, 1308292214, 1309105077,
  1310320178, 1311535278, 1312348900, 1313563700, 1314778500, 1315993022, 1317207543, 1319760373,
  1321327896, 1322895420, 1324038338, 1325181256, 1326137743, 1327351923, 1328566103, 1329380219,
  1330594104, 1331807989, 1333021602, 1334235214, 1335050028, 1336616311, 1338182594, 1338997665,
  1340210845, 1341424025, 1342636936, 1343849847, 1344665604, 1345878227, 1347090850, 1347907327,
  1349119663, 1350331999, 1351897072, 1353462144, 1354278826, 1355490761, 1356702697, 1357914370,
  1359126043, 1359943392, 1361154783, 1362366174, 1363184226, 1364395336, 1365606447, 1367170338,
  1368734229, 1369552474, 1370763194, 1371973915, 1372792852, 1374003295, 1375213738, 1376423927,
  1377634115, 1378453697, 1379663611, 1380873525, 1382364704, 1383855883, 1384818763, 1386028297,
  1387237830, 1388058270, 1389267533, 1390476796, 1391685809, 1392894823, 1393715891, 1394924636,
  1396133381, 1397660601, 1398869221, 1400077841, 1401286215, 1402494590, 1403316490, 1404524599,
  1407732708, 1410555264, 1414763108, 1417970953, 1421178556, 1424386159, 1427914887, 1431122369,
  1434329850, 1438537092, 1442744333, 1446567654, 1450774636, 1453981617, 1456692687, 1457847312,
  1459001937, 1460215261, 1461428585, 1462937213, 1464150403, 1465363593, 1466166854, 1467379773,
  1468592691, 1469805355, 1471018018, 1471821956, 1473034350, 1474246745, 1475387329, 1476527913,
  1478181355, 1479393366, 1480605377, 1481410252, 1482621998, 1483833743, 1485045239, 1486256735,
  1487062270, 1488273503, 1489484735, 1490290957, 1491854822, 1493418687, 1494629545, 1495840404,
  1496646850, 1497857448, 1499068046, 1499875169, 1501085507, 1502295845, 1503505941, 1504716037,
  1505523799, 1507086569, 1508649338, 1509859069, 1511068800, 1511876776, 1513086252, 1514295728,
  1515104366, 1516313587, 1517522809, 1518731792, 1519940776, 1520750039, 1522311736, 1523873434,
  1524682933, 1525891545, 1527100157, 1528308534, 1529516912, 1530327026, 1531535154, 1532743283,
  1547904400, 1549380000, 1550855600, 1552331200, 1553806800, 1555282400, 1556758000, 1558233600,
  1559709200, 1561184800, 1562660400, 1564136000, 1565611600, 1567087200, 1568562800, 1570038400,
  1571514000, 1572989600, 1574465200, 1575940800, 1577416400, 1578892000, 1580367600, 1581843200,
  1583318800, 1584794400, 1586270000, 1587745600, 1589221200, 1590696800, 1592172400, 1593648000,
  1595123600, 1596599200, 1598074800, 1599550400, 1601026000, 1602501600, 1603977200, 1605452800,
  1606928400, 1608404000, 1609879600, 1611355200, 1612830800, 1614306400, 1615782000, 1617257600,
  1618733200, 1620208800, 1621684400, 1623160000, 1624635600, 1626111200, 1627586800, 1629062400,
  1630538000, 1632013600, 1633489200, 1634964800, 1636440400, 1637916000, 1639391600, 1640867200,
  1642342800, 1643818400, 1645294000, 1646769600, 1648245200, 1649720800, 1651196400, 1652672000,
  1654147600, 1655623200, 1657098800, 1658574400, 1660050000, 1661525600, 1663001200, 1664476800,
  1665952400, 1667428000, 1668903600, 1670379200, 1671854800, 1673330400, 1674806000, 1676281600,
  1677757200, 1679232800, 1680708400, 1682184000, 1683659600, 1685135200, 1686610800, 1688086400,
  1689562000, 1691037600, 1692513200, 1693988800, 1695464400, 1696940000, 1698415600, 1699891200,
  1701366800, 1702842400, 1704318000, 1705793600, 1707269200, 1708744800, 1710220400, 1711696000,
  1713171600, 1714647200, 1716122800, 1717598400, 1719074000, 1720549600, 1722025200, 1723500800,
  1724976400, 1726452000, 1727927600, 1729403200, 1730878800, 1732354400, 1733830000, 1735305600,
  1736781200, 1738256800, 1739732400, 1741208000, 1742683600, 1744159200, 1745634800, 1747110400,
  1748586000, 1750061600, 1751537200, 1753012800, 1754488400, 1755964000, 1757439600, 1758915200,
  1760390800, 1761866400, 1763342000, 1764817600, 1766293200, 1767768800, 1769244400, 1770720000,
  1772195600, 1773671200, 1775146800, 1776622400, 1778098000, 1779573600, 1781049200, 1782524800,
  1784000400, 1785476000, 1786951600, 1788427200, 1789902800, 1791378400, 1792854000, 1794329600,
  1795805200, 1797280800, 1798756400, 1800232000, 1801707600, 1803183200, 1804658800, 1806134400,
  1807610000, 1809085600, 1810561200, 1812036800, 1813512400, 1814988000, 1816463600, 1817939200,
  1819414800, 1820890400, 1822366000, 1823841600, 1825317200, 1826792800, 1828268400, 1829744000,
  1831219600, 1832695200, 1834170800, 1835646400, 1837122000, 1838597600, 1840073200, 1841548800,
  1843024400, 1844500000, 1845975600, 1847451200, 1848926800, 1850402400, 1851878000, 1853353600,
  1854829200, 1856304800, 1857780400, 1859256000, 1860731600, 1862207200, 1863682800, 1865158400,
  1866634000, 1868109600, 1869585200, 1871060800, 1872536400, 1874012000, 1875487600, 1876963200,
  1878438800, 1879914400, 1881390000, 1882865600, 1884341200, 1885816800, 1887292400, 1888768000,
  1890243600, 1891719200, 1893194800, 1894670400, 1896146000, 1897621600, 1899097200, 1900572800,
  1902048400, 1903524000, 1904999600, 1906475200, 1907950800, 1909426400, 1910902000, 1912377600,
  1913853200, 1915328800, 1916804400, 1918280000, 1919755600, 1921231200, 1922706800, 1924182400,
  1925658000, 1927133600, 1928609200, 1930084800, 1931560400, 1933036000, 1934511600, 1935987200,
  1937462800, 1938938400, 1940414000, 1941889600, 1943365200, 1944840800, 1946316400, 1947792000,
  1949267600, 1950743200, 1952218800, 1953694400, 1955170000, 1956645600, 1958121200, 1959596800,
  1961072400, 1962548000, 1964023600, 1965499200, 1966974800, 1968450400, 1969926000, 1971401600,
  1972877200, 1974352800, 1975828400, 1977304000, 1978779600, 1980255200, 1981730800, 1983206400,
  1984682000, 1986157600, 1987633200, 1989108800, 1990584400, 1992060000, 1993535600, 1995011200,
  1996486800, 1997962400, 1999438000, 2000913600, 2002389200, 2003864800, 2005340400, 2006816000,
  2008291600, 2009767200, 2011242800, 2012718400, 2014194000, 2015669600, 2017145200, 2018620800,
  2020096400, 2021572000, 2023047600, 2024523200, 2025998800, 2027474400, 2028950000, 2030425600,
  2031901200, 2033376800, 2034852400, 2036328000, 2037803600, 2039279200, 2040754800, 2042230400,
  2043706000, 2045181600, 2046657200, 2048132800, 2049608400, 2051084000, 2052559600, 2054035200,
  2055510800, 2056986400, 2058462000, 2059937600, 2061413200, 2062888800, 2064364400, 2065840000,
  2067315600, 2068791200, 2070266800, 2071742400, 2073218000, 2074693600, 2076169200, 2077644800,
  2079120400, 2080596000, 2082071600, 2083547200, 2085022800, 2086498400, 2087974000, 2089449600,
  2090925200, 2092400800, 2093876400, 2095352000, 2096827600, 2098303200, 2099778800, 2101254400,
  2102730000, 2104205600, 2105681200, 2107156800, 2108632400, 2110108000, 2111583600, 2113059200,
  2114534800, 2116010400, 2117486000, 2118961600, 2120437200, 2121912800, 2123388400, 2124864000,
  2126339600, 2127815200, 2129290800, 2130766400, 2132242000, 2133717600, 2135193200, 2136668800,
  2138144400, 2139620000, 2141095600, 2142571200, 2144046800, 2145522400, 2146998000, 2148473600,
  2149949200, 2151424800, 2152900400, 2154376000, 2155851600, 2157327200, 2158802800, 2160278400,
  2161754000, 2163229600, 2164705200, 2166180800, 2167656400, 2169132000, 2170607600, 2172083200,
  2173558800, 2175034400, 2176510000, 2177985600, 2179461200, 2180936800, 2182412400, 2183888000,
  2185363600, 2186839200, 2188314800, 2189790400, 2191266000, 2192741600, 2194217200, 2195692800,
  2197168400, 2198644000, 2200119600, 2201595200, 2203070800, 2204546400, 2206022000, 2207497600,
  2208973200, 2210448800, 2211924400, 2213400000, 2214875600, 2216351200, 2217826800, 2219302400,
  2220778000, 2222253600, 2223729200, 2225204800, 2226680400, 2228156000, 2229631600, 2231107200,
  2232582800, 2234058400, 2235534000, 2237009600, 2238485200, 2239960800, 2241436400, 2242912000,
  2244387600, 2245863200, 2247338800, 2248814400, 2250290000, 2251765600, 2253241200, 2254716800,
  2256192400, 2257668000, 2259143600, 2260619200, 2262094800, 2263570400, 2265046000, 2266521600,
  2267997200, 2269472800, 2270948400, 2272424000, 2273899600, 2275375200, 2276850800, 2278326400,
  2279802000, 2281277600, 2282753200, 2284228800, 2285704400, 2287180000, 2288655600, 2290131200,
  2291606800, 2293082400, 2294558000, 2296033600, 2297509200, 2298984800, 2300460400, 2301936000,
  2303411600, 2304887200, 2306362800, 2307838400, 2309314000, 2310789600, 2312265200, 2313740800,
  2315216400, 2316692000, 2318167600, 2319643200, 2321118800, 2322594400, 2324070000, 2325545600,
  2327021200, 2328496800, 2329972400, 2331448000, 2332923600, 2334399200, 2335874800, 2337350400,
  2338826000, 2340301600, 2341777200, 2343252800, 2344728400, 2346204000, 2347679600, 2349155200,
  2350630800, 2352106400, 2353582000, 2355057600, 2356533200, 2358008800, 2359484400, 2360960000,
  2362435600, 2363911200, 2365386800, 2366862400, 2368338000, 2369813600, 2371289200, 2372764800,
  2374240400, 2375716000, 2377191600, 2378667200, 2380142800, 2381618400, 2383094000, 2384569600,
  2386045200, 2387520800, 2388996400, 2390472000, 2391947600, 2393423200, 2394898800, 2396374400,
  2397850000, 2399325600, 2400801200, 2402276800, 2403752400, 2405228000, 2406703600, 2408179200,
  2409654800, 2411130400, 2412606000, 2414081600, 2415557200, 2417032800, 2418508400, 2419984000,
  2421459600, 2422935200, 2424410800, 2425886400, 2427362000, 2428837600, 2430313200, 2431788800,
  2433264400, 2434740000, 2436215600, 2437691200, 2439166800, 2440642400, 2442118000, 2443593600,
  2445069200, 2446544800, 2448020400, 2449496000, 2450971600, 2452447200, 2453922800, 2455398400,
  2456874000, 2458349600, 2459825200, 2461300800, 2462776400, 2464252000, 2465727600, 2467203200,
  2468678800, 2470154400, 2471630000, 2473105600, 2474581200, 2476056800, 2477532400, 2479008000,
  2480483600, 2481959200, 2483434800, 2484910400, 2486386000, 2487861600, 2489337200, 2490812800,
  2492288400, 2493764000, 2495239600, 2496715200, 2498190800, 2499666400, 2501142000, 2502617600,
  2504093200, 2505568800, 2507044400, 2508520000, 2509995600, 2511471200, 2512946800, 2514422400,
  2515898000, 2517373600, 2518849200, 2520324800, 2521800400, 2523276000, 2524751600, 2526227200,
  2527702800, 2529178400, 2530654000, 2532129600, 2533605200, 2535080800, 2536556400, 2538032000,
  2539507600, 2540983200, 2542458800, 2543934400, 2545410000, 2546885600, 2548361200, 2549836800,
  2551312400, 2552788000, 2554263600, 2555739200, 2557214800, 2558690400, 2560166000, 2561641600,
  2563117200, 2564592800, 2566068400, 2567544000, 2569019600, 2570495200, 2571970800, 2573446400,
  2574922000, 2576397600, 2577873200, 2579348800, 2580824400, 2582300000, 2583775600, 2585251200,
  2586726800, 2588202400, 2589678000, 2591153600, 2592629200, 2594104800, 2595580400, 2597056000,
  2598531600, 2600007200, 2601482800, 2602958400, 2604434000, 2605909600, 2607385200, 2608860800,
  2610336400, 2611812000, 2613287600, 2614763200, 2616238800, 2617714400, 2619190000, 2620665600,
  2622141200, 2623616800, 2625092400, 2626568000, 2628043600, 2629519200, 2630994800, 2632470400,
  2633946000, 2635421600, 2636897200, 2638372800, 2639848400, 2641324000, 2642799600, 2644275200,
  2645750800, 2647226400, 2648702000, 2650177600, 2651653200, 2653128800, 2654604400, 2656080000,
  2657555600, 2659031200, 2660506800, 2661982400, 2663458000, 2664933600, 2666409200, 2667884800,
  2669360400, 2670836000, 2672311600, 2673787200, 2675262800, 2676738400, 2678214000, 2679689600,
  2681165200, 2682640800, 2684116400, 2685592000, 2687067600, 2688543200, 2690018800, 2691494400,
  2692970000, 2694445600, 2695921200, 2697396800, 2698872400, 2700348000, 2701823600, 2703299200,
  2704774800, 2706250400, 2707726000, 2709201600, 2710677200, 2712152800, 2713628400, 2715104000,
  2716579600, 2718055200, 2719530800, 2721006400, 2722482000, 2723957600, 2725433200, 2726908800,
  2728384400, 2729860000, 2731335600, 2732811200, 2734286800, 2735762400, 2737238000, 2738713600,
  2740189200, 2741664800, 2743140400, 2744616000, 2746091600, 2747567200, 2749042800, 2750518400,
  2751994000, 2753469600, 2754945200, 2756420800, 2757896400, 2759372000, 2760847600, 2762323200,
  2763798800, 2765274400, 2766750000, 2768225600, 2769701200, 2771176800, 2772652400, 2774128000,
  2775603600, 2777079200, 2778554800, 2780030400, 2781506000, 2782981600, 2784457200, 2785932800,
  2787408400, 2788884000, 2790359600, 2791835200, 2793310800, 2794786400, 2796262000, 2797737600,
  2799213200, 2800688800, 2802164400, 2803640000, 2805115600, 2806591200, 2808066800, 2809542400,
  2811018000, 2812493600, 2813969200, 2815444800, 2816920400, 2818396000, 2819871600, 2821347200,
  2822822800, 2824298400, 2825774000, 2827249600, 2828725200, 2830200800, 2831676400, 2833152000,
  2834627600, 2836103200, 2837578800, 2839054400, 2840530000, 2842005600, 2843481200, 2844956800,
  2846432400, 2847908000, 2849383600, 2850859200, 2852334800, 2853810400, 2855286000, 2856761600,
  2858237200, 2859712800, 2861188400, 2862664000, 2864139600, 2865615200, 2867090800, 2868566400,
  2870042000, 2871517600, 2872993200, 2874468800, 2875944400, 2877420000, 2878895600, 2880371200,
  2881846800, 2883322400, 2884798000, 2886273600, 2887749200, 2889224800, 2890700400, 2892176000,
  2893651600, 2895127200, 2896602800, 2898078400, 2899554000, 2901029600, 2902505200, 2903980800,
  2905456400, 2906932000, 2908407600, 2909883200, 2911358800, 2912834400, 2914310000, 2915785600,
  2917261200, 2918736800, 2920212400, 2921688000, 2923163600, 2924639200, 2926114800, 2927590400,
  2929066000, 2930541600, 2932017200, 2933492800, 2934968400, 2936444000, 2937919600, 2939395200,
  2940870800, 2942346400, 2943822000, 2945297600, 2946773200, 2948248800, 2949724400, 2951200000,
  2952675600, 2954151200, 2955626800, 2957102400, 2958578000, 2960053600, 2961529200, 2963004800,
  2964480400, 2965956000, 2967431600, 2968907200, 2970382800, 2971858400, 2973334000, 2974809600,
  2976285200, 2977760800, 2979236400, 2980712000, 2982187600, 2983663200, 2985138800, 2986614400,
  2988090000, 2989565600, 2991041200, 2992516800, 2993992400, 2995468000, 2996943600, 2998419200,
  2999894800, 3001370400, 3002846000, 3004321600, 3005797200, 3007272800, 3008748400, 3010224000,
  3011699600, 3013175200, 3014650800, 3016126400, 3017602000, 3019077600, 3020553200, 3022028800,
  3023504400, 3024980000, 3026455600, 3027931200, 3029406800, 3030882400, 3032358000, 3033833600,
  3035309200, 3036784800, 3038260400, 3039736000, 3041211600, 3042687200, 3044162800, 3045638400,
  3047114000, 3048589600, 3050065200, 3051540800, 3053016400, 3054492000, 3055967600, 3057443200,
  3058918800, 3060394400, 3061870000, 3063345600, 3064821200, 3066296800, 3067772400, 3069248000,
  3070723600, 3072199200, 3073674800, 3075150400, 3076626000, 3078101600, 3079577200, 3081052800,
  3082528400, 3084004000, 3085479600, 3086955200, 3088430800, 3089906400, 3091382000, 3092857600,
  3094333200, 3095808800, 3097284400, 3098760000, 3100235600, 3101711200, 3103186800, 3104662400,
  3106138000, 3107613600, 3109089200, 3110564800, 3112040400, 3113516000, 3114991600, 3116467200,
  3117942800, 3119418400, 3120894000, 3122369600, 3123845200, 3125320800, 3126796400, 3128272000,
  3129747600, 3131223200, 3132698800, 3134174400, 3135650000, 3137125600, 3138601200, 3140076800,
  3141552400, 3143028000, 3144503600, 3145979200, 3147454800, 3148930400, 3150406000, 3151881600,
  3153357200, 3154832800, 3156308400, 3157784000, 3159259600, 3160735200, 3162210800, 3163686400,
  3165162000, 3166637600, 3168113200, 3169588800, 3171064400, 3172540000, 3174015600, 3175491200,
  3176966800, 3178442400, 3179918000, 3181393600, 3182869200, 3184344800, 3185820400, 3187296000,
  3188771600, 3190247200, 3191722800, 3193198400, 3194674000, 3196149600, 3197625200, 3199100800,
  3200576400, 3202052000, 3203527600, 3205003200, 3206478800, 3207954400, 3209430000, 3210905600,
  3212381200, 3213856800, 3215332400, 3216808000, 3218283600, 3219759200, 3221234800, 3222710400,
  3224186000, 3225661600, 3227137200, 3228612800, 3230088400, 3231564000, 3233039600, 3234515200,
  3235990800, 3237466400, 3238942000, 3240417600, 3241893200, 3243368800, 3244844400, 3246320000,
  3247795600, 3249271200, 3250746800, 3252222400, 3253698000, 3255173600, 3256649200, 3258124800,
  3259600400, 3261076000, 3262551600, 3264027200, 3265502800, 3266978400, 3268454000, 3269929600,
  3271405200, 3272880800, 3274356400, 3275832000, 3277307600, 3278783200, 3280258800, 3281734400,
  3283210000, 3284685600, 3286161200, 3287636800, 3289112400, 3290588000, 3292063600, 3293539200,
  3295014800, 3296490400, 3297966000, 3299441600, 3300917200, 3302392800, 3303868400, 3305344000,
  3306819600, 3308295200, 3309770800, 3311246400, 3312722000, 3314197600, 3315673200, 3317148800,
  3318624400, 3320100000, 3321575600, 3323051200, 3324526800, 3326002400, 3327478000, 3328953600,
  3330429200, 3331904800, 3333380400, 3334856000, 3336331600, 3337807200, 3339282800, 3340758400,
  3342234000, 3343709600, 3345185200, 3346660800, 3348136400, 3349612000, 3351087600, 3352563200,
  3354038800, 3355514400, 3356990000, 3358465600, 3359941200, 3361416800, 3362892400, 3364368000,
  3365843600, 3367319200, 3368794800, 3370270400, 3371746000, 3373221600, 3374697200, 3376172800,
  3377648400, 3379124000, 3380599600, 3382075200, 3383550800, 3385026400, 3386502000, 3387977600,
  3389453200, 3390928800, 3392404400, 3393880000, 3395355600, 3396831200, 3398306800, 3399782400,
  3401258000, 3402733600, 3404209200, 3405684800, 3407160400, 3408636000, 3410111600, 3411587200,
  3413062800, 3414538400, 3416014000, 3417489600, 3418965200, 3420440800, 3421916400, 3423392000,
  3424867600, 3426343200, 3427818800, 3429294400, 3430770000, 3432245600, 3433721200, 3435196800,
  3436672400, 3438148000, 3439623600, 3441099200, 3442574800, 3444050400, 3445526000, 3447001600,
  3448477200, 3449952800, 3451428400, 3452904000, 3454379600, 3455855200, 3457330800, 3458806400,
  3460282000, 3461757600, 3463233200, 3464708800, 3466184400, 3467660000, 3469135600, 3470611200,
  3472086800, 3473562400, 3475038000, 3476513600, 3477989200, 3479464800, 3480940400, 3482416000,
  3483891600, 3485367200, 3486842800, 3488318400, 3489794000, 3491269600, 3492745200, 3494220800,
  3495696400, 3497172000, 3498647600, 3500123200, 3501598800, 3503074400, 3504550000, 3506025600,
  3507501200, 3508976800, 3510452400, 3511928000, 3513403600, 3514879200, 3516354800, 3517830400,
  3519306000, 3520781600, 3522257200, 3523732800, 3525208400, 3526684000, 3528159600, 3529635200,
  3531110800, 3532586400, 3534062000, 3535537600, 3537013200, 3538488800, 3539964400, 3541440000,
  3542915600, 3544391200, 3545866800, 3547342400, 3548818000, 3550293600, 3551769200, 3553244800,
  3554720400, 3556196000, 3557671600, 3559147200, 3560622800, 3562098400, 3563574000, 3565049600,
  3566525200, 3568000800, 3569476400, 3570952000, 3572427600, 3573903200, 3575378800, 3576854400,
  3578330000, 3579805600, 3581281200, 3582756800, 3584232400, 3585708000, 3587183600, 3588659200,
  3590134800, 3591610400, 3593086000, 3594561600, 3596037200, 3597512800, 3598988400, 3600464000,
  3601939600, 3603415200, 3604890800, 3606366400, 3607842000, 3609317600, 3610793200, 3612268800,
  3613744400, 3615220000, 3616695600, 3618171200, 3619646800, 3621122400, 3622598000, 3624073600,
  3625549200, 3627024800, 3628500400, 3629976000, 3631451600, 3632927200, 3634402800, 3635878400,
  3637354000, 3638829600, 3640305200, 3641780800, 3643256400, 3644732000, 3646207600, 3647683200,
  3649158800, 3650634400, 3652110000, 3653585600, 3655061200, 3656536800, 3658012400, 3659488000,
  3660963600, 3662439200, 3663914800, 3665390400, 3666866000, 3668341600, 3669817200, 3671292800,
  3672768400, 3674244000, 3675719600, 3677195200, 3678670800, 3680146400, 3681622000, 3683097600,
  3684573200, 3686048800, 3687524400, 3689000000, 3690475600, 3691951200, 3693426800, 3694902400,
  3696378000, 3697853600, 3699329200, 3700804800, 3702280400, 3703756000, 3705231600, 3706707200,
  3708182800, 3709658400, 3711134000, 3712609600, 3714085200, 3715560800, 3717036400, 3718512000,
  3719987600, 3721463200, 3722938800, 3724414400, 3725890000, 3727365600, 3728841200, 3730316800,
  3731792400, 3733268000, 3734743600, 3736219200, 3737694800, 3739170400, 3740646000, 3742121600,
  3743597200, 3745072800, 3746548400, 3748024000, 3749499600, 3750975200, 3752450800, 3753926400,
  3755402000, 3756877600, 3758353200, 3759828800, 3761304400, 3762780000, 3764255600, 3765731200,
  3767206800, 3768682400, 3770158000, 3771633600, 3773109200, 3774584800, 3776060400, 3777536000,
  3779011600, 3780487200, 3781962800, 3783438400, 3784914000, 3786389600, 3787865200, 3789340800,
  3790816400, 3792292000, 3793767600, 3795243200, 3796718800, 3798194400, 3799670000, 3801145600,
  3802621200, 3804096800, 3805572400, 3807048000, 3808523600, 3809999200, 3811474800, 3812950400,
  3814426000, 3815901600, 3817377200, 3818852800, 3820328400, 3821804000, 3823279600, 3824755200,
  3826230800, 3827706400, 3829182000, 3830657600, 3832133200, 3833608800, 3835084400, 3836560000,
  3838035600, 3839511200, 3840986800, 3842462400, 3843938000, 3845413600, 3846889200, 3848364800,
  3849840400, 3851316000, 3852791600, 3854267200, 3855742800, 3857218400, 3858694000, 3860169600,
  3861645200, 3863120800, 3864596400, 3866072000, 3867547600, 3869023200, 3870498800, 3871974400,
  3873450000, 3874925600, 3876401200, 3877876800, 3879352400, 3880828000, 3882303600, 3883779200,
  3885254800, 3886730400, 3888206000, 3889681600, 3891157200, 3892632800, 3894108400, 3895584000,
  3897059600, 3898535200, 3900010800, 3901486400, 3902962000, 3904437600, 3905913200, 3907388800,
  3908864400, 3910340000, 3911815600, 3913291200, 3914766800, 3916242400, 3917718000, 3919193600,
  3920669200, 3922144800, 3923620400, 3925096000, 3926571600, 3928047200, 3929522800, 3930998400,
  3932474000, 3933949600, 3935425200, 3936900800, 3938376400, 3939852000, 3941327600, 3942803200,
  3944278800, 3945754400, 3947230000, 3948705600, 3950181200, 3951656800, 3953132400, 3954608000,
  3956083600, 3957559200, 3959034800, 3960510400, 3961986000, 3963461600, 3964937200, 3966412800,
  3967888400, 3969364000, 3970839600, 3972315200, 3973790800, 3975266400, 3976742000, 3978217600,
  3979693200, 3981168800, 3982644400, 3984120000, 3985595600, 3987071200, 3988546800, 3990022400,
  3991498000, 3992973600, 3994449200, 3995924800, 3997400400, 3998876000, 4000351600, 4001827200,
  4003302800, 4004778400, 4006254000, 4007729600, 4009205200, 4010680800, 4012156400, 4013632000,
  4015107600, 4016583200, 4018058800, 4019534400, 4021010000, 4022485600, 4023961200, 4025436800,
  4026912400, 4028388000, 4029863600, 4031339200, 4032814800, 4034290400, 4035766000, 4037241600,
  4038717200, 4040192800, 4041668400, 4043144000, 4044619600, 4046095200, 4047570800, 4049046400,
  4050522000, 4051997600, 4053473200, 4054948800, 4056424400, 4057900000, 4059375600, 4060851200,
  4062326800, 4063802400, 4065278000, 4066753600, 4068229200, 4069704800, 4071180400, 4072656000,
  4074131600, 4075607200, 4077082800, 4078558400, 4080034000, 4081509600, 4082985200, 4084460800,
  4085936400, 4087412000, 4088887600, 4090363200, 4091838800, 4093314400, 4094790000, 4096265600,
  4097741200, 4099216800, 4100692400, 4102168000, 4103643600, 4105119200, 4106594800, 4108070400,
  4109546000, 4111021600, 4112497200, 4113972800, 4115448400, 4116924000, 4118399600, 4119875200,
  4121350800, 4122826400, 4124302000, 4125777600, 4127253200, 4128728800, 4130204400, 4131680000,
  4133155600, 4134631200, 4136106800, 4137582400, 4139058000, 4140533600, 4142009200, 4143484800,
  4144960400, 4146436000, 4147911600, 4149387200, 4150862800, 4152338400, 4153814000, 4155289600,
  4156765200, 4158240800, 4159716400, 4161192000, 4162667600, 4164143200, 4165618800, 4167094400,
  4168570000, 4170045600, 4171521200, 4172996800, 4174472400, 4175948000, 4177423600, 4178899200,
  4180374800, 4181850400, 4183326000, 4184801600, 4186277200, 4187752800, 4189228400, 4190704000,
  4192179600, 4193655200, 4195130800, 4196606400, 4198082000, 4199557600, 4201033200, 4202508800,
  4203984400, 4205460000, 4206935600, 4208411200, 4209886800, 4211362400, 4212838000, 4214313600,
  4215789200, 4217264800, 4218740400, 4220216000, 4221691600, 4223167200, 4224642800, 4226118400,
  4227594000, 4229069600, 4230545200, 4232020800, 4233496400, 4234972000, 4236447600, 4237923200,
  4239398800, 4240874400, 4242350000, 4243825600, 4245301200, 4246776800, 4248252400, 4249728000,
  4251203600, 4252679200, 4254154800, 4255630400, 4257106000, 4258581600, 4260057200, 4261532800,
  4263008400, 4264484000, 4265959600, 4267435200, 4268910800, 4270386400, 4271862000, 4273337600,
  4274813200, 4276288800, 4277764400, 4279240000, 4280715600, 4282191200, 4283666800, 4285142400,
  4286618000, 4288093600, 4289569200, 4291044800, 4292520400, 4293996000, 4295471600, 4296947200,
  4298422800, 4299898400, 4301374000, 4302849600, 4304325200, 4305800800, 4307276400, 4308752000,
  4310227600, 4311703200, 4313178800, 4314654400, 4316130000, 4317605600, 4319081200, 4320556800,
  4322032400, 4323508000, 4324983600, 4326459200, 4327934800, 4329410400, 4330886000, 4332361600,
  4333837200, 4335312800, 4336788400, 4338264000, 4339739600, 4341215200, 4342690800, 4344166400,
  4345642000, 4347117600, 4348593200, 4350068800, 4351544400, 4353020000, 4354495600, 4355971200,
  4357446800, 4358922400, 4360398000, 4361873600, 4363349200, 4364824800, 4366300400, 4367776000,
  4369251600, 4370727200, 4372202800, 4373678400, 4375154000, 4376629600, 4378105200, 4379580800,
  4381056400, 4382532000, 4384007600, 4385483200, 4386958800, 4388434400, 4389910000, 4391385600,
  4392861200, 4394336800, 4395812400, 4397288000, 4398763600, 4400239200, 4401714800, 4403190400,
  4404666000, 4406141600, 4407617200, 4409092800, 4410568400, 4412044000, 4413519600, 4414995200,
  4416470800, 4417946400, 4419422000, 4420897600, 4422373200, 4423848800, 4425324400, 4426800000,
  4428275600, 4429751200, 4431226800, 4432702400, 4434178000, 4435653600, 4437129200, 4438604800,
  4440080400, 4441556000, 4443031600, 4444507200, 4445982800, 4447458400, 4448934000, 4450409600,
  4451885200, 4453360800, 4454836400, 4456312000, 4457787600, 4459263200, 4460738800, 4462214400,
  4463690000, 4465165600, 4466641200, 4468116800, 4469592400, 4471068000, 4472543600, 4474019200,
  4475494800, 4476970400, 4478446000, 4479921600, 4481397200, 4482872800, 4484348400, 4485824000,
  4487299600, 4488775200, 4490250800, 4491726400, 4493202000, 4494677600, 4496153200, 4497628800,
  4499104400, 4500580000, 4502055600, 4503531200, 4505006800, 4506482400, 4507958000, 4509433600,
  4510909200, 4512384800, 4513860400, 4515336000, 4516811600, 4518287200, 4519762800, 4521238400,
  4522714000, 4524189600, 4525665200, 4527140800, 4528616400, 4530092000, 4531567600, 4533043200,
  4534518800, 4535994400, 4537470000, 4538945600, 4540421200, 4541896800, 4543372400, 4544848000,
  4546323600, 4547799200, 4549274800, 4550750400, 4552226000, 4553701600, 4555177200, 4556652800,
  4558128400, 4559604000, 4561079600, 4562555200, 4564030800, 4565506400, 4566982000, 4568457600,
  4569933200, 4571408800, 4572884400, 4574360000, 4575835600, 4577311200, 4578786800, 4580262400,
  4581738000, 4583213600, 4584689200, 4586164800, 4587640400, 4589116000, 4590591600, 4592067200,
  4593542800, 4595018400, 4596494000, 4597969600, 4599445200, 4600920800, 4602396400, 4603872000,
  4605347600, 4606823200, 4608298800, 4609774400, 4611250000, 4612725600, 4614201200, 4615676800,
  4617152400, 4618628000, 4620103600, 4621579200, 4623054800, 4624530400, 4626006000, 4627481600,
  4628957200, 4630432800, 4631908400, 4633384000, 4634859600, 4636335200, 4637810800, 4639286400,
  4640762000, 4642237600, 4643713200, 4645188800, 4646664400, 4648140000, 4649615600, 4651091200,
  4652566800, 4654042400, 4655518000, 4656993600, 4658469200, 4659944800, 4661420400, 4662896000,
  4664371600, 4665847200, 4667322800, 4668798400, 4670274000, 4671749600, 4673225200, 4674700800,
  4676176400, 4677652000, 4679127600, 4680603200, 4682078800, 4683554400, 4685030000, 4686505600,
  4687981200, 4689456800, 4690932400, 4692408000, 4693883600, 4695359200, 4696834800, 4698310400,
  4699786000, 4701261600, 4702737200, 4704212800, 4705688400, 4707164000, 4708639600, 4710115200,
  4711590800, 4713066400, 4714542000, 4716017600, 4717493200, 4718968800, 4720444400, 4721920000,
  4723395600, 4724871200, 4726346800, 4727822400, 4729298000, 4730773600, 4732249200, 4733724800,
  4735200400, 4736676000, 4738151600, 4739627200, 4741102800, 4742578400, 4744054000, 4745529600,
  4747005200, 4748480800, 4749956400, 4751432000, 4752907600, 4754383200, 4755858800, 4757334400,
  4758810000, 4760285600, 4761761200, 4763236800, 4764712400, 4766188000, 4767663600, 4769139200,
  4770614800, 4772090400, 4773566000, 4775041600, 4776517200, 4777992800, 4779468400, 4780944000,
  4782419600, 4783895200, 4785370800, 4786846400, 4788322000, 4789797600, 4791273200, 4792748800,
  4794224400, 4795700000, 4797175600, 4798651200, 4800126800, 4801602400, 4803078000, 4804553600,
  4806029200, 4807504800, 4808980400, 4810456000, 4811931600, 4813407200, 4814882800, 4816358400,
  4817834000, 4819309600, 4820785200, 4822260800, 4823736400, 4825212000, 4826687600, 4828163200,
  4829638800, 4831114400, 4832590000, 4834065600, 4835541200, 4837016800, 4838492400, 4839968000,
  4841443600, 4842919200, 4844394800, 4845870400, 4847346000, 4848821600, 4850297200, 4851772800,
  4853248400, 4854724000, 4856199600, 4857675200, 4859150800, 4860626400, 4862102000, 4863577600,
  4865053200, 4866528800, 4868004400, 4869480000, 4870955600, 4872431200, 4873906800, 4875382400,
  4876858000, 4878333600, 4879809200, 4881284800, 4882760400, 4884236000, 4885711600, 4887187200,
  4888662800, 4890138400, 4891614000, 4893089600, 4894565200, 4896040800, 4897516400, 4898992000,
  4900467600, 4901943200, 4903418800, 4904894400, 4906370000, 4907845600, 4909321200, 4910796800,
  4912272400, 4913748000, 4915223600, 4916699200, 4918174800, 4919650400, 4921126000, 4922601600,
  4924077200, 4925552800, 4927028400, 4928504000, 4929979600, 4931455200, 4932930800, 4934406400,
  4935882000, 4937357600, 4938833200, 4940308800, 4941784400, 4943260000, 4944735600, 4946211200,
  4947686800, 4949162400, 4950638000, 4952113600, 4953589200, 4955064800, 4956540400, 4958016000,
  4959491600, 4960967200, 4962442800, 4963918400, 4965394000, 4966869600, 4968345200, 4969820800,
  4971296400, 4972772000, 4974247600, 4975723200, 4977198800, 4978674400, 4980150000, 4981625600,
  4983101200, 4984576800, 4986052400, 4987528000, 4989003600, 4990479200, 4991954800, 4993430400,
  4994906000, 4996381600, 4997857200, 4999332800, 5000808400, 5002284000, 5003759600, 5005235200,
  5006710800, 5008186400, 5009662000, 5011137600, 5012613200, 5014088800, 5015564400, 5017040000,
  5018515600, 5019991200, 5021466800, 5022942400, 5024418000, 5025893600, 5027369200, 5028844800,
  5030320400, 5031796000, 5033271600, 5034747200, 5036222800, 5037698400, 5039174000, 5040649600,
  5042125200, 5043600800, 5045076400, 5046552000, 5048027600, 5049503200, 5050978800, 5052454400,
  5053930000, 5055405600, 5056881200, 5058356800, 5059832400, 5061308000, 5062783600, 5064259200,
  5065734800, 5067210400, 5068686000, 5070161600, 5071637200, 5073112800, 5074588400, 5076064000,
  5077539600, 5079015200, 5080490800, 5081966400, 5083442000, 5084917600, 5086393200, 5087868800,
  5089344400, 5090820000, 5092295600, 5093771200, 5095246800, 5096722400, 5098198000, 5099673600,
  5101149200, 5102624800, 5104100400, 5105576000, 5107051600, 5108527200, 5110002800, 5111478400,
  5112954000, 5114429600, 5115905200, 5117380800, 5118856400, 5120332000, 5121807600, 5123283200,
  5124758800, 5126234400, 5127710000, 5129185600, 5130661200, 5132136800, 5133612400, 5135088000,
  5136563600, 5138039200, 5139514800, 5140990400, 5142466000, 5143941600, 5145417200, 5146892800,
  5148368400, 5149844000, 5151319600, 5152795200, 5154270800, 5155746400, 5157222000, 5158697600,
  5160173200, 5161648800, 5163124400, 5164600000, 5166075600, 5167551200, 5169026800, 5170502400,
  5171978000, 5173453600, 5174929200, 5176404800, 5177880400, 5179356000, 5180831600, 5182307200,
  5183782800, 5185258400, 5186734000, 5188209600, 5189685200, 5191160800, 5192636400, 5194112000,
  5195587600, 5197063200, 5198538800, 5200014400, 5201490000, 5202965600, 5204441200, 5205916800,
  5207392400, 5208868000, 5210343600, 5211819200, 5213294800, 5214770400, 5216246000, 5217721600,
  5219197200, 5220672800, 5222148400, 5223624000, 5225099600, 5226575200, 5228050800, 5229526400,
  5231002000, 5232477600, 5233953200, 5235428800, 5236904400, 5238380000, 5239855600, 5241331200,
  5242806800, 5244282400, 5245758000, 5247233600, 5248709200, 5250184800, 5251660400, 5253136000,
  5254611600, 5256087200, 5257562800, 5259038400, 5260514000, 5261989600, 5263465200, 5264940800,
  5266416400, 5267892000, 5269367600, 5270843200, 5272318800, 5273794400, 5275270000, 5276745600,
  5278221200, 5279696800, 5281172400, 5282648000, 5284123600, 5285599200, 5287074800, 5288550400,
  5290026000, 5291501600, 5292977200, 5294452800, 5295928400, 5297404000, 5298879600, 5300355200,
  5301830800, 5303306400, 5304782000, 5306257600, 5307733200, 5309208800, 5310684400, 5312160000,
  5313635600, 5315111200, 5316586800, 5318062400, 5319538000, 5321013600, 5322489200, 5323964800,
  5325440400, 5326916000, 5328391600, 5329867200, 5331342800, 5332818400, 5334294000, 5335769600,
  5337245200, 5338720800, 5340196400, 5341672000, 5343147600, 5344623200, 5346098800, 5347574400,
  5349050000, 5350525600, 5352001200, 5353476800, 5354952400, 5356428000, 5357903600, 5359379200,
  5360854800, 5362330400, 5363806000, 5365281600, 5366757200, 5368232800, 5369708400, 5371184000,
  5372659600, 5374135200, 5375610800, 5377086400, 5378562000, 5380037600, 5381513200, 5382988800,
  5384464400, 5385940000, 5387415600, 5388891200, 5390366800, 5391842400, 5393318000, 5394793600,
  5396269200, 5397744800, 5399220400, 5400696000, 5402171600, 5403647200, 5405122800, 5406598400,
  5408074000, 5409549600, 5411025200, 5412500800, 5413976400, 5415452000, 5416927600, 5418403200,
  5419878800, 5421354400, 5422830000, 5424305600, 5425781200, 5427256800, 5428732400, 5430208000,
  5431683600, 5433159200, 5434634800, 5436110400, 5437586000, 5439061600, 5440537200, 5442012800,
  5443488400, 5444964000, 5446439600, 5447915200, 5449390800, 5450866400, 5452342000, 5453817600,
  5455293200, 5456768800, 5458244400, 5459720000, 5461195600, 5462671200, 5464146800, 5465622400,
  5467098000, 5468573600, 5470049200, 5471524800, 5473000400, 5474476000, 5475951600, 5477427200,
  5478902800, 5480378400, 5481854000, 5483329600, 5484805200, 5486280800, 5487756400, 5489232000,
  5490707600, 5492183200, 5493658800, 5495134400, 5496610000, 5498085600, 5499561200, 5501036800,
  5502512400, 5503988000, 5505463600, 5506939200, 5508414800, 5509890400, 5511366000, 5512841600,
  5514317200, 5515792800, 5517268400, 5518744000, 5520219600, 5521695200, 5523170800, 5524646400,
  5526122000, 5527597600, 5529073200, 5530548800, 5532024400, 5533500000, 5534975600, 5536451200,
  5537926800, 5539402400, 5540878000, 5542353600, 5543829200, 5545304800, 5546780400, 5548256000,
  5549731600, 5551207200, 5552682800, 5554158400, 5555634000, 5557109600, 5558585200, 5560060800,
  5561536400, 5563012000, 5564487600, 5565963200, 5567438800, 5568914400, 5570390000, 5571865600,
  5573341200, 5574816800, 5576292400, 5577768000, 5579243600, 5580719200, 5582194800, 5583670400,
  5585146000, 5586621600, 5588097200, 5589572800, 5591048400, 5592524000, 5593999600, 5595475200,
  5596950800, 5598426400, 5599902000, 5601377600, 5602853200, 5604328800, 5605804400, 5607280000,
  5608755600, 5610231200, 5611706800, 5613182400, 5614658000, 5616133600, 5617609200, 5619084800,
  5620560400, 5622036000, 5623511600, 5624987200, 5626462800, 5627938400, 5629414000, 5630889600,
  5632365200, 5633840800, 5635316400, 5636792000, 5638267600, 5639743200, 5641218800, 5642694400,
  5644170000, 5645645600, 5647121200, 5648596800, 5650072400, 5651548000, 5653023600, 5654499200,
  5655974800, 5657450400, 5658926000, 5660401600, 5661877200, 5663352800, 5664828400, 5666304000,
  5667779600, 5669255200, 5670730800, 5672206400, 5673682000, 5675157600, 5676633200, 5678108800,
  5679584400, 5681060000, 5682535600, 5684011200, 5685486800, 5686962400, 5688438000, 5689913600,
  5691389200, 5692864800, 5694340400, 5695816000, 5697291600, 5698767200, 5700242800, 5701718400,
  5703194000, 5704669600, 5706145200, 5707620800, 5709096400, 5710572000, 5712047600, 5713523200,
  5714998800, 5716474400, 5717950000, 5719425600, 5720901200, 5722376800, 5723852400, 5725328000,
  5726803600, 5728279200, 5729754800, 5731230400, 5732706000, 5734181600, 5735657200, 5737132800,
  5738608400, 5740084000, 5741559600, 5743035200, 5744510800, 5745986400, 5747462000, 5748937600,
  5750413200, 5751888800, 5753364400, 5754840000, 5756315600, 5757791200, 5759266800, 5760742400,
  5762218000, 5763693600, 5765169200, 5766644800, 5768120400, 5769596000, 5771071600, 5772547200,
  5774022800, 5775498400, 5776974000, 5778449600, 5779925200, 5781400800, 5782876400, 5784352000,
  5785827600, 5787303200, 5788778800, 5790254400, 5791730000, 5793205600, 5794681200, 5796156800,
  5797632400, 5799108000, 5800583600, 5802059200, 5803534800, 5805010400, 5806486000, 5807961600,
  5809437200, 5810912800, 5812388400, 5813864000, 5815339600, 5816815200, 5818290800, 5819766400,
  5821242000, 5822717600, 5824193200, 5825668800, 5827144400, 5828620000, 5830095600, 5831571200,
  5833046800, 5834522400, 5835998000, 5837473600, 5838949200, 5840424800, 5841900400, 5843376000,
  5844851600, 5846327200, 5847802800, 5849278400, 5850754000, 5852229600, 5853705200, 5855180800,
  5856656400, 5858132000, 5859607600, 5861083200, 5862558800, 5864034400, 5865510000, 5866985600,
  5868461200, 5869936800, 5871412400, 5872888000, 5874363600, 5875839200, 5877314800, 5878790400,
  5880266000, 5881741600, 5883217200, 5884692800, 5886168400, 5887644000, 5889119600, 5890595200,
  5892070800, 5893546400, 5895022000, 5896497600, 5897973200, 5899448800, 5900924400, 5902400000
]

// ─── ESTADO REACTIVO ─────────────────────────────────────────────────────────
const generacionPlanta     = ref(null)
const consumoCliente       = ref(null)
const hbs                  = ref(3.8)
const itemsAdicionales     = ref([])
const nuevoAdicionalNombre = ref('')
const nuevoAdicionalPrecio = ref(null)
const adicionales          = ref(0)
const descuento            = ref(0)
const resultados           = ref(null)
const porcentajeCobertura  = ref(null)
const isSharedLink         = ref(false)
const mostrarAvanzados     = ref(false)
const tarifaKwh            = ref(null)
const contribucion         = ref(null)
const aluPublico           = ref(null)
const autoconsumo          = ref(null)

// ─── ESTADO EDICIÓN DE ADICIONALES ──────────────────────────────────────────
const editandoIndex  = ref(null)
const editandoNombre = ref('')
const editandoPrecio = ref(null)

// ─── COMPUTED: arco SVG ──────────────────────────────────────────────────────
const arcoPorcentaje = computed(() => {
  if (porcentajeCobertura.value === null) return ''
  const porcentaje   = Math.min(porcentajeCobertura.value, 100)
  const angulo       = (porcentaje / 100) * 360
  const radianes     = (angulo - 90) * (Math.PI / 180)
  const x            = 100 + 80 * Math.cos(radianes)
  const y            = 100 + 80 * Math.sin(radianes)
  const largeArcFlag = angulo > 180 ? 1 : 0
  return `M100,20 A80,80 0 ${largeArcFlag},1 ${x},${y}`
})

// ─── LÓGICA PRINCIPAL ────────────────────────────────────────────────────────
const calcularGeneracion = (n, hbsVal) =>
  Math.round(POTENCIA_PANEL_KWP * n * 30 * hbsVal * 100) / 100

const buscarNPaneles = (consumo, hbsVal) => {
  let mejorN = 1, menorDif = Infinity
  for (let n = 1; n <= MAX_PANELES; n++) {
    const gen = calcularGeneracion(n, hbsVal)
    const dif = Math.abs(gen - consumo)
    if (dif < menorDif) { menorDif = dif; mejorN = n }
  }
  return mejorN
}

// ─── ACTUALIZACIÓN INSTANTÁNEA ───────────────────────────────────────────────
const actualizarInstantaneo = () => {
  const hbsVal = hbs.value && hbs.value > 0 ? hbs.value : 3.8

  if (generacionPlanta.value) {
    const n = buscarNPaneles(generacionPlanta.value, hbsVal)

    const potencia   = Math.round(n * POTENCIA_PANEL_KWP * 100) / 100
    const generacion = calcularGeneracion(n, hbsVal)
    const area       = n * 3 + 4
    const peso       = n * 31
    const valorBase  = preciosExcel[n - 1] || 0

    const valorAdicionales         = adicionales.value || 0
    const valorTotalConAdicionales = valorBase + valorAdicionales
    const precioPorKwp = potencia > 0 ? Math.round(valorTotalConAdicionales / potencia) : 0

    const desc = descuento.value || 0
    const valorConDescuento = Math.round(valorTotalConAdicionales * (1 - desc / 100))

    let pagoMensual = 0, pagoAnual = 0
    const consumo = consumoCliente.value || 0
    const tarifa  = tarifaKwh.value      || 0
    const contrib = contribucion.value   || 0
    const alu     = aluPublico.value     || 0
    if (consumo > 0 && tarifa > 0) {
      const L3 = consumo * tarifa
      const L4 = L3 * (contrib / 100)
      const L5 = L3 * (alu    / 100)
      pagoMensual = Math.round(L3 + L4 + L5)
      pagoAnual   = pagoMensual * 12
    }

    let ahorroMes = 0
    const gen2 = generacionPlanta.value || 0
    const auto = (autoconsumo.value || 0) / 100
    if (gen2 > 0 && tarifa > 0 && auto > 0) {
      const J14 = gen2 * auto * tarifa * (1 + contrib / 100 + alu / 100)
      const K14 = gen2 * (1 - auto) * (tarifa - 200)
      ahorroMes = Math.round(J14 + K14)
    }

    resultados.value = {
      nPaneles  : n,
      potencia,
      generacion: generacionPlanta.value,
      area,
      peso,
      hbs       : hbsVal,
      valorTotal: valorBase,
      valorTotalConAdicionales,
      valorConDescuento,
      precioPorKwp,
      pagoMensual,
      pagoAnual,
      ahorroMes,
      autoconsumo: autoconsumo.value || 0
    }

    if (cotizacionStore.actualizarCostoTotal)   cotizacionStore.actualizarCostoTotal(valorTotalConAdicionales)
    if (cotizacionStore.actualizarConsumo)      cotizacionStore.actualizarConsumo(consumoCliente.value)
    if (cotizacionStore.actualizarGeneracion)   cotizacionStore.actualizarGeneracion(generacionPlanta.value)
    if (cotizacionStore.actualizarAdicionales)  cotizacionStore.actualizarAdicionales(adicionales.value || 0)
    if (cotizacionStore.actualizarAhorroMes)    cotizacionStore.actualizarAhorroMes(ahorroMes)
    if (cotizacionStore.actualizarTarifaKwh)    cotizacionStore.actualizarTarifaKwh(tarifaKwh.value   || 0)
    if (cotizacionStore.actualizarContribucion) cotizacionStore.actualizarContribucion(contribucion.value || 0)
    if (cotizacionStore.actualizarAluPublico)   cotizacionStore.actualizarAluPublico(aluPublico.value  || 0)
    if (cotizacionStore.actualizarAutoconsumo)  cotizacionStore.actualizarAutoconsumo(autoconsumo.value || 0)

    const ahorroParaFlujo = ahorroMes > 0 ? ahorroMes : pagoMensual

    window.dispatchEvent(new CustomEvent('cotizacion-actualizada', {
      detail: {
        costoTotal         : valorTotalConAdicionales,
        valorConDescuento  : valorConDescuento,
        ahorroMes          : ahorroParaFlujo,
        pagoMensual,
        consumo     : consumoCliente.value  || 0,
        generacion  : generacionPlanta.value,
        hbs         : hbsVal,
        adicionales : adicionales.value    || 0,
        itemsAdicionales: itemsAdicionales.value,
        tarifaKwh   : tarifaKwh.value      || 0,
        contribucion: contribucion.value   || 0,
        aluPublico  : aluPublico.value     || 0,
        autoconsumo : autoconsumo.value    || 0,
        descuento   : descuento.value      || 0,
      }
    }))
  } else {
    resultados.value = null
    cotizacionStore.actualizarCostoTotal(0)
  }

  if (generacionPlanta.value && consumoCliente.value) {
    porcentajeCobertura.value = (generacionPlanta.value / consumoCliente.value) * 100
  } else {
    porcentajeCobertura.value = null
  }
}

// ─── ADICIONALES (lista de ítems) ────────────────────────────────────────────
const recalcularAdicionales = () => {
  adicionales.value = itemsAdicionales.value.reduce((s, i) => s + (i.precio || 0), 0)
}

const agregarAdicional = () => {
  const nombre = nuevoAdicionalNombre.value.trim()
  const precio = nuevoAdicionalPrecio.value
  if (!nombre || !precio || precio <= 0) return
  itemsAdicionales.value.push({ nombre, precio })
  nuevoAdicionalNombre.value = ''
  nuevoAdicionalPrecio.value = null
  recalcularAdicionales()
  actualizarInstantaneo()
}

const eliminarAdicional = (index) => {
  if (editandoIndex.value === index) cancelarEdicion()
  itemsAdicionales.value.splice(index, 1)
  recalcularAdicionales()
  actualizarInstantaneo()
}

// ─── EDICIÓN DE ADICIONALES ──────────────────────────────────────────────────
const iniciarEdicion = (index) => {
  editandoIndex.value  = index
  editandoNombre.value = itemsAdicionales.value[index].nombre
  editandoPrecio.value = itemsAdicionales.value[index].precio
}

const guardarEdicion = () => {
  const nombre = editandoNombre.value.trim()
  const precio = editandoPrecio.value
  if (!nombre || !precio || precio <= 0) return
  itemsAdicionales.value[editandoIndex.value] = { nombre, precio }
  editandoIndex.value  = null
  editandoNombre.value = ''
  editandoPrecio.value = null
  recalcularAdicionales()
  actualizarInstantaneo()
}

const cancelarEdicion = () => {
  editandoIndex.value  = null
  editandoNombre.value = ''
  editandoPrecio.value = null
}

// ─── COMPARTIR ───────────────────────────────────────────────────────────────
// Helpers de codificación: btoa seguro para Unicode
const _toB64 = (str) => btoa(unescape(encodeURIComponent(str)))
const _fromB64 = (b64) => decodeURIComponent(escape(atob(b64)))

const _buildData = () => {
  const cotizacionStore = useCotizacionStore()
  const quoteId = Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
  cotizacionStore._quoteId = quoteId

  let images = []
  try {
    const snapshot = JSON.parse(localStorage.getItem('savedTechnicalImages') || '[]')
    images = snapshot.map(img => ({
      data: img.data, thumb: img.thumb, size: img.size, timestamp: img.timestamp
    }))
  } catch (_) { images = [] }

  // costoTotal: usar el mismo valor que ve el administrador (con descuento si aplica)
  const costoTotal = resultados.value
    ? (descuento.value > 0
        ? resultados.value.valorConDescuento
        : resultados.value.valorTotalConAdicionales)
    : 0

  // ahorroMes: usar el mismo fallback que el evento cotizacion-actualizada
  // (si no hay autoconsumo calculado, usar pagoMensual como fallback)
  const ahorroMesReal = resultados.value?.ahorroMes || 0
  const pagoMensualVal = resultados.value?.pagoMensual || 0
  const ahorroMes = ahorroMesReal > 0 ? ahorroMesReal : pagoMensualVal

  return {
    generacion      : generacionPlanta.value,
    consumo         : consumoCliente.value,
    hbs             : hbs.value,
    tarifaKwh       : tarifaKwh.value        || 0,
    contribucion    : contribucion.value      || 0,
    aluPublico      : aluPublico.value        || 0,
    autoconsumo     : autoconsumo.value       || 0,
    adicionales     : adicionales.value       || 0,
    itemsAdicionales: itemsAdicionales.value,
    descuento       : descuento.value         || 0,
    costoTotal,
    ahorroMes,
    userName        : cotizacionStore.userName || 'Usuario',
    advisorName     : sessionStorage.getItem('soinsolar_user') || '',
    quoteId,
    images,
    structureImages: cotizacionStore.structureImages
  }
}

const _buildUrl = () => {
  const data = _buildData()
  // Incluir imágenes como URLs (no base64) — son URLs cortas de ImgBB, no pesan
  // Solo conservar url y thumb, descartar data en base64 si existiera
  const imagesSafe = (data.images || []).map(img => ({
    data : img.url  || img.data,   // preferir URL de nube sobre base64
    thumb: img.thumb || img.url || img.data,
    url  : img.url  || img.data,
    size : img.size,
    timestamp: img.timestamp
  }))
  const { images, ...dataLigera } = data
  dataLigera.images = imagesSafe

  const encoded = _toB64(JSON.stringify(dataLigera))
  return window.location.origin + window.location.pathname + '?d=' + encoded
}

const generarLink = () => {
  if (!consumoCliente.value || !generacionPlanta.value) {
    alert('Por favor ingrese un consumo y una generación válidos antes de generar el link.')
    return
  }
  const url = _buildUrl()
  try {
    navigator.clipboard.writeText(url)
      .then(() => alert('Link copiado al portapapeles:\n' + url))
      .catch(() => alert('Link generado:\n' + url + '\n\nCópielo manualmente.'))
  } catch (_) {
    alert('Link generado:\n' + url + '\n\nCópielo manualmente.')
  }
}

const compartirWhatsApp = () => {
  if (!consumoCliente.value || !generacionPlanta.value) {
    alert('Por favor ingrese un consumo y una generación válidos antes de compartir.')
    return
  }
  const url = _buildUrl()
  const valorMostrado = descuento.value > 0 ? resultados.value.valorConDescuento : resultados.value.valorTotalConAdicionales
  const mensaje =
    `Hola! Te comparto la cotización de tu proyecto solar:\n\n${url}\n\n` +
    `Consumo: ${consumoCliente.value} kWh/mes\n` +
    `Valor total: ${formatearMoneda(valorMostrado)}`
  window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, '_blank')
}

const compartirEmail = () => {
  if (!consumoCliente.value || !generacionPlanta.value) {
    alert('Por favor ingrese un consumo y una generación válidos antes de compartir.')
    return
  }
  const url    = _buildUrl()
  const valorMostrado = descuento.value > 0 ? resultados.value.valorConDescuento : resultados.value.valorTotalConAdicionales
  const asunto = 'Cotización Proyecto Solar - Soinsolar'
  const cuerpo =
    `Hola!\n\nTe comparto la cotización de tu proyecto solar:\n\n${url}\n\n` +
    `Detalles de la cotización:\n` +
    `- Consumo: ${consumoCliente.value} kWh/mes\n` +
    `- Valor total: ${formatearMoneda(valorMostrado)}\n\n` +
    `Saludos,\nEquipo Soinsolar`
  window.open(`mailto:?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`, '_blank')
}

// ─── FORMATO MONEDA ──────────────────────────────────────────────────────────
const formatearMoneda = (valor) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP',
    minimumFractionDigits: 0, maximumFractionDigits: 0
  }).format(valor)

// ─── CARGAR DESDE REGISTRO DE COTIZACIONES ───────────────────────────────────
const cargarDesdRegistro = (e) => {
  const cot = e.detail
  if (!cot) return

  consumoCliente.value   = cot.consumoCliente   || null
  generacionPlanta.value = cot.generacionPlanta || null
  hbs.value              = cot.hbs              || 3.8
  tarifaKwh.value        = cot.tarifaKwh        || null
  contribucion.value     = cot.contribucion      ?? null
  aluPublico.value       = cot.aluPublico        ?? null
  autoconsumo.value      = cot.autoconsumo       ?? null
  itemsAdicionales.value = cot.itemsAdicionales || (cot.adicionales ? [{ nombre: "Adicionales", precio: cot.adicionales }] : [])
  recalcularAdicionales()
  descuento.value        = cot.descuento         || 0
  cotizacionStore.userName = cot.cliente        || cotizacionStore.userName

  if (cot.fotos && Array.isArray(cot.fotos) && cot.fotos.length > 0) {
    localStorage.setItem('savedTechnicalImages', JSON.stringify(cot.fotos))
    window.dispatchEvent(new CustomEvent('registro-fotos-actualizadas', { detail: cot.fotos }))
  }

  if (cot.contribucion || cot.aluPublico || cot.autoconsumo || cot.hbs) {
    mostrarAvanzados.value = true
  }
  actualizarInstantaneo()
}

onMounted(() => {
  const cotizacionStore = useCotizacionStore()
  const urlParams = new URLSearchParams(window.location.search)
  // Soportar tanto el nuevo ?d= (btoa) como el antiguo ?data= (por retrocompatibilidad)
  const isNew = urlParams.has('d')
  const isOld = urlParams.has('data')
  isSharedLink.value = isNew || isOld

  if (isNew || isOld) {
    try {
      let data
      if (isNew) {
        data = JSON.parse(_fromB64(urlParams.get('d')))
      } else {
        data = JSON.parse(decodeURIComponent(urlParams.get('data')))
      }
      generacionPlanta.value   = data.generacion   || null
      consumoCliente.value     = data.consumo       || null
      hbs.value                = data.hbs           || 3.8
      tarifaKwh.value          = data.tarifaKwh     || null
      contribucion.value       = data.contribucion  || null
      aluPublico.value         = data.aluPublico    || null
      autoconsumo.value        = data.autoconsumo   || null
      itemsAdicionales.value   = data.itemsAdicionales || (data.adicionales ? [{ nombre: "Adicionales", precio: data.adicionales }] : [])
      recalcularAdicionales()
      descuento.value          = data.descuento     || 0
      cotizacionStore.userName = data.userName      || 'Usuario'
      if (data.quoteId) cotizacionStore._quoteId = data.quoteId
      if (data.structureImages) {
        cotizacionStore.updateStructureImages(data.structureImages)
      }
      actualizarInstantaneo()
    } catch (error) {
      console.error('Error loading data from URL:', error)
    }
  }

  window.addEventListener('registro-cargar-cotizacion', cargarDesdRegistro)
})

onUnmounted(() => {
  window.removeEventListener('registro-cargar-cotizacion', cargarDesdRegistro)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');

/* ─── VALIDATION HINTS ──────────────────────────────────────────────── */
.validation-hint {
  font-size: 12px;
  font-weight: 600;
  color: #ef4444;
  margin-top: 6px;
  padding: 5px 10px;
  background: rgba(239, 68, 68, 0.08);
  border-left: 3px solid #ef4444;
  border-radius: 0 6px 6px 0;
  animation: fadeInHint 0.2s ease;
}
.validation-hint.valid {
  color: #059669;
  background: rgba(5, 150, 105, 0.08);
  border-left-color: #059669;
}
.validation-hint.purple {
  color: #7c3aed;
  background: rgba(124, 58, 237, 0.08);
  border-left-color: #7c3aed;
}
.validation-hint.indigo {
  color: #4f46e5;
  background: rgba(79, 70, 229, 0.08);
  border-left-color: #4f46e5;
}
.validation-hint.green {
  color: #047857;
  background: rgba(4, 120, 87, 0.08);
  border-left-color: #047857;
}
.validation-hint.amber {
  color: #d97706;
  background: rgba(217, 119, 6, 0.08);
  border-left-color: #d97706;
}
.validation-hint.dark {
  color: #1e293b;
  background: rgba(30, 41, 59, 0.08);
  border-left-color: #1e293b;
}
@keyframes fadeInHint {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ─── INPUT ERROR STATES ─────────────────────────────────────────────── */
.input-error {
  border-color: #ef4444 !important;
  background: rgba(239, 68, 68, 0.07) !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12) !important;
}
.input-error-purple {
  border-color: #7c3aed !important;
  background: rgba(124, 58, 237, 0.07) !important;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.12) !important;
}
.input-error-indigo {
  border-color: #4f46e5 !important;
  background: rgba(79, 70, 229, 0.07) !important;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12) !important;
}
.input-error-green {
  border-color: #047857 !important;
  background: rgba(4, 120, 87, 0.07) !important;
  box-shadow: 0 0 0 3px rgba(4, 120, 87, 0.12) !important;
}
.input-error-amber {
  border-color: #d97706 !important;
  background: rgba(217, 119, 6, 0.07) !important;
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.12) !important;
}
.input-error-dark {
  border-color: #475569 !important;
  background: rgba(71, 85, 105, 0.07) !important;
  box-shadow: 0 0 0 3px rgba(71, 85, 105, 0.12) !important;
}

/* ─── PANEL BASE ─────────────────────────────────────────────────────── */
.panel3 {
  background: linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  box-shadow:
    0 20px 60px rgba(0,0,0,0.3),
    0 0 0 1px rgba(14,165,233,0.2),
    inset 0 1px 0 rgba(255,255,255,0.9);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
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
    0 30px 80px rgba(0,0,0,0.4),
    0 0 0 1px rgba(14,165,233,0.4),
    inset 0 1px 0 rgba(255,255,255,1);
}

.panel-content { position: relative; z-index: 2; }

.main-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
  padding: 0 20px;
}

.left-panel  { display: flex; flex-direction: column; gap: 20px; }
.right-panel { display: flex; align-items: center; justify-content: center; min-height: 400px; }

.input-section { text-align: left; }

.section-title {
  font-size: 20px;
  font-weight: 700;
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

.descuento-title {
  background: linear-gradient(135deg, #1e293b, #475569) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

.input-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;
  position: relative;
}

.tarifa-group { position: relative; }

.consumo-input, .hbs-input {
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
  background: rgba(14,165,233,0.05);
}

.hbs-input { color: #f59e0b; border-color: #f59e0b; background: rgba(245,158,11,0.05); }
.hbs-input:focus { border-color: #d97706; background: rgba(217,119,6,0.1); box-shadow: 0 0 0 4px rgba(245,158,11,0.1); }
.consumo-input:focus { border-color: #3b82f6; background: rgba(59,130,246,0.1); box-shadow: 0 0 0 4px rgba(59,130,246,0.1); }

.descuento-input {
  font-size: 32px; font-weight: 700; font-family: 'Montserrat', sans-serif;
  color: #1e293b; border: 3px solid #1e293b; border-radius: 16px;
  padding: 16px 24px; width: 100%; max-width: 280px;
  text-align: center; outline: none; transition: all 0.3s ease;
  background: rgba(30,41,59,0.04);
}
.descuento-input:focus { border-color: #0f172a; background: rgba(15,23,42,0.07); box-shadow: 0 0 0 4px rgba(30,41,59,0.1); }
.descuento-input::placeholder { color: rgba(30,41,59,0.25); }

.tarifa-input {
  font-size: 28px; font-weight: 700; font-family: 'Montserrat', sans-serif;
  color: #8b5cf6; border: 3px solid #8b5cf6; border-radius: 16px;
  padding: 14px 14px 14px 50px; width: 100%; max-width: 280px;
  text-align: left; outline: none; transition: all 0.3s ease;
  background: rgba(139,92,246,0.05);
  box-sizing: border-box;
}
.tarifa-input:focus { border-color: #7c3aed; background: rgba(124,58,237,0.1); box-shadow: 0 0 0 4px rgba(139,92,246,0.1); }

.currency-symbol-purple {
  position: absolute;
  left: calc(50% - 125px);
  font-size: 28px; font-weight: 700; color: #8b5cf6; pointer-events: none;
  z-index: 1;
}

.auto-input {
  font-size: 32px; font-weight: 700; font-family: 'Montserrat', sans-serif;
  color: #059669; border: 3px solid #059669; border-radius: 16px;
  padding: 16px 24px; width: 100%; max-width: 280px;
  text-align: center; outline: none; transition: all 0.3s ease;
  background: rgba(5,150,105,0.05);
}
.auto-input:focus { border-color: #047857; background: rgba(4,120,87,0.1); box-shadow: 0 0 0 4px rgba(5,150,105,0.15); }

.input-unit  { font-size: 20px; font-weight: 600; color: #64748b; }
.input-hint  { font-size: 13px; color: #94a3b8; font-weight: 500; min-height: 20px; margin-top: 6px; }

.input-doble { display: flex; gap: 16px; align-items: flex-start; }
.input-doble-col { flex: 1; text-align: left; }
.section-title-sm {
  font-size: 15px; font-weight: 700; margin-bottom: 12px;
  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text; display: flex; align-items: center;
  justify-content: center; min-height: 36px;
}
.pct-input {
  font-size: 28px; font-weight: 700; font-family: 'Montserrat', sans-serif;
  color: #6366f1; border: 3px solid #6366f1; border-radius: 16px;
  padding: 12px 8px; width: 100%; text-align: center; outline: none;
  transition: all 0.3s ease; background: rgba(99,102,241,0.05);
  box-sizing: border-box;
}
.pct-input:focus { border-color: #4f46e5; background: rgba(79,70,229,0.1); box-shadow: 0 0 0 4px rgba(99,102,241,0.1); }

.adicionales-section { gap: 10px; }

.adicionales-list {
  width: 100%;
  background: rgba(5,150,105,0.06);
  border: 1px solid rgba(5,150,105,0.25);
  border-radius: 10px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 10px;
  box-sizing: border-box;
}

.adicional-item {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: clamp(4px, 1vw, 8px);
  padding: clamp(8px, 2vw, 12px);
  border-bottom: 1px solid rgba(5,150,105,0.12);
  min-height: 44px;
}
.adicional-item:last-child { border-bottom: none; }

.adicional-item-nombre {
  flex: 1;
  font-size: 13px;
  color: #065f46;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.adicional-item-precio {
  font-size: 13px;
  font-weight: 700;
  color: #10b981;
  white-space: nowrap;
}

.adicional-edit-btn {
  background: none; border: none; cursor: pointer;
  font-size: clamp(13px, 3vw, 14px); min-width: 44px; min-height: 44px;
  padding: clamp(6px, 1.5vw, 8px); border-radius: 8px; line-height: 1;
  transition: all 0.2s ease; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.adicional-edit-btn:hover { background: rgba(14,165,233,0.15); transform: scale(1.05); }

.adicional-delete-btn {
  background: none; border: none; color: #f87171; cursor: pointer;
  font-size: clamp(12px, 3vw, 13px); min-width: 44px; min-height: 44px;
  padding: clamp(6px, 1.5vw, 8px); border-radius: 8px; line-height: 1;
  transition: all 0.2s ease; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.adicional-delete-btn:hover { background: rgba(248,113,113,0.15); transform: scale(1.05); }

.adicionales-total-row {
  display: flex; justify-content: space-between; align-items: center;
  padding-top: 6px; margin-top: 4px;
  border-top: 1px solid rgba(5,150,105,0.3);
  font-size: 13px; color: #047857; font-weight: 600;
}
.adicionales-total-valor { font-weight: 800; color: #059669; }

.edit-nombre-input {
  flex: 1; min-width: 0; width: 100%;
  padding: clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px);
  border-radius: 10px; border: 2px solid #0ea5e9;
  background: rgba(14,165,233,0.08); color: #065f46;
  font-size: clamp(13px, 3.5vw, 15px); font-family: 'Montserrat', sans-serif;
  font-weight: 600; outline: none; transition: all 0.2s ease; box-sizing: border-box;
}
.edit-nombre-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.2); }

.edit-precio-wrapper {
  position: relative; width: 100%;
  max-width: clamp(110px, 25vw, 150px); flex-shrink: 0;
}
.edit-precio-symbol {
  position: absolute; left: clamp(10px, 2.5vw, 12px); top: 50%;
  transform: translateY(-50%); font-size: clamp(14px, 3.5vw, 16px);
  font-weight: 700; color: #10b981; pointer-events: none; z-index: 1;
}
.edit-precio-input {
  width: 100%;
  padding: clamp(8px, 2vw, 12px) clamp(10px, 2.5vw, 14px) clamp(8px, 2vw, 12px) clamp(32px, 8vw, 38px);
  border-radius: 10px; border: 2px solid #10b981;
  background: rgba(16,185,129,0.08); color: #059669;
  font-size: clamp(13px, 3.5vw, 16px); font-weight: 700;
  font-family: 'Montserrat', sans-serif; outline: none;
  transition: all 0.2s ease; box-sizing: border-box;
}
.edit-precio-input:focus { border-color: #059669; box-shadow: 0 0 0 3px rgba(16,185,129,0.2); }

.edit-save-btn {
  background: #059669; border: none; color: #fff; cursor: pointer;
  font-size: clamp(14px, 3.5vw, 16px); font-weight: 700;
  min-width: 44px; min-height: 44px; padding: clamp(8px, 2vw, 12px);
  border-radius: 10px; line-height: 1; transition: all 0.2s ease; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.edit-save-btn:hover { background: #047857; transform: scale(1.05); }

.edit-cancel-btn {
  background: none; border: none; color: #f87171; cursor: pointer;
  font-size: clamp(14px, 3.5vw, 16px); font-weight: 700;
  min-width: 44px; min-height: 44px; padding: clamp(8px, 2vw, 12px);
  border-radius: 10px; line-height: 1; transition: all 0.2s ease; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.edit-cancel-btn:hover { background: rgba(248,113,113,0.15); transform: scale(1.05); }

.adicional-form { display: flex; flex-direction: column; gap: 10px; width: 100%; }

.adicional-nombre-input {
  width: 100%; padding: 12px 14px; border-radius: 10px;
  border: 2px solid rgba(5,150,105,0.35); background: #fff;
  color: #1a1a1a; font-size: 15px; font-family: 'Montserrat', sans-serif;
  font-weight: 500; outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}
.adicional-nombre-input::placeholder { color: rgba(0,0,0,0.35); }
.adicional-nombre-input:focus { border-color: #059669; box-shadow: 0 0 0 3px rgba(16,185,129,0.15); }

.adicional-precio-wrapper { position: relative; width: 100%; }
.adicional-precio-symbol {
  position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
  font-size: 22px; font-weight: 700; color: #10b981; pointer-events: none; z-index: 1; line-height: 1;
}
.adicional-precio-input {
  width: 100%; padding: 12px 14px 12px 40px; border-radius: 10px;
  border: 2px solid rgba(5,150,105,0.35); background: rgba(16,185,129,0.04);
  color: #10b981; font-size: 22px; font-weight: 700;
  font-family: 'Montserrat', sans-serif; outline: none;
  transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box; text-align: left;
}
.adicional-precio-input::placeholder { color: rgba(16,185,129,0.35); font-weight: 500; }
.adicional-precio-input:focus { border-color: #059669; background: rgba(5,150,105,0.08); box-shadow: 0 0 0 3px rgba(16,185,129,0.15); }

.adicional-total-live {
  display: flex; justify-content: space-between; align-items: center;
  background: rgba(16,185,129,0.08); border: 1.5px solid rgba(16,185,129,0.3);
  border-radius: 10px; padding: 10px 14px;
}
.adicional-total-live-label { font-size: 12px; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 0.8px; }
.adicional-total-live-valor { font-size: 20px; font-weight: 900; font-family: 'Montserrat', sans-serif; color: #059669; letter-spacing: -0.3px; }

.adicional-add-btn {
  width: 100%; padding: 13px; border-radius: 10px; border: none;
  background: linear-gradient(135deg, #059669, #10b981); color: #fff;
  font-size: 15px; font-weight: 700; font-family: 'Montserrat', sans-serif;
  cursor: pointer; transition: opacity 0.2s, transform 0.1s; letter-spacing: 0.3px;
}
.adicional-add-btn:hover { opacity: 0.88; transform: translateY(-1px); }
.adicional-add-btn:active { transform: translateY(0); }

.result-card.descuento-card {
  grid-column: 1 / -1;
  background: #ffffff; border: 2px solid #e2e8f0; border-left: 6px solid #1e293b;
  border-radius: 16px; padding: 28px 32px; display: flex; align-items: center;
  gap: 32px; position: relative; overflow: hidden; transition: all 0.3s ease;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
}
.result-card.descuento-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.10); border-color: #cbd5e1; border-left-color: #0ea5e9; }
.descuento-badge {
  flex-shrink: 0; background: #1e293b; color: #ffffff;
  font-size: 22px; font-weight: 900; font-family: 'Montserrat', sans-serif;
  width: 76px; height: 76px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  letter-spacing: -0.5px; transition: background 0.3s ease;
}
.result-card.descuento-card:hover .descuento-badge { background: #0ea5e9; }
.descuento-body { flex: 1; min-width: 0; }
.descuento-top-label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px; }
.descuento-valores { display: flex; align-items: center; gap: 0; }
.descuento-col { flex: 1; display: flex; flex-direction: column; gap: 6px; padding: 0 clamp(12px, 2vw, 24px); }
.descuento-col:first-child { padding-left: 0; }
.descuento-col-label { font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
.descuento-col-original { font-size: clamp(16px, 2.2vw, 22px); font-weight: 700; color: #94a3b8; font-family: 'Montserrat', sans-serif; text-decoration: line-through; text-decoration-thickness: 2px; }
.descuento-col-final { font-size: clamp(20px, 3vw, 32px); font-weight: 900; color: #1e293b; font-family: 'Montserrat', sans-serif; letter-spacing: -0.5px; line-height: 1; }
.descuento-col-ahorro { font-size: clamp(16px, 2.2vw, 22px); font-weight: 800; color: #059669; font-family: 'Montserrat', sans-serif; }
.descuento-separador { width: 1px; height: 48px; background: #e2e8f0; flex-shrink: 0; }

.result-card.ahorro-card {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, #065f46 0%, #059669 50%, #10b981 100%);
  border-color: #047857; flex-direction: column; align-items: center; gap: 16px;
  padding: clamp(20px, 3vw, 32px); position: relative; overflow: hidden;
}
.result-card.ahorro-card::before {
  content: ''; position: absolute; top: -60px; right: -40px;
  width: 220px; height: 220px; background: rgba(255,255,255,0.07);
  border-radius: 50%; pointer-events: none;
}
.result-card.ahorro-card::after {
  content: ''; position: absolute; bottom: -50px; left: 60px;
  width: 160px; height: 160px; background: rgba(255,255,255,0.05);
  border-radius: 50%; pointer-events: none;
}
.result-card.ahorro-card:hover { background: linear-gradient(135deg, #047857 0%, #065f46 50%, #059669 100%); box-shadow: 0 20px 50px rgba(5,150,105,0.55); }
.ahorro-icon-wrap { flex-shrink: 0; position: relative; z-index: 1; }
.ahorro-header-label { font-size: clamp(10px, 1.5vw, 12px); font-weight: 700; color: rgba(255,255,255,0.65); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px; text-align: center; width: 100%; }
.ahorro-row { display: flex; align-items: center; justify-content: center; gap: 0; width: 100%; flex: 1; }
.ahorro-col { display: flex; flex-direction: column; align-items: center; text-align: center; flex: 1; min-width: 0; padding: 0 clamp(8px, 2vw, 20px); }
.ahorro-col-label { font-size: clamp(10px, 1.5vw, 13px); font-weight: 600; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px; white-space: nowrap; }
.ahorro-col-value { font-size: clamp(20px, 4.5vw, 38px); font-weight: 900; color: #ffffff; line-height: 1.1; text-shadow: 0 2px 12px rgba(0,0,0,0.2); font-family: 'Montserrat', sans-serif; text-align: center; white-space: nowrap; }
.ahorro-col-value--anual { font-size: clamp(20px, 4.5vw, 38px); font-weight: 900; color: #ffffff !important; -webkit-text-fill-color: #ffffff !important; background: none !important; filter: none !important; white-space: nowrap; display: block; width: 100%; text-align: center; }
.ahorro-divider { width: 1px; height: 56px; background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.4), transparent); flex-shrink: 0; }
.ahorro-detail { margin-top: 12px; display: flex; justify-content: center; }
.ahorro-pct { display: inline-block; background: rgba(255,255,255,0.15); color: #ffffff; font-size: clamp(11px, 1.5vw, 13px); font-weight: 700; padding: 5px 14px; border-radius: 20px; backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.2); letter-spacing: 0.3px; }
.ahorro-icon-anim { animation: pulse-green 2s ease-in-out infinite; font-size: 44px !important; width: 70px !important; height: 70px !important; }
@keyframes pulse-green {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16,185,129,0.5); }
  50%       { transform: scale(1.15); box-shadow: 0 0 0 10px rgba(16,185,129,0); }
}

.result-card.pago-card { background: linear-gradient(135deg, #f97316, #fb923c); border-color: #ea580c; }
.result-card.pago-card .result-label { color: rgba(255,255,255,0.9); }
.result-card.pago-card:hover { background: linear-gradient(135deg, #ea580c, #f97316); box-shadow: 0 10px 30px rgba(249,115,22,0.4); }
.pago-value { font-size: 26px; font-weight: 900; color: #ffffff !important; line-height: 1; text-shadow: 0 2px 8px rgba(0,0,0,0.15); }

.result-card.pago-anual-card { background: linear-gradient(135deg, #dc2626, #ef4444); border-color: #b91c1c; }
.result-card.pago-anual-card .result-label { color: rgba(255,255,255,0.9); }
.result-card.pago-anual-card:hover { background: linear-gradient(135deg, #b91c1c, #dc2626); box-shadow: 0 10px 30px rgba(220,38,38,0.4); }
.pago-anual-value { font-size: 26px; font-weight: 900; color: #ffffff !important; line-height: 1; text-shadow: 0 2px 8px rgba(0,0,0,0.15); }

.pago-icon-anim  { animation: pulse-orange 1.8s ease-in-out infinite; }
.pago-icon-anim2 { animation: pulse-red   1.8s ease-in-out infinite 0.4s; }
@keyframes pulse-orange {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(249,115,22,0.4); }
  50%       { transform: scale(1.12); box-shadow: 0 0 0 8px rgba(249,115,22,0); }
}
@keyframes pulse-red {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220,38,38,0.4); }
  50%       { transform: scale(1.12); box-shadow: 0 0 0 8px rgba(220,38,38,0); }
}

.results-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }

.result-card {
  background: linear-gradient(135deg, rgba(14,165,233,0.05), rgba(59,130,246,0.05));
  border: 2px solid rgba(14,165,233,0.2); border-radius: 20px; padding: 24px;
  display: flex; align-items: center; gap: 20px;
  transition: all 0.3s ease; animation: fadeInScale 0.5s ease-out;
}
.result-card:hover { transform: translateY(-5px); border-color: rgba(14,165,233,0.4); background: linear-gradient(135deg, rgba(14,165,233,0.1), rgba(59,130,246,0.1)); box-shadow: 0 10px 30px rgba(14,165,233,0.2); }

.result-card.kwp-card { background: linear-gradient(135deg, rgba(16,185,129,0.05), rgba(5,150,105,0.05)); border-color: rgba(16,185,129,0.3); }
.result-card.kwp-card:hover { border-color: rgba(16,185,129,0.5); background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.1)); box-shadow: 0 10px 30px rgba(16,185,129,0.2); }
.result-card.kwp-card .result-value { color: #10b981; }

.result-card.hbs-card { background: linear-gradient(135deg, rgba(245,158,11,0.05), rgba(251,191,36,0.05)); border-color: rgba(245,158,11,0.3); }
.result-card.hbs-card:hover { border-color: rgba(245,158,11,0.5); background: linear-gradient(135deg, rgba(245,158,11,0.1), rgba(251,191,36,0.1)); box-shadow: 0 10px 30px rgba(245,158,11,0.2); }
.result-card.hbs-card .result-value { color: #f59e0b; }

.result-card.highlight {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
  border-color: #0284c7; flex-direction: column; align-items: center; text-align: center;
}
.result-card.highlight:hover { background: linear-gradient(135deg, #0284c7, #2563eb); box-shadow: 0 15px 40px rgba(14,165,233,0.4); }

.result-icon { font-size: 40px; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.9); border-radius: 16px; flex-shrink: 0; }
.result-card.highlight .result-icon { background: rgba(255,255,255,0.95); }
.result-content { flex: 1; }
.result-label { font-size: 13px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
.result-card.highlight .result-label { color: rgba(255,255,255,0.9); font-size: 14px; margin-bottom: 12px; }
.result-value { font-size: 32px; font-weight: 800; color: #0ea5e9; line-height: 1; }
.result-card.highlight .result-value-large { font-size: 36px; font-weight: 900; color: #ffffff; line-height: 1; text-shadow: 0 2px 10px rgba(0,0,0,0.2); }
.unit { font-size: 18px; font-weight: 600; color: #64748b; margin-left: 4px; }

.breakdown { margin-top: 16px; display: flex; align-items: center; justify-content: center; gap: 12px; font-size: 14px; color: rgba(255,255,255,0.85); font-weight: 500; flex-wrap: wrap; }
.breakdown-item { background: rgba(255,255,255,0.15); padding: 6px 12px; border-radius: 8px; backdrop-filter: blur(10px); }
.breakdown-separator { font-weight: 700; font-size: 16px; }

.share-options { margin-top: 20px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.share-btn { padding: 10px 16px; border: 2px solid rgba(255,255,255,0.3); border-radius: 10px; font-size: 12px; font-weight: 600; font-family: 'Montserrat', sans-serif; cursor: pointer; transition: all 0.3s ease; backdrop-filter: blur(10px); text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px; }
.share-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(0,0,0,0.2); }
.clipboard-btn  { background: rgba(255,255,255,0.2); color: #ffffff; }
.clipboard-btn:hover { background: rgba(255,255,255,0.3); border-color: rgba(255,255,255,0.5); }
.whatsapp-btn   { background: rgba(25,187,0,0.2); color: #ffffff; border-color: rgba(25,187,0,0.3); }
.whatsapp-btn:hover { background: rgba(25,187,0,0.3); border-color: rgba(25,187,0,0.5); }
.email-btn      { background: rgba(59,130,246,0.2); color: #ffffff; border-color: rgba(59,130,246,0.3); }
.email-btn:hover { background: rgba(59,130,246,0.3); border-color: rgba(59,130,246,0.5); }

.no-results { text-align: center; padding: 60px 20px; color: #94a3b8; }
.no-results-icon { font-size: 64px; margin-bottom: 20px; opacity: 0.5; }
.no-results p { font-size: 18px; font-weight: 500; }

.panel-glow { position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle at 30% 50%, rgba(14,165,233,0.08) 0%, transparent 50%); animation: rotate-glow 25s linear infinite; pointer-events: none; }

.grafica-section { text-align: center; }
.pie-chart-container { margin: 20px 0; }
.grafica-hint { font-size: 14px; color: #10b981; font-weight: 600; margin-top: 12px; }

.advanced-toggle { text-align: center; margin: 4px 0; }
.toggle-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 22px; background: rgba(14,165,233,0.07); border: 2px solid rgba(14,165,233,0.25); border-radius: 30px; color: #0ea5e9; font-size: 13px; font-weight: 700; font-family: 'Montserrat', sans-serif; cursor: pointer; transition: all 0.25s ease; letter-spacing: 0.3px; }
.toggle-btn:hover { background: rgba(14,165,233,0.14); border-color: rgba(14,165,233,0.5); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(14,165,233,0.15); }
.toggle-arrow { font-size: 11px; }

@keyframes slideInUp  { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInScale { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
@keyframes rotate-glow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

@media (max-width: 968px) {
  .main-layout { grid-template-columns: 1fr; gap: 30px; }
  .right-panel { min-height: 300px; }
  .results-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .panel3 { padding: 24px; }
  .section-title { font-size: 18px; min-height: 44px; }
  .consumo-input, .hbs-input, .descuento-input { font-size: 24px; max-width: 100%; padding: 12px 16px; }
  .input-unit { font-size: 16px; }
  .results-grid { grid-template-columns: 1fr; }
  .result-card { padding: 20px; }
  .result-icon { font-size: 32px; width: 50px; height: 50px; }
  .result-value { font-size: 24px; }
  .result-card.highlight .result-value-large { font-size: 28px; }
  .breakdown { font-size: 12px; gap: 8px; }
  .breakdown-item { padding: 4px 10px; }
  .descuento-card { gap: 20px; padding: 20px; }
  .descuento-badge { width: 60px; height: 60px; font-size: 18px; }
  .descuento-col-final { font-size: 20px; }
  .descuento-col-original, .descuento-col-ahorro { font-size: 15px; }
}
@media (max-width: 480px) {
  .panel3 { padding: 16px; }
  .main-layout { gap: 20px; }
  .right-panel { min-height: 250px; }
  .section-title { font-size: 16px; min-height: 40px; }
  .consumo-input, .hbs-input, .descuento-input { font-size: 20px; padding: 10px 14px; }
  .input-unit { font-size: 14px; }
  .pie-chart-container svg { width: 180px; height: 180px; }
  .results-grid { grid-template-columns: 1fr; gap: 12px; }
  .result-card { padding: 16px; }
  .result-icon { font-size: 28px; width: 45px; height: 45px; }
  .result-value { font-size: 20px; }
  .result-card.highlight .result-value-large { font-size: 24px; }
  .breakdown { font-size: 11px; gap: 6px; }
  .breakdown-item { padding: 3px 8px; }
  .descuento-card { flex-direction: column; gap: 16px; padding: 16px; }
  .descuento-valores { flex-direction: column; gap: 12px; }
  .descuento-separador { width: 100%; height: 1px; }
  .descuento-col { padding: 0; }
  .descuento-badge { width: 100%; height: 48px; border-radius: 8px; font-size: 16px; }
  .edit-precio-wrapper { width: 100px; }
}
</style>