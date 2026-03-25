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
                :disabled="isSharedLink"
              />
              <span class="input-unit">kWh/mes</span>
            </div>
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
              <!-- Nombre del ítem -->
              <input
                v-model="nuevoAdicionalNombre"
                type="text"
                placeholder="Nombre del ítem"
                class="adicional-nombre-input"
              />

              <!-- Precio del ítem -->
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

              <!-- Total acumulado en vivo -->
              <div
                class="adicional-total-live"
                v-if="adicionales > 0 || (nuevoAdicionalPrecio && nuevoAdicionalPrecio > 0)"
              >
                <span class="adicional-total-live-label">Total acumulado</span>
                <span class="adicional-total-live-valor">
                  {{ formatearMoneda((adicionales || 0) + (nuevoAdicionalPrecio && nuevoAdicionalPrecio > 0 ? nuevoAdicionalPrecio : 0)) }}
                </span>
              </div>

              <!-- Botón agregar -->
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
                min="0" max="100"
              />
              <span class="input-unit">%</span>
            </div>
            <p class="input-hint">Descuento sobre el valor total</p>
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

const cotizacionStore = useCotizacionStore()

// ─── CONSTANTES DEL EXCEL ────────────────────────────────────────────────────
const POTENCIA_PANEL_KWP = 0.62
const MAX_PANELES = 1048

