# 🎯 EJEMPLOS PRÁCTICOS DE CAMBIOS POR COMPONENTE

## Panel1.vue - Visualización Circular

### CAMBIO 1: SVG responsivo
```html
<!-- ANTES -->
<div class="energy-visualization mx-auto lg:mx-0">
  <svg viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg" class="w-64 h-64">

<!-- DESPUÉS -->
<div class="energy-visualization mx-auto lg:mx-0 w-full">
  <svg viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg" 
       class="w-40 sm:w-48 md:w-56 lg:w-64 h-40 sm:h-48 md:h-56 lg:h-64 mx-auto">
```

### CAMBIO 2: Grid de contenido
```html
<!-- ANTES -->
<div class="relative z-10 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 items-center">

<!-- DESPUÉS -->
<div class="relative z-10 grid grid-cols-1 lg:grid-cols-[300px_1fr] 
            gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center px-2 sm:px-4">
```

### CAMBIO 3: Texto responsivo en Panel1
En el `<style scoped>`, añade:

```css
@media (max-width: 640px) {
  /* Títulos más pequeños en móvil */
  h2 {
    font-size: 20px !important;
  }
  
  p {
    font-size: 13px !important;
  }
  
  /* Reducir espacios internos */
  .greeting-section {
    padding: 8px 0 !important;
  }
}

@media (max-width: 480px) {
  h2 {
    font-size: 18px !important;
  }
  
  p {
    font-size: 12px !important;
  }
  
  .greeting-section {
    padding: 6px 0 !important;
  }
}
```

---

## Panel6.vue - Full Width

### Cambio para componente full-width

```html
<!-- ANTES -->
<div class="panel-container p-8 space-y-6">

<!-- DESPUÉS -->
<div class="panel-container p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4 md:space-y-6 w-full">
  <!-- Asegurar que usa todo el ancho disponible -->
</div>
```

En CSS:
```css
.panel-container {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

@media (max-width: 640px) {
  .panel-container {
    padding: 12px !important;
  }
}
```

---

## ImageEditor.vue - Editor de Imágenes

### Hacer el editor responsivo

```html
<!-- ANTES - puede no ser responsive -->
<div class="editor-container">
  <canvas></canvas>
  <div class="toolbar">

<!-- DESPUÉS -->
<div class="editor-container w-full h-auto">
  <div class="editor-viewport w-full overflow-x-auto md:overflow-x-hidden">
    <canvas id="editor-canvas" class="max-w-full h-auto"></canvas>
  </div>
  
  <div class="toolbar flex flex-col sm:flex-row gap-2 sm:gap-4 w-full mt-4 
              flex-wrap sm:flex-nowrap">
    <!-- Botones -->
  </div>
</div>
```

CSS para ImageEditor:
```css
.editor-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.editor-viewport {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
}

@media (max-width: 640px) {
  .editor-container {
    gap: 8px;
  }
  
  .toolbar {
    flex-wrap: wrap;
  }
  
  .toolbar button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .editor-container {
    gap: 6px;
    padding: 8px;
  }
}
```

---

## Cotizador.vue - Formulario responsivo

### Estructura mejorada

```vue
<template>
  <div class="cotizador-wrapper w-full">
    <div class="cotizador p-4 md:p-6 lg:p-8 w-full 
                border border-gray-200 rounded-lg">
      <h3 class="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">
        Cotizador
      </h3>
      
      <form class="space-y-4 md:space-y-6" @submit.prevent="submit">
        <!-- Inputs con tamaño responsivo -->
        <div class="form-group w-full">
          <label class="text-sm md:text-base font-semibold mb-2 block">
            Consumo (kWh)
          </label>
          <input 
            v-model="consumo"
            type="number"
            class="w-full p-3 md:p-4 border rounded text-sm md:text-base
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese el consumo"
          />
        </div>
        
        <!-- Botones responsivos -->
        <button 
          type="submit"
          class="w-full md:w-auto px-6 md:px-8 py-3 md:py-4
                 bg-blue-600 text-white rounded text-sm md:text-base
                 hover:bg-blue-700 transition"
        >
          Calcular
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.cotizador-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.cotizador {
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.form-group {
  display: flex;
  flex-direction: column;
}

@media (max-width: 640px) {
  .cotizador {
    padding: 12px !important;
    border-radius: 8px;
  }
  
  h3 {
    font-size: 18px !important;
  }
  
  input, button {
    font-size: 16px; /* Prevenir zoom iOS */
    min-height: 44px;
  }
}

@media (max-width: 480px) {
  .cotizador {
    padding: 8px !important;
  }
  
  h3 {
    font-size: 16px !important;
  }
  
  button {
    width: 100% !important;
  }
}
</style>
```

---

## PdfPreview.vue - Vista previa de PDF

### Hacerlo responsivo

