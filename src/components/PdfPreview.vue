<template>
  <div>
    <!-- Botón visible solo si NO es shared link -->
    <button v-if="!isSharedLink" @click="imprimirPDF" class="pdf-btn">
      🖨️ Descargar PDF
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isSharedLink = ref(false)

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  isSharedLink.value = urlParams.has('data')
})

const imprimirPDF = () => {
  window.print()
}
</script>

<style scoped>
.pdf-btn {
  background: linear-gradient(135deg, #1e40af, #0891b2);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
  transition: all 0.2s ease;
}
.pdf-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.45);
}
</style>

<!-- ═══════════════════════════════════════════════════════════════
     CSS GLOBAL DE IMPRESIÓN — va fuera de <style scoped>
     para que afecte toda la página al hacer window.print()
     ═══════════════════════════════════════════════════════════════ -->
<style>
@media print {

  /* ── Ocultar elementos que NO deben ir en el PDF ── */
  .pdf-btn,
  .share-options,
  .share-btn,
  button,
  input,
  .consumo-input,
  .tarifa-input,
  .auto-input,
  .hbs-input,
  .adicionales-input,
  .pct-input,
  .input-section,
  .input-doble,
  .input-group,
  .section-title,
  .section-title-sm,
  .input-unit,
  .input-hint,
  .currency-symbol,
  .currency-symbol-blue,
  .no-data,
  nav,
  header,
  footer,
  .nav,
  .navbar,
  [class*="nav-"],
  [class*="sidebar"],
  [class*="menu"] {
    display: none !important;
  }

  /* ── Reset página ── */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
    font-size: 12px;
  }

  /* ── Cada panel ocupa su propio espacio limpio ── */
  .panel3,
  .panel8,
  [class*="panel"] {
    break-inside: avoid;
    page-break-inside: avoid;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 0 16px 0 !important;
    padding: 16px !important;
    box-shadow: none !important;
    border-radius: 12px !important;
  }

  /* ── Chart.js: fijar altura para que se vea completo ── */
  .chart-wrap,
  canvas {
    width: 100% !important;
    height: 280px !important;
    max-height: 280px !important;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  /* ── Tabla: no partir filas entre páginas ── */
  .tabla-flujo,
  .table-card {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  tr {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  /* ── KPIs: grid de 2 columnas en impresión ── */
  .kpi-grid,
  .kpi-section {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 8px !important;
  }

  /* ── Ahorro card en impresión ── */
  .result-card.ahorro-card {
    padding: 16px !important;
  }

  /* ── Resultados: 2 columnas en impresión ── */
  .results-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 8px !important;
  }

  /* ── Saltos de página explícitos entre secciones grandes ── */
  .panel8 {
    page-break-before: always;
  }

  /* ── Márgenes de página ── */
  @page {
    margin: 12mm 10mm;
    size: A4 portrait;
  }
}
</style>