const preciosExcel = [
  11203192, 14930717, 18230682, 18658242, 23433642, 28636602, 31614010, 34539494,
  34591419, 36256296, 37973099, 39052720, 41088674, 43124629, 46751447, 50291384,
  50378266, 51808038, 53324693, 53657436, 56425097, 59192757, 60640688, 62088620,
  62256154, 66699313, 71142473, 72745787, 74349101, 75308062, 77205620, 79103179,
  79663693, 81234768, 82805843, 84358068, 85910293, 89623948, 92659373, 95694797,
  96414423, 97992585, 99570748, 101134778, 102698809, 103393846, 104947636, 106501425,
  107973292, 109445158, 110810423, 113034505, 115258586, 115969400, 117480283, 118991167,
  120493207, 121995247, 122742609, 124238135, 125733661, 127446527, 128939012, 130431496,
  132897851, 135364205, 136111784, 137582574, 139053363, 139825579, 141291191, 142756804,
  144216635, 145676466, 146472704, 147928116, 149383529, 159155377, 168927226, 169801159,
  171397274, 172993388, 173883992, 175456644, 177029295, 178596356, 180163417, 181069548,
  182631396, 184193244, 185662736, 189705418, 193748100, 195316692, 196885284, 197792829,
  199356686, 200920543, 202400203, 203879862, 204959710, 206514691, 207988019, 208069673,
  209529130, 211070242, 212607402, 214144561, 215403110, 216950693, 218498276, 225206436,
  226760650, 228314863, 229865472, 231416081, 231540422, 233080510, 234620597, 234976028,
  235280425, 235584822, 236503821, 238031614, 239022900, 240547804, 242072708, 243594828,
  245116947, 245354854, 246868439, 248382025, 249382755, 250893746, 252404736, 253913248,
  255421759, 256429410, 257935503, 259441597, 261632013, 262788483, 263944953, 265443201,
  266941449, 267951970, 269447997, 270944024, 272364900, 273785776, 274948274, 276440105,
  277931935, 278954017, 283986674, 289019331, 290552643, 292085956, 293158720, 294690124,
  296221529, 297888113, 299418370, 300948627, 302477131, 304005635, 305086062, 306014657,
  306943252, 308021271, 309539208, 311057146, 312573482, 314089818, 315172144, 316686849,
  318201554, 319714745, 321227935, 322314357, 323267732, 324221108, 325305449, 326809446,
  328313443, 329816046, 331318649, 332406709, 333907874, 335409039, 336500814, 338000573,
  339500332, 340475429, 341450526, 342540320, 344032085, 345523849, 346941352, 348358854,
  349597964, 359587770, 369577576, 370623108, 372127344, 373631581, 374641841, 375652101,
  376696931, 378193669, 379690408, 380739155, 382234546, 383729936, 385224037, 386718137,
  387770599, 389263411, 390756222, 391812317, 392836534, 393860752, 395346885, 396833019,
  397888333, 399373254, 400858175, 402341945, 403825715, 404884328, 406366935, 407849542,
  408911409, 409950252, 410989096, 412465716, 413942336, 415003494, 416479017, 417954540,
  419018735, 422486680, 425954625, 427431243, 428907861, 429964991, 431020145, 432075299,
  433473409, 434871518, 436074251, 437544371, 439014491, 440074040, 441543149, 443012257,
  444480413, 445948569, 447010840, 448077725, 449144610, 465840631, 467315429, 468790226,
  470263985, 471737744, 472766339, 474239073, 475711807, 476743461, 478215185, 479686909,
  480775620, 481864331, 482896144, 484363124, 485830103, 487296136, 488762170, 489796837,
  491261928, 492727020, 493764482, 495228645, 496692809, 497790716, 498888622, 499926222,
  501386046, 502845869, 503886110, 505345049, 506803988, 508262077, 509720167, 510762933,
  512220166, 513677399, 514710688, 515743977, 516932938, 518386186, 519839433, 520884748,
  522337177, 523789606, 525241254, 526692902, 527740531, 529191386, 530642240, 539061309,
  540534999, 542008689, 543481636, 544954584, 546030324, 547502511, 548974698, 550052627,
  551524064, 552995501, 554466230, 555936959, 556050726, 557517753, 558984781, 560451121,
  561917462, 562996505, 564462137, 565927770, 567008841, 568473774, 569938708, 571402986,
  572867264, 573019800, 574480645, 575941491, 577023653, 578483826, 579944000, 581403547,
  582863095, 583947072, 585405966, 586864860, 588250106, 589635353, 589969960, 591425053,
  592880145, 593965136, 595419600, 596874063, 598327944, 599781825, 600868499, 602321767,
  603775035, 604863429, 605882953, 606902477, 608352201, 609801925, 610889542, 612338676,
  613787810, 614877072, 616325623, 617774173, 619222188, 620670203, 621760993, 622789737,
  623818482, 625263185, 626707887, 627797949, 629242096, 630686243, 631777845, 633221443,
  634665040, 636108137, 637551234, 638644261, 639681627, 640718992, 641811419, 643251370,
  644691322, 646130792, 647570262, 648664050, 650103002, 651541953, 652907397, 654272841,
  655514037, 656559480, 657604924, 679081171, 680526506, 681971842, 683416648, 684861454,
  685926745, 687371007, 688815268, 689882176, 691325898, 692769620, 693832195, 694894770,
  695961387, 697402242, 698843097, 699911269, 701351602, 702791935, 704231777, 705671619,
  706741266, 708180597, 709619929, 710689338, 711758747, 712828118, 714264748, 715701378,
  716772216, 718208351, 719644486, 721080158, 722515830, 723588056, 725023244, 726458432,
  727532072, 728607082, 729682092, 739621646, 749561200, 750611224, 752050792, 753490359,
  754856399, 756222438, 757420073, 758858654, 760297234, 761350325, 762438728, 763527132,
  764963212, 766399293, 767452327, 768887925, 770323523, 771378036, 772813156, 774248276,
  775682938, 777117600, 778173535, 784408506, 790643478, 791721313, 793175515, 794629716,
  796083475, 797537233, 798616439, 800069742, 801523046, 802975915, 804428785, 805509336,
  806491480, 807473623, 808553579, 810003608, 811453638, 812903248, 814352857, 815434110,
  816883286, 818332462, 819415025, 820863771, 822312517, 823302659, 824292802, 825374766,
  826820831, 828266897, 829639525, 831012154, 832241424, 833686676, 835131929, 836216370,
  837661212, 839106054, 840103791, 841101528, 842185398, 843627691, 845069985, 846155063,
  847596957, 849038850, 850480369, 851921887, 853008113, 854449239, 855890365, 856107832,
  857546895, 858985959, 860424658, 861863358, 862950191, 864388508, 865826824, 867264784,
  868702744, 869790668, 871228252, 872665836, 872905660, 874341278, 875776895, 877212166,
  878647438, 879735940, 881170845, 882605749, 883695337, 885129878, 886564419, 887998623,
  889432827, 889693967, 891126295, 892558622, 893917581, 895276540, 896512710, 897944355,
  899376000, 900467131, 901898427, 903329724, 904760699, 906191674, 906473161, 907902343,
  909331525, 910423186, 911852027, 913280869, 914413465, 915546061, 916639304, 918067295,
  919495286, 920589503, 921620862, 922652220, 924078191, 925504162, 926597903, 928023548,
  929449192, 930874539, 932299886, 933394522, 934819548, 936244573, 937340143, 938377164,
  939414185, 940837277, 942260368, 943355481, 944778259, 946201036, 947297058, 948719524,
  950141990, 951564174, 952986357, 954083222, 955125661, 956168101, 957515393, 958862685,
  960105187, 961525215, 962945243, 964042540, 984392161, 1004741782, 1006173337, 1007604891,
  1008664918, 1009724599, 1010784280, 1011844177, 1013273836, 1014703494, 1016132827, 1017562159,
  1018623109, 1020052107, 1021481106, 1022543114, 1023971782, 1025400449, 1026464848, 1027529247,
  1028591112, 1030017969, 1031444825, 1032871368, 1034297911, 1035360786, 1036787008, 1038213229,
  1039277122, 1040703024, 1042128926, 1043197852, 1044266778, 1045330532, 1046754695, 1048178857,
  1049243604, 1050667454, 1052091304, 1053514855, 1054938407, 1056004109, 1057427353, 1058850597,
  1060200509, 1061550421, 1062062711, 1063484282, 1064905852, 1065972376, 1067393646, 1068814915,
  1070235897, 1071656880, 1072724322, 1074145007, 1075565692, 1076634066, 1077710986, 1078787905,
  1080206981, 1081626056, 1082694289, 1084113073, 1085531858, 1086601000, 1088019495, 1089437990,
  1090856211, 1092274433, 1093344446, 1094425402, 1095506358, 1096923030, 1098339701, 1099409577,
  1100825968, 1102242358, 1103313111, 1104729221, 1106145332, 1107561179, 1108977026, 1110048616,
  1111133457, 1112218298, 1113289787, 1114704125, 1116118464, 1117532545, 1118946626, 1120018931,
  1121432742, 1122846552, 1124187071, 1125527590, 1126746778, 1127835359, 1128923941, 1129996955,
  1132370441, 1134743928, 1136156308, 1137568689, 1138640828, 1140052945, 1141465062, 1142538018,
  1143949873, 1145361728, 1146454436, 1147547144, 1148619987, 1150030448, 1151440909, 1152514550,
  1153924753, 1155334957, 1156744921, 1158154885, 1159229285, 1160638996, 1162048706, 1163144881,
  1164241056, 1165315345, 1166723709, 1168132073, 1169207135, 1170615250, 1172023365, 1173431249,
  1174839132, 1175914926, 1177322563, 1178730201, 1192907863, 1194332937, 1195758010, 1197182858,
  1198607705, 1199702648, 1201127254, 1202551860, 1203903204, 1205254548, 1206496273, 1207920417,
  1209344561, 1209599860, 1211022651, 1212445443, 1213868015, 1215290588, 1216386542, 1217808880,
  1219231219, 1220327889, 1221749994, 1223172099, 1224593991, 1226015882, 1226286162, 1227706745,
  1229127327, 1230224293, 1231644647, 1233065001, 1234485145, 1235905289, 1237002913, 1238422831,
  1239842749, 1241262459, 1242682170, 1242966941, 1244385385, 1245803829, 1246901741, 1248319963,
  1249738185, 1251156203, 1252574222, 1253672770, 1255090570, 1256508369, 1293085624, 1294111719,
  1295137813, 1296562856, 1297987899, 1299059418, 1300484220, 1301909022, 1303260555, 1304612087,
  1305830448, 1307254780, 1308679113, 1309752171, 1310782427, 1311812683, 1313235575, 1314658467,
  1315731297, 1317153955, 1318576613, 1319650201, 1321072626, 1322495051, 1323917254, 1325339456,
  1326413778, 1327448064, 1328482351, 1329556470, 1330977267, 1332398063, 1333818641, 1335239220,
  1336314057, 1337734409, 1339154761, 1340574897, 1341995033, 1343070581, 1344108772, 1345146963,
  1346222315, 1347641087, 1349059860, 1350478420, 1351896981, 1352973029, 1354391369, 1355809710,
  1356886466, 1358304587, 1359722709, 1360764685, 1361806661, 1362883208, 1364300016, 1365716823,
  1367060388, 1368403952, 1369627250, 1371043638, 1372460026, 1373537935, 1374954110, 1376370286,
  1377415933, 1378461579, 1379539286, 1380954186, 1382369085, 1383447467, 1384862157, 1386276847,
  1387691339, 1389105831, 1390184860, 1391599145, 1393013430, 1394093121, 1395141899, 1396190678,
  1397603724, 1399016770, 1400096258, 1401509100, 1402921942, 1404334592, 1405747242, 1406827358,
  1408239805, 1409652253, 1410733013, 1411785261, 1412837508, 1414248753, 1415659997, 1416740559,
  1418151605, 1419562651, 1420643845, 1422054693, 1423465541, 1424876203, 1426286866, 1429143131,
  1430199130, 1431255130, 1432591967, 1433928805, 1435155279, 1436564960, 1437974641, 1439055660,
  1440465146, 1441874633, 1443283939, 1444693244, 1445774855, 1446834121, 1447893387, 1448974839,
  1450382993, 1451791148, 1453199124, 1454607100, 1455689133, 1457096920, 1458504707, 1459587339,
  1460994938, 1462402536, 1463464977, 1464527417, 1465609872, 1467016363, 1468422853, 1469829170,
  1471235487, 1472318506, 1473724639, 1475130772, 1476214375, 1477620324, 1479026272, 1480091799,
  1481157325, 1482240755, 1483645626, 1485050496, 1486134500, 1487539190, 1488943879, 1490348401,
  1491752923, 1492837470, 1494241813, 1495646156, 1496641645, 1497637135, 1498867590, 1500270883,
  1501674176, 1502759114, 1504162230, 1505565346, 1506968299, 1508371253, 1509456719, 1510859497,
  1512262276, 1512686641, 1514088557, 1515490473, 1516892229, 1518293985, 1519379832, 1520781416,
  1522182999, 1523269387, 1524670798, 1526072210, 1527473464, 1528874718, 1529308670, 1530709084,
  1532109498, 1533509756, 1534910014, 1535996747, 1537396836, 1538796925, 1539884185, 1559035387,
  1578186588, 1579593335, 1581000082, 1581421359, 1582827272, 1584233184, 1585298878, 1586704608,
  1588110339, 1589515896, 1590921453, 1591987731, 1593393108, 1594798485, 1596130652, 1597462819,
  1598039549, 1599443941, 1600848332, 1601915142, 1603319356, 1604723570, 1606127615, 1607531660,
  1608599039, 1610002908, 1611406777, 1612474735, 1613564355, 1614653974, 1616056882, 1617459789,
  1618527688, 1619930422, 1621333157, 1622401625, 1623804187, 1625206749, 1626609147, 1628011544,
  1629080563, 1630172641, 1631264718, 1632666179, 1634067639, 1635136599, 1636537889, 1637939180,
  1639008697, 1640409818, 1641810940, 1643211902, 1644612864, 1645682916, 1646777391, 1647871866,
  1648941878, 1650341917, 1651741955, 1653141837, 1654541718, 1655612257, 1657011973, 1658411689
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
    const precioPorKwp = potencia > 0 ? Math.round(valorBase / potencia) : 0

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
  // Si se elimina el ítem que se está editando, cancelar edición
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
const _buildData = () => {
  const quoteId = Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
  cotizacionStore._quoteId = quoteId

  let images = []
  try {
    const snapshot = JSON.parse(localStorage.getItem('savedTechnicalImages') || '[]')
    images = snapshot.map(img => ({
      data: img.data, thumb: img.thumb, size: img.size, timestamp: img.timestamp
    }))
  } catch (_) { images = [] }

  return {
    generacion  : generacionPlanta.value,
    consumo     : consumoCliente.value,
    hbs         : hbs.value,
    tarifaKwh   : tarifaKwh.value   || 0,
    contribucion: contribucion.value || 0,
    aluPublico  : aluPublico.value   || 0,
    autoconsumo : autoconsumo.value  || 0,
    adicionales     : adicionales.value  || 0,
    itemsAdicionales: itemsAdicionales.value,
    descuento   : descuento.value    || 0,
    userName    : cotizacionStore.userName || 'Usuario',
    advisorName : sessionStorage.getItem('soinsolar_user') || '',
    quoteId,
    images
  }
}

const _buildUrl = () => {
  const data = _buildData()
  return window.location.origin + window.location.pathname +
    '?data=' + encodeURIComponent(JSON.stringify(data))
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
  const urlParams = new URLSearchParams(window.location.search)
  isSharedLink.value = urlParams.has('data')
  if (urlParams.has('data')) {
    try {
      const data = JSON.parse(decodeURIComponent(urlParams.get('data')))
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

.tarifa-group {
  position: relative;
}

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

/* ════════════════════════════════════════════════════════════════
   ADICIONALES
   ════════════════════════════════════════════════════════════════ */
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

/* ── Botón editar ── */
.adicional-edit-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: clamp(13px, 3vw, 14px);
  min-width: 44px;
  min-height: 44px;
  padding: clamp(6px, 1.5vw, 8px);
  border-radius: 8px;
  line-height: 1;
  transition: all 0.2s ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.adicional-edit-btn:hover {
  background: rgba(14,165,233,0.15);
  transform: scale(1.05);
}

.adicional-delete-btn {
  background: none;
  border: none;
  color: #f87171;
  cursor: pointer;
  font-size: clamp(12px, 3vw, 13px);
  min-width: 44px;
  min-height: 44px;
  padding: clamp(6px, 1.5vw, 8px);
  border-radius: 8px;
  line-height: 1;
  transition: all 0.2s ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.adicional-delete-btn:hover { 
  background: rgba(248,113,113,0.15);
  transform: scale(1.05);
 }

.adicionales-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 6px;
  margin-top: 4px;
  border-top: 1px solid rgba(5,150,105,0.3);
  font-size: 13px;
  color: #047857;
  font-weight: 600;
}
.adicionales-total-valor {
  font-weight: 800;
  color: #059669;
}

/* ── Fila de edición inline ── */
.edit-nombre-input {
  flex: 1;
  min-width: 0;
  width: 100%;
  padding: clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px);
  border-radius: 10px;
  border: 2px solid #0ea5e9;
  background: rgba(14,165,233,0.08);
  color: #065f46;
  font-size: clamp(13px, 3.5vw, 15px);
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
}
.edit-nombre-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.2);
}

.edit-precio-wrapper {
  position: relative;
  width: 100%;
  max-width: clamp(110px, 25vw, 150px);
  flex-shrink: 0;
}
.edit-precio-symbol {
  position: absolute;
  left: clamp(10px, 2.5vw, 12px);
  top: 50%;
  transform: translateY(-50%);
  font-size: clamp(14px, 3.5vw, 16px);
  font-weight: 700;
  color: #10b981;
  pointer-events: none;
  z-index: 1;
}
.edit-precio-input {
  width: 100%;
  padding: clamp(8px, 2vw, 12px) clamp(10px, 2.5vw, 14px) clamp(8px, 2vw, 12px) clamp(32px, 8vw, 38px);
  border-radius: 10px;
  border: 2px solid #10b981;
  background: rgba(16,185,129,0.08);
  color: #059669;
  font-size: clamp(13px, 3.5vw, 16px);
  font-weight: 700;
  font-family: 'Montserrat', sans-serif;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
}
.edit-precio-input:focus {
  border-color: #059669;
  box-shadow: 0 0 0 3px rgba(16,185,129,0.2);
}

.edit-save-btn {
  background: #059669;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: clamp(14px, 3.5vw, 16px);
  font-weight: 700;
  min-width: 44px;
  min-height: 44px;
  padding: clamp(8px, 2vw, 12px);
  border-radius: 10px;
  line-height: 1;
  transition: all 0.2s ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.edit-save-btn:hover { 
  background: #047857; 
  transform: scale(1.05);
}

.edit-cancel-btn {
  background: none;
  border: none;
  color: #f87171;
  cursor: pointer;
  font-size: clamp(14px, 3.5vw, 16px);
  font-weight: 700;
  min-width: 44px;
  min-height: 44px;
  padding: clamp(8px, 2vw, 12px);
  border-radius: 10px;
  line-height: 1;
  transition: all 0.2s ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.edit-cancel-btn:hover { 
  background: rgba(248,113,113,0.15); 
  transform: scale(1.05);
 }

/* Formulario en columna */
.adicional-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.adicional-nombre-input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 2px solid rgba(5,150,105,0.35);
  background: #fff;
  color: #1a1a1a;
  font-size: 15px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}
.adicional-nombre-input::placeholder { color: rgba(0,0,0,0.35); }
.adicional-nombre-input:focus {
  border-color: #059669;
  box-shadow: 0 0 0 3px rgba(16,185,129,0.15);
}

.adicional-precio-wrapper {
  position: relative;
  width: 100%;
}
.adicional-precio-symbol {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 22px;
  font-weight: 700;
  color: #10b981;
  pointer-events: none;
  z-index: 1;
  line-height: 1;
}
.adicional-precio-input {
  width: 100%;
  padding: 12px 14px 12px 40px;
  border-radius: 10px;
  border: 2px solid rgba(5,150,105,0.35);
  background: rgba(16,185,129,0.04);
  color: #10b981;
  font-size: 22px;
  font-weight: 700;
  font-family: 'Montserrat', sans-serif;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
  text-align: left;
}
.adicional-precio-input::placeholder { color: rgba(16,185,129,0.35); font-weight: 500; }
.adicional-precio-input:focus {
  border-color: #059669;
  background: rgba(5,150,105,0.08);
  box-shadow: 0 0 0 3px rgba(16,185,129,0.15);
}

/* ── Total acumulado en vivo ── */
.adicional-total-live {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(16,185,129,0.08);
  border: 1.5px solid rgba(16,185,129,0.3);
  border-radius: 10px;
  padding: 10px 14px;
}
.adicional-total-live-label {
  font-size: 12px;
  font-weight: 700;
  color: #047857;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}
.adicional-total-live-valor {
  font-size: 20px;
  font-weight: 900;
  font-family: 'Montserrat', sans-serif;
  color: #059669;
  letter-spacing: -0.3px;
}

.adicional-add-btn {
  width: 100%;
  padding: 13px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #059669, #10b981);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  font-family: 'Montserrat', sans-serif;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  letter-spacing: 0.3px;
}
.adicional-add-btn:hover { opacity: 0.88; transform: translateY(-1px); }
.adicional-add-btn:active { transform: translateY(0); }

/* ════════════════════════════════════════════════════════════════
   TARJETA DE DESCUENTO
   ════════════════════════════════════════════════════════════════ */
.result-card.descuento-card {
  grid-column: 1 / -1;
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-left: 6px solid #1e293b;
  border-radius: 16px;
  padding: 28px 32px;
  display: flex;
  align-items: center;
  gap: 32px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
}
.result-card.descuento-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.10);
  border-color: #cbd5e1;
  border-left-color: #0ea5e9;
}
.descuento-badge {
  flex-shrink: 0;
  background: #1e293b;
  color: #ffffff;
  font-size: 22px; font-weight: 900; font-family: 'Montserrat', sans-serif;
  width: 76px; height: 76px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  letter-spacing: -0.5px;
  transition: background 0.3s ease;
}
.result-card.descuento-card:hover .descuento-badge { background: #0ea5e9; }
.descuento-body { flex: 1; min-width: 0; }
.descuento-top-label {
  font-size: 11px; font-weight: 700; color: #94a3b8;
  text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px;
}
.descuento-valores { display: flex; align-items: center; gap: 0; }
.descuento-col {
  flex: 1; display: flex; flex-direction: column; gap: 6px;
  padding: 0 clamp(12px, 2vw, 24px);
}
.descuento-col:first-child { padding-left: 0; }
.descuento-col-label {
  font-size: 11px; font-weight: 600; color: #94a3b8;
  text-transform: uppercase; letter-spacing: 1px;
}
.descuento-col-original {
  font-size: clamp(16px, 2.2vw, 22px); font-weight: 700; color: #94a3b8;
  font-family: 'Montserrat', sans-serif;
  text-decoration: line-through; text-decoration-thickness: 2px;
}
.descuento-col-final {
  font-size: clamp(20px, 3vw, 32px); font-weight: 900; color: #1e293b;
  font-family: 'Montserrat', sans-serif; letter-spacing: -0.5px; line-height: 1;
}
.descuento-col-ahorro {
  font-size: clamp(16px, 2.2vw, 22px); font-weight: 800; color: #059669;
  font-family: 'Montserrat', sans-serif;
}
.descuento-separador { width: 1px; height: 48px; background: #e2e8f0; flex-shrink: 0; }

/* ════════════════════════════════════════════════════════════════
   AHORRO
   ════════════════════════════════════════════════════════════════ */
.result-card.ahorro-card {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, #065f46 0%, #059669 50%, #10b981 100%);
  border-color: #047857;
  flex-direction: column; align-items: center; gap: 16px;
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
.result-card.ahorro-card:hover {
  background: linear-gradient(135deg, #047857 0%, #065f46 50%, #059669 100%);
  box-shadow: 0 20px 50px rgba(5,150,105,0.55);
}
.ahorro-icon-wrap { flex-shrink: 0; position: relative; z-index: 1; }
.ahorro-header-label {
  font-size: clamp(10px, 1.5vw, 12px); font-weight: 700;
  color: rgba(255,255,255,0.65); text-transform: uppercase;
  letter-spacing: 1.5px; margin-bottom: 16px; text-align: center; width: 100%;
}
.ahorro-row { display: flex; align-items: center; justify-content: center; gap: 0; width: 100%; flex: 1; }
.ahorro-col {
  display: flex; flex-direction: column; align-items: center; text-align: center;
  flex: 1; min-width: 0; padding: 0 clamp(8px, 2vw, 20px);
}
.ahorro-col-label {
  font-size: clamp(10px, 1.5vw, 13px); font-weight: 600;
  color: rgba(255,255,255,0.7); text-transform: uppercase;
  letter-spacing: 0.8px; margin-bottom: 8px; white-space: nowrap;
}
.ahorro-col-value {
  font-size: clamp(20px, 4.5vw, 38px); font-weight: 900; color: #ffffff;
  line-height: 1.1; text-shadow: 0 2px 12px rgba(0,0,0,0.2);
  font-family: 'Montserrat', sans-serif; text-align: center; white-space: nowrap;
}
.ahorro-col-value--anual {
  font-size: clamp(20px, 4.5vw, 38px); font-weight: 900;
  color: #ffffff !important; -webkit-text-fill-color: #ffffff !important;
  background: none !important; filter: none !important;
  white-space: nowrap; display: block; width: 100%; text-align: center;
}
.ahorro-divider {
  width: 1px; height: 56px;
  background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.4), transparent);
  flex-shrink: 0;
}
.ahorro-detail { margin-top: 12px; display: flex; justify-content: center; }
.ahorro-pct {
  display: inline-block; background: rgba(255,255,255,0.15); color: #ffffff;
  font-size: clamp(11px, 1.5vw, 13px); font-weight: 700; padding: 5px 14px;
  border-radius: 20px; backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.2); letter-spacing: 0.3px;
}
.ahorro-icon-anim { animation: pulse-green 2s ease-in-out infinite; font-size: 44px !important; width: 70px !important; height: 70px !important; }
@keyframes pulse-green {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16,185,129,0.5); }
  50%       { transform: scale(1.15); box-shadow: 0 0 0 10px rgba(16,185,129,0); }
}