```vue
<template>
  <div class="pdf-preview-wrapper w-full">
    <div class="pdf-container p-4 md:p-6 lg:p-8 w-full">
      <h3 class="text-lg md:text-xl lg:text-2xl font-bold mb-4 md:mb-6">
        Vista Previa PDF
      </h3>
      
      <div class="pdf-viewer overflow-x-auto md:overflow-x-hidden 
                  bg-gray-100 rounded-lg p-4 md:p-6">
        <div id="pdf-render" class="w-full"></div>
      </div>
      
      <div class="controls flex flex-col sm:flex-row gap-2 sm:gap-4 
                  mt-4 md:mt-6 justify-center sm:justify-start flex-wrap">
        <button @click="previousPage" class="px-4 md:px-6 py-2 md:py-3 
                rounded bg-gray-200 text-sm md:text-base">
          Anterior
        </button>
        <span class="self-center text-sm md:text-base">
          Página {{ currentPage }} de {{ totalPages }}
        </span>
        <button @click="nextPage" class="px-4 md:px-6 py-2 md:py-3 
                rounded bg-gray-200 text-sm md:text-base">
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pdf-preview-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.pdf-container {
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.pdf-viewer {
  width: 100%;
  max-height: 600px;
  border-radius: 8px;
}

.controls {
  display: flex;
  align-items: center;
  justify-content: center;
}

.controls button {
  cursor: pointer;
  transition: all 0.2s ease;
}

.controls button:hover {
  background-color: #d1d5db;
}

@media (max-width: 640px) {
  .pdf-container {
    padding: 12px !important;
  }
  
  h3 {
    font-size: 18px !important;
  }
  
  .pdf-viewer {
    max-height: 400px;
    padding: 8px !important;
  }
  
  .controls {
    flex-wrap: wrap;
    gap: 8px !important;
  }
  
  .controls button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .pdf-container {
    padding: 8px !important;
  }
  
  h3 {
    font-size: 16px !important;
  }
  
  .pdf-viewer {
    max-height: 300px;
  }
}
</style>
```

---

## Panel2, Panel3, Panel4, Panel5, Panel7, Panel8

### Template base responsivo para todos

```html
<!-- ESTRUCTURA GENERAL PARA TODOS LOS PANELES -->

<template>
  <div class="panel-wrapper">
    <div class="panel-content p-4 sm:p-6 md:p-8 space-y-4 md:space-y-6">
      
      <!-- Header del panel -->
      <div class="panel-header mb-4 md:mb-6">
        <h2 class="text-lg sm:text-xl md:text-2xl lg:text-3xl 
                   font-bold mb-2 md:mb-3">
          Título del Panel
        </h2>
        <p class="text-sm sm:text-base text-gray-600">
          Descripción
        </p>
      </div>
      
      <!-- Contenido principal -->
      <div class="panel-main space-y-3 md:space-y-4">
        <!-- Contenido aquí -->
      </div>
      
    </div>
  </div>
</template>

<style scoped>
.panel-wrapper {
  width: 100%;
  height: 100%;
}

.panel-content {
  width: 100%;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.panel-header {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 12px;
}

@media (max-width: 640px) {
  .panel-content {
    padding: 12px !important;
  }
  
  .panel-header {
    margin-bottom: 12px !important;
  }
  
  h2 {
    font-size: 18px !important;
  }
  
  p {
    font-size: 12px !important;
  }
}

@media (max-width: 480px) {
  .panel-content {
    padding: 8px !important;
    border-radius: 8px;
  }
  
  h2 {
    font-size: 16px !important;
  }
  
  p {
    font-size: 11px !important;
  }
}

/* Hover effect responsivo */
@media (hover: hover) {
  .panel-content:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  }
}
</style>
```

---

## Checklist de Cambios

Para cada archivo Panel[1-8].vue:
- [ ] Cambiar tamaños de SVG a: `w-40 sm:w-48 md:w-56 lg:w-64`
- [ ] Cambiar padding a: `p-4 sm:p-6 md:p-8`
- [ ] Cambiar gap a: `gap-3 md:gap-4 lg:gap-6`
- [ ] Cambiar tamaños de fuente con `sm:`, `md:`, `lg:` prefixes
- [ ] Añadir media queries en CSS scoped para valores < 640px
- [ ] Testear en móvil con DevTools

---

## Referencia rápida de Tailwind Responsive

```html
<!-- Padding Responsive -->
p-4 md:p-6 lg:p-8        <!-- 16px → 24px → 32px -->
px-4 md:px-6 lg:px-8     <!-- Solo horizontal -->
py-4 md:py-6 lg:py-8     <!-- Solo vertical -->

<!-- Margin Responsive -->
m-4 md:m-6 lg:m-8
mx-auto md:mx-0           <!-- Center → left align -->
my-4 md:my-6             <!-- Solo vertical -->

<!-- Gap Responsive -->
gap-3 md:gap-4 lg:gap-6  <!-- 12px → 16px → 24px -->

<!-- Text Responsive -->
text-sm md:text-base lg:text-lg
text-xs md:text-sm lg:text-base

<!-- Width Responsive -->
w-full                    <!-- Siempre 100% -->
w-40 md:w-48 lg:w-64    <!-- Escalado progresivo -->

<!-- Display Responsive -->
flex-col md:flex-row      <!-- Vertical → Horizontal -->
hidden md:block           <!-- Oculto en móvil → Visible -->

<!-- Grid Responsive -->
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```