/* ════════════════════════════════════════════════════════════════
   PAGOS
   ════════════════════════════════════════════════════════════════ */
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

/* ════════════════════════════════════════════════════════════════
   RESULTS GRID
   ════════════════════════════════════════════════════════════════ */
.results-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }

.result-card {
  background: linear-gradient(135deg, rgba(14,165,233,0.05), rgba(59,130,246,0.05));
  border: 2px solid rgba(14,165,233,0.2); border-radius: 20px; padding: 24px;
  display: flex; align-items: center; gap: 20px;
  transition: all 0.3s ease; animation: fadeInScale 0.5s ease-out;
}
.result-card:hover {
  transform: translateY(-5px); border-color: rgba(14,165,233,0.4);
  background: linear-gradient(135deg, rgba(14,165,233,0.1), rgba(59,130,246,0.1));
  box-shadow: 0 10px 30px rgba(14,165,233,0.2);
}

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

.result-icon {
  font-size: 40px; width: 60px; height: 60px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.9); border-radius: 16px; flex-shrink: 0;
}
.result-card.highlight .result-icon { background: rgba(255,255,255,0.95); }
.result-content { flex: 1; }
.result-label { font-size: 13px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
.result-card.highlight .result-label { color: rgba(255,255,255,0.9); font-size: 14px; margin-bottom: 12px; }
.result-value { font-size: 32px; font-weight: 800; color: #0ea5e9; line-height: 1; }
.result-card.highlight .result-value-large { font-size: 36px; font-weight: 900; color: #ffffff; line-height: 1; text-shadow: 0 2px 10px rgba(0,0,0,0.2); }
.unit { font-size: 18px; font-weight: 600; color: #64748b; margin-left: 4px; }

.breakdown {
  margin-top: 16px; display: flex; align-items: center; justify-content: center;
  gap: 12px; font-size: 14px; color: rgba(255,255,255,0.85); font-weight: 500; flex-wrap: wrap;
}
.breakdown-item { background: rgba(255,255,255,0.15); padding: 6px 12px; border-radius: 8px; backdrop-filter: blur(10px); }
.breakdown-separator { font-weight: 700; font-size: 16px; }

.share-options { margin-top: 20px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.share-btn {
  padding: 10px 16px; border: 2px solid rgba(255,255,255,0.3); border-radius: 10px;
  font-size: 12px; font-weight: 600; font-family: 'Montserrat', sans-serif;
  cursor: pointer; transition: all 0.3s ease; backdrop-filter: blur(10px);
  text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px;
}
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

.panel-glow {
  position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
  background: radial-gradient(circle at 30% 50%, rgba(14,165,233,0.08) 0%, transparent 50%);
  animation: rotate-glow 25s linear infinite; pointer-events: none;
}

.grafica-section { text-align: center; }
.pie-chart-container { margin: 20px 0; }
.grafica-hint { font-size: 14px; color: #10b981; font-weight: 600; margin-top: 12px; }

/* ── Toggle avanzados ── */
.advanced-toggle { text-align: center; margin: 4px 0; }
.toggle-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 22px;
  background: rgba(14,165,233,0.07);
  border: 2px solid rgba(14,165,233,0.25);
  border-radius: 30px; color: #0ea5e9;
  font-size: 13px; font-weight: 700; font-family: 'Montserrat', sans-serif;
  cursor: pointer; transition: all 0.25s ease; letter-spacing: 0.3px;
}
.toggle-btn:hover {
  background: rgba(14,165,233,0.14); border-color: rgba(14,165,233,0.5);
  transform: translateY(-1px); box-shadow: 0 4px 12px rgba(14,165,233,0.15);
}
.toggle-arrow { font-size: 11px; }

/* ── Animaciones ── */
@keyframes slideInUp  { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInScale { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
@keyframes rotate-glow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* ── Responsive ── */
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