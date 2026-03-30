<template>
  <div class="panel-container">
    <div class="panel-header" @click="toggleExpand">
      <div class="header-content">
        <h2 class="panel-title">¿Qué incluye tu sistema solar?</h2>
        <p class="panel-subtitle">Descubre cada elemento que hace posible tu energía limpia</p>
      </div>
      <div class="arrow-wrapper" :class="{ expanded: isExpanded }">
        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>

    <transition name="expand-height">
      <div v-if="isExpanded" class="components-container">
        <div
          v-for="(component, index) in components"
          :key="index"
          class="component-card"
          :class="{ 'active-card': activeGallery === index }"
          :style="{ '--delay': `${index * 100}ms` }"
          @mouseenter="hoveredComponent = index"
          @mouseleave="hoveredComponent = null"
          @click="handleCardClick(index)"
        >
          <div class="icon-bubble">{{ component.icon }}</div>

          <div class="card-background">
            <div class="gradient-blob blob-1"></div>
            <div class="gradient-blob blob-2"></div>
          </div>

          <div class="card-content">
            <div class="component-number">
              <span class="number-text">{{ index + 1 }}</span>
              <svg class="circle-svg" viewBox="0 0 100 100">
                <circle class="circle-background" cx="50" cy="50" r="45"/>
                <circle class="circle-progress" cx="50" cy="50" r="45"/>
              </svg>
            </div>

            <div class="card-text">
              <h3 class="component-name">{{ component.name }}</h3>
              <p class="component-description">{{ component.description }}</p>
              <span v-if="component.warranty" class="warranty-badge">
                🛡️ Garantía {{ component.warranty }}
              </span>
              <span v-if="component.hasGallery" class="gallery-badge-indicator">
                🖼️ Ver imágenes
              </span>
            </div>
          </div>

          <div class="card-line"></div>
        </div>
      </div>
    </transition>

    <!-- GALERÍA DE IMÁGENES TÉCNICAS -->
    <transition name="expand-height">
      <div v-if="isExpanded && activeGallery === 2" class="gallery-section">
        <div class="gallery-header">
          <div class="gallery-title-row">
            <span class="gallery-icon-title">🏗️</span>
            <h3 class="gallery-title">Tipo de estructura a instalar</h3>
            <span class="gallery-badge" v-if="!isSharedView">
              {{ selectedImages.length }} seleccionada{{ selectedImages.length !== 1 ? 's' : '' }}
            </span>
          </div>
          <p class="gallery-subtitle">
            {{ isSharedView
              ? '🏗️ Imágenes de estructura INCLUIDAS en tu sistema solar'
              : 'Selecciona las imágenes que deseas mostrar al cliente en el enlace compartido'
            }}
          </p>
        </div>

        <!-- MODO ADMINISTRADOR: grid con selección -->
        <div v-if="!isSharedView" class="gallery-grid">
          <div
            v-for="img in galleryImages"
            :key="img.id"
            class="gallery-item"
            :class="{ selected: isSelected(img.id) }"
            @click.stop="toggleSelect(img.id)"
          >
            <div class="gallery-item-inner">
              <img
                :src="img.src"
                :alt="img.label"
                class="gallery-img"
                loading="lazy"
              />
              <div class="gallery-overlay">
                <div class="gallery-check" v-if="isSelected(img.id)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="gallery-select-hint" v-else>
                  <span>Seleccionar</span>
                </div>
              </div>
            </div>
            <div class="gallery-item-label">{{ img.label }}</div>
          </div>
        </div>

        <!-- MODO CLIENTE: solo muestra las seleccionadas -->
        <div v-else class="gallery-grid client-view">
          <div
            v-for="img in clientImages"
            :key="img.id"
            class="gallery-item client-item"
            @click.stop="openLightbox(img)"
          >
            <div class="gallery-item-inner">
              <img
                :src="img.src"
                :alt="img.label"
                class="gallery-img"
                loading="lazy"
              />
              <div class="gallery-overlay client-overlay">
                <span class="zoom-hint">🔍 Ver ampliada</span>
              </div>
            </div>
            <div class="gallery-item-label">{{ img.label }}</div>
          </div>

          <div v-if="clientImages.length === 0" class="gallery-empty">
            <span>🏗️</span>
            <p>No hay estructuras seleccionadas para este proyecto</p>
          </div>
        </div>

        <!-- Acciones (solo admin) -->
        <div v-if="!isSharedView" class="gallery-actions">
          <button class="gallery-btn-clear" @click.stop="clearSelection" v-if="selectedImages.length > 0">
            ✕ Limpiar selección
          </button>
          <button class="gallery-btn-select-all" @click.stop="selectAll">
            ☑ Seleccionar todas
          </button>
          <span class="gallery-hint">Las imágenes seleccionadas se incluirán en el enlace del cliente</span>
        </div>
      </div>
    </transition>

    <!-- LIGHTBOX ULTRA SIMPLE -->
    <div v-if="lightboxImg" class="lightbox-simple" @click="lightboxImg = null">
      <div class="lightbox-content" @click.stop>
        <button class="close-btn" @click="lightboxImg = null">✕</button>
        <img :src="lightboxImg.src" :alt="lightboxImg.label" />
      </div>
    </div>
  </div>
</template>

<script>
// ─── IMPORTAR IMÁGENES DESDE src/assets/ (Vite resuelve las rutas correctamente) ───
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
import { useCotizacionStore } from '../store/cotizacion.js'

export default {
  name: 'Panel4',
  props: {
    isSharedView: {
      type: Boolean,
      default: false
    },
    sharedImages: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isExpanded: false,
      hoveredComponent: null,
      activeGallery: null,
      selectedImages: [],
      lightboxImg: null,
      lightboxError: null,
      lightboxLoading: false,
      components: [
        {
          name: 'Paneles Solares',
          description: 'Capturan la energía del sol y la convierten en electricidad para tu hogar',
          icon: '☀️',
          warranty: '12 años',
          hasGallery: false
        },
        {
          name: 'Inversor Solar',
          description: 'Convierte la energía DC en AC para alimentar todos tus equipos',
          icon: '⚡',
          warranty: '5 años',
          hasGallery: false
        },
        {
          name: 'Estructura en Aluminio',
          description: 'Soporte resistente y duradero para tus paneles. Haz clic para ver los tipos de estructura disponibles.',
          icon: '🏗️',
          warranty: '4 años',
          hasGallery: true
        },
        {
          name: 'Protecciones, Cableado y Tubería',
          description: 'Seguridad eléctrica y circulación óptima de energía',
          icon: '🔒',
          warranty: '2 años',
          hasGallery: false
        },
        {
          name: 'Medidor Bidireccional',
          description: 'Monitorea el flujo de energía en ambas direcciones',
          icon: '📊',
          warranty: null,
          hasGallery: false
        },
        {
          name: 'Diseño, Retie y Legalización',
          description: 'Trámites y documentación completamente gestionados',
          icon: '📋',
          warranty: null,
          hasGallery: false
        },
        {
          name: 'Capacitación y Monitoreo',
          description: 'Aprende a usar tu sistema y mantén el control total',
          icon: '🎓',
          warranty: null,
          hasGallery: false
        }
      ],
      // ── Las imágenes se asignan con los imports de Vite ──
      galleryImages: [
        { id: 'img-01',  src: img01,  label: 'Estructura 1'  },
        { id: 'img-02',  src: img02,  label: 'Estructura 2'  },
        { id: 'img-03',  src: img03,  label: 'Estructura 3'  },
        { id: 'img-04',  src: img04,  label: 'Estructura 4'  },
        { id: 'img-05',  src: img05,  label: 'Estructura 5'  },
        { id: 'img-06',  src: img06,  label: 'Estructura 6'  },
        { id: 'img-07',  src: img07,  label: 'Estructura 7'  },
        { id: 'img-08',  src: img08,  label: 'Estructura 8'  },
        { id: 'img-09',  src: img09,  label: 'Estructura 9'  },
        { id: 'img-010', src: img010, label: 'Estructura 10' }
      ]
    }
  },
  computed: {
    structureImages() {
      const cotizacionStore = useCotizacionStore()
      return cotizacionStore.structureImages || []
    },
    clientImages() {
      let imgs = []
      
      if (this.isSharedView) {
        // VISTA CLIENTE: Obtener imágenes seleccionadas
        
        // Método 1: Desde structureImages del store
        if (this.structureImages && this.structureImages.length > 0) {
          this.structureImages.forEach(storeImg => {
            const galleryImg = this.galleryImages.find(g => g.id === storeImg.id)
            if (galleryImg) {
              imgs.push(galleryImg) // Usar siempre la imagen original
            }
          })
        }
        // Método 2: Desde sharedImages (prop)
        else if (this.sharedImages && this.sharedImages.length > 0) {
          this.sharedImages.forEach(storeImg => {
            const galleryImg = this.galleryImages.find(g => g.id === storeImg.id)
            if (galleryImg) {
              imgs.push(galleryImg) // Usar siempre la imagen original
            }
          })
        }
        // Método 3: Desde selectedImages (fallback)
        else if (this.selectedImages && this.selectedImages.length > 0) {
          this.selectedImages.forEach(id => {
            const galleryImg = this.galleryImages.find(g => g.id === id)
            if (galleryImg) {
              imgs.push(galleryImg) // Usar siempre la imagen original
            }
          })
        }
      } else {
        // VISTA ADMIN: Mostrar imágenes seleccionadas
        imgs = this.galleryImages.filter(img => this.isSelected(img.id))
      }
      
      return imgs
    }
  },
  mounted() {
    // Vista compartida: cargar selectedImages desde structureImages prop o localStorage
    if (this.isSharedView) {
      if (this.structureImages && this.structureImages.length > 0) {
        this.selectedImages = this.structureImages.map(img => img.id)
      } else if (this.sharedImages && this.sharedImages.length > 0) {
        this.selectedImages = this.sharedImages.map(img => img.id)
      }
    } else {
      // Vista normal/admin: cargar desde localStorage
      try {
        const saved = localStorage.getItem('panel4_selected_images')
        if (saved) {
          this.selectedImages = JSON.parse(saved)
        }
      } catch (_) {}
    }

    window.addEventListener('panel4-load-images', this.handleLoadImages)
    window.addEventListener('panel4-get-selected', this.handleGetSelected)
    
    // Si es vista compartida y hay imágenes, abrir la galería automáticamente
    if (this.isSharedView && (this.clientImages.length > 0)) {
      this.isExpanded = true
      this.activeGallery = 2
    }
  },
  beforeUnmount() {
    window.removeEventListener('panel4-load-images', this.handleLoadImages)
    window.removeEventListener('panel4-get-selected', this.handleGetSelected)
  },
  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded
      if (!this.isExpanded) {
        this.activeGallery = null
      }
    },

    handleCardClick(index) {
      if (index === 2) {
        this.activeGallery = this.activeGallery === 2 ? null : 2
      }
    },

    isSelected(id) {
      return this.selectedImages.includes(id)
    },

    toggleSelect(id) {
      const idx = this.selectedImages.indexOf(id)
      if (idx === -1) {
        this.selectedImages.push(id)
      } else {
        this.selectedImages.splice(idx, 1)
      }
      this.persistSelection()
      this.emitSelectedImages()
    },

    clearSelection() {
      this.selectedImages = []
      this.persistSelection()
      this.emitSelectedImages()
    },

    selectAll() {
      this.selectedImages = this.galleryImages.map(img => img.id)
      this.persistSelection()
      this.emitSelectedImages()
    },

    persistSelection() {
      try {
        localStorage.setItem('panel4_selected_images', JSON.stringify(this.selectedImages))
      } catch (_) {}
    },

    emitSelectedImages() {
      // ── IMPORTANTE: emitimos siempre las URLs de los imports estáticos de Vite ──
      const selected = this.galleryImages
        .filter(img => this.isSelected(img.id))
        .map(img => ({ 
          id: img.id, 
          src: img.src, // Siempre usar la src del import estático
          label: img.label 
        }))

      // Actualizar el store con las imágenes correctas
      const cotizacionStore = useCotizacionStore()
      cotizacionStore.updateStructureImages(selected)

      window.dispatchEvent(new CustomEvent('panel4-images-updated', {
        detail: { selectedImages: selected }
      }))
    },

    handleLoadImages(e) {
      if (!e.detail) return

      // Si vienen imágenes completas con src, actualizar los srcs locales
      if (e.detail.selectedImages && e.detail.selectedImages.length > 0) {
        e.detail.selectedImages.forEach(si => {
          const found = this.galleryImages.find(g => g.id === si.id)
          if (found && si.src) found.src = si.src
        })
        this.selectedImages = e.detail.selectedImages.map(si => si.id)
      }

      if (e.detail.selectedImageIds) {
        this.selectedImages = e.detail.selectedImageIds
      }

      // Abrir automáticamente la galería en vista cliente
      if (
        this.isSharedView &&
        (
          this.selectedImages.length > 0 ||
          (e.detail.selectedImages && e.detail.selectedImages.length > 0)
        )
      ) {
        this.isExpanded = true
        this.activeGallery = 2
      }
    },

    handleGetSelected() {
      this.emitSelectedImages()
    },

    openLightbox(img) {
      console.log('Opening lightbox with:', img)
      
      // Asignar directamente la imagen
      if (img && img.src) {
        this.lightboxImg = img
      } else {
        // Buscar en galleryImages si no hay src
        const found = this.galleryImages.find(g => g.id === img.id)
        if (found) {
          this.lightboxImg = found
        }
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');

* { box-sizing: border-box; }

.panel-container {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  animation: slideInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e9ecef;
}

@keyframes slideInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ── HEADER ── */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 40px;
  background: linear-gradient(135deg, #F5B027 0%, #E89B1C 100%);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}
.panel-header::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s;
}
.panel-header:hover::before { left: 100%; }
.panel-header:hover { box-shadow: inset 0 0 30px rgba(255,255,255,0.2); transform: translateY(-2px); }

.header-content { flex: 1; text-align: center; }

.panel-title {
  margin: 0;
  font-size: 24px; font-weight: 700;
  color: #1a1a1a; letter-spacing: -0.5px;
  animation: fadeInLeft 0.6s ease-out;
  font-family: 'Montserrat', sans-serif;
}
.panel-subtitle {
  margin: 8px 0 0 0;
  font-size: 14px; color: rgba(26,26,26,0.7);
  animation: fadeInLeft 0.6s ease-out 0.1s both;
  font-family: 'Montserrat', sans-serif;
}

@keyframes fadeInLeft {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

.arrow-wrapper {
  display: flex; align-items: center; justify-content: center;
  width: 50px; height: 50px;
  background: rgba(255,255,255,0.6); border-radius: 50%;
  margin-left: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0; position: absolute; right: 30px;
}
.arrow-wrapper:hover { background: rgba(255,255,255,0.9); transform: scale(1.1); }
.arrow-wrapper.expanded { background: rgba(26,26,26,0.15); }
.arrow-icon { width: 28px; height: 28px; color: #1a1a1a; transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.arrow-wrapper.expanded .arrow-icon { transform: rotate(180deg); }

/* ── COMPONENTS GRID ── */
.components-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px; padding: 40px;
  background: linear-gradient(180deg, rgba(31,44,81,0.02) 0%, rgba(26,35,64,0.02) 100%);
}

.component-card {
  position: relative;
  background: white; border-radius: 16px; padding: 24px;
  overflow: visible; cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: scaleInCard 0.5s ease-out;
  animation-delay: var(--delay); animation-fill-mode: both;
  border: 2px solid transparent; min-height: 180px;
  display: flex; flex-direction: column;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}
@keyframes scaleInCard {
  from { opacity: 0; transform: scale(0.85) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.component-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: #1f2c51;
  box-shadow: 0 20px 50px rgba(31,44,81,0.15), 0 0 30px rgba(76,175,80,0.1);
}
.component-card.active-card {
  border-color: #F5B027;
  box-shadow: 0 20px 50px rgba(245,176,39,0.25);
  transform: translateY(-4px);
}

.gallery-badge-indicator {
  display: inline-flex; align-items: center; gap: 4px;
  margin-top: 6px; padding: 4px 10px;
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
  border: 1px solid #F5B027; border-radius: 20px;
  font-size: 11px; font-weight: 600; color: #856404;
  font-family: 'Montserrat', sans-serif; width: fit-content;
  transition: all 0.3s ease;
}
.component-card:hover .gallery-badge-indicator,
.component-card.active-card .gallery-badge-indicator {
  background: linear-gradient(135deg, #F5B027, #E89B1C);
  color: #1a1a1a;
  box-shadow: 0 2px 8px rgba(245,176,39,0.4);
}

.icon-bubble {
  position: absolute; top: -15px; right: -15px;
  width: 70px; height: 70px;
  background: linear-gradient(135deg, #e3f2fd, #f3e5f5);
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.component-card:hover .icon-bubble { transform: rotate(15deg) scale(1.1); background: linear-gradient(135deg, #bbdefb, #e1bee7); }

.card-background { position: absolute; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden; border-radius: 16px; }
.gradient-blob { position: absolute; border-radius: 50%; opacity: 0.08; animation: float 6s ease-in-out infinite; }
.blob-1 { width: 120px; height: 120px; background: linear-gradient(135deg, #1f2c51, #2d3f6e); top: -30px; right: -30px; }
.blob-2 { width: 100px; height: 100px; background: linear-gradient(135deg, #4caf50, #66bb6a); bottom: -40px; left: -40px; animation: float 8s ease-in-out infinite reverse; }
@keyframes float { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(10px,-10px); } }
.component-card:hover .gradient-blob { opacity: 0.12; }

.card-content { position: relative; z-index: 2; display: flex; align-items: flex-start; gap: 16px; }
.component-number { position: relative; width: 60px; height: 60px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.number-text { position: relative; z-index: 2; font-size: 24px; font-weight: 700; background: linear-gradient(135deg, #1f2c51, #1a2340); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-family: 'Montserrat', sans-serif; }
.circle-svg { position: absolute; width: 100%; height: 100%; transform: rotate(-90deg); top: 0; left: 0; }
.circle-background { fill: none; stroke: #f0f0f0; stroke-width: 2; }
.circle-progress { fill: none; stroke: #1f2c51; stroke-width: 2; stroke-dasharray: 283; stroke-dashoffset: 283; transition: stroke-dashoffset 0.6s ease-out; animation: fillCircle 1s ease-out forwards; animation-delay: var(--delay); }
@keyframes fillCircle { from { stroke-dashoffset: 283; } to { stroke-dashoffset: 0; } }
.component-card:hover .circle-progress { stroke-dashoffset: 0; filter: drop-shadow(0 0 8px rgba(31,44,81,0.6)); }

.card-text { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.component-name { margin: 0; font-size: 16px; font-weight: 600; color: #1a1a1a; transition: color 0.3s; font-family: 'Montserrat', sans-serif; }
.component-card:hover .component-name { color: #1f2c51; }
.component-description { margin: 0; font-size: 13px; color: rgba(26,26,26,0.6); line-height: 1.5; transition: color 0.3s; font-family: 'Montserrat', sans-serif; }
.component-card:hover .component-description { color: rgba(26,26,26,0.8); }

.warranty-badge {
  display: inline-flex; align-items: center; gap: 4px;
  margin-top: 6px; padding: 4px 10px;
  background: linear-gradient(135deg, #e8edf5, #eef1f8);
  border: 1px solid #a0afc8; border-radius: 20px;
  font-size: 11px; font-weight: 600; color: #1f2c51;
  font-family: 'Montserrat', sans-serif; width: fit-content;
  transition: all 0.3s ease; box-shadow: 0 2px 6px rgba(31,44,81,0.15);
}
.component-card:hover .warranty-badge { background: linear-gradient(135deg, #d0d9ee, #dce3f2); box-shadow: 0 4px 12px rgba(31,44,81,0.25); transform: translateY(-1px); }

.card-line { position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, transparent, #1f2c51, #4caf50, transparent); opacity: 0; transition: opacity 0.3s; }
.component-card:hover .card-line { opacity: 1; animation: slideLineAnimation 0.6s ease-out; }
.component-card.active-card .card-line { opacity: 1; background: linear-gradient(90deg, transparent, #F5B027, #E89B1C, transparent); }
@keyframes slideLineAnimation { from { transform: scaleX(0); } to { transform: scaleX(1); } }

/* ═══════════════════════════════════════════════════════════════ */
/* GALERÍA                                                        */
/* ═══════════════════════════════════════════════════════════════ */
.gallery-section {
  padding: 0 40px 40px;
  background: linear-gradient(180deg, rgba(31,44,81,0.02) 0%, rgba(26,35,64,0.02) 100%);
  border-top: 2px dashed rgba(245,176,39,0.35);
  animation: scaleInCard 0.4s ease-out;
}

.gallery-header {
  padding: 28px 0 20px;
}
.gallery-title-row {
  display: flex; align-items: center; gap: 12px; margin-bottom: 8px; flex-wrap: wrap;
}
.gallery-icon-title { font-size: 24px; }
.gallery-title {
  margin: 0; font-size: 20px; font-weight: 800; color: #1f2c51;
  font-family: 'Montserrat', sans-serif; letter-spacing: -0.3px;
}
.gallery-badge {
  background: linear-gradient(135deg, #F5B027, #E89B1C);
  color: #1a1a1a; font-size: 12px; font-weight: 700;
  padding: 4px 12px; border-radius: 20px;
  font-family: 'Montserrat', sans-serif;
  box-shadow: 0 2px 8px rgba(245,176,39,0.4);
}
.gallery-subtitle {
  margin: 0; font-size: 13px; color: rgba(31,44,81,0.55);
  font-family: 'Montserrat', sans-serif; line-height: 1.5;
}

/* GRID DE GALERÍA */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}
.gallery-grid.client-view {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.gallery-item {
  border-radius: 12px; overflow: hidden;
  cursor: pointer; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 3px solid transparent;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  background: #fff;
}
.gallery-item:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 12px 32px rgba(31,44,81,0.18); }
.gallery-item.selected {
  border-color: #F5B027;
  box-shadow: 0 8px 28px rgba(245,176,39,0.35);
  transform: translateY(-2px);
}

.gallery-item-inner {
  position: relative; width: 100%; aspect-ratio: 4/3; overflow: hidden; background: #f1f5f9;
}

.gallery-img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.4s ease; display: block;
}
.gallery-item:hover .gallery-img { transform: scale(1.06); }

.gallery-overlay {
  position: absolute; inset: 0;
  background: rgba(31,44,81,0.0);
  display: flex; align-items: center; justify-content: center;
  transition: background 0.3s ease;
}
.gallery-item:hover .gallery-overlay { background: rgba(31,44,81,0.32); }
.gallery-item.selected .gallery-overlay { background: rgba(245,176,39,0.25); }
.gallery-item.selected:hover .gallery-overlay { background: rgba(245,176,39,0.4); }

.gallery-check {
  width: 44px; height: 44px; border-radius: 50%;
  background: #F5B027; display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 14px rgba(245,176,39,0.6);
  animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.gallery-check svg { width: 22px; height: 22px; color: #1a1a1a; }
@keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }

.gallery-select-hint {
  opacity: 0; transform: translateY(6px);
  transition: all 0.25s ease;
  background: rgba(255,255,255,0.95); border-radius: 8px;
  padding: 6px 14px; font-size: 12px; font-weight: 700;
  color: #1f2c51; font-family: 'Montserrat', sans-serif;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
}
.gallery-item:hover .gallery-select-hint { opacity: 1; transform: translateY(0); }
.gallery-item.selected .gallery-select-hint { display: none; }

.client-overlay { background: rgba(31,44,81,0); }
.client-item:hover .client-overlay { background: rgba(31,44,81,0.45); }
.zoom-hint {
  opacity: 0; font-size: 13px; font-weight: 700; color: #fff;
  font-family: 'Montserrat', sans-serif; letter-spacing: 0.3px;
  background: rgba(31,44,81,0.8); padding: 8px 16px; border-radius: 8px;
  transition: opacity 0.25s ease;
}
.client-item:hover .zoom-hint { opacity: 1; }

.gallery-item-label {
  padding: 8px 10px 10px;
  font-size: 11px; font-weight: 600; color: #64748b;
  font-family: 'Montserrat', sans-serif;
  text-align: center; letter-spacing: 0.3px;
}
.gallery-item.selected .gallery-item-label { color: #c8870a; font-weight: 700; }

.gallery-empty {
  grid-column: 1 / -1; text-align: center;
  padding: 48px 20px; color: #94a3b8;
  font-family: 'Montserrat', sans-serif;
}
.gallery-empty span { font-size: 48px; display: block; margin-bottom: 12px; opacity: 0.5; }
.gallery-empty p { font-size: 15px; font-weight: 500; }

/* ACCIONES */
.gallery-actions {
  display: flex; align-items: center; gap: 12px;
  margin-top: 20px; flex-wrap: wrap;
}
.gallery-btn-clear {
  padding: 9px 18px; border-radius: 10px; border: 2px solid #ef4444;
  background: rgba(239,68,68,0.06); color: #ef4444;
  font-size: 12px; font-weight: 700; font-family: 'Montserrat', sans-serif;
  cursor: pointer; transition: all 0.25s ease; letter-spacing: 0.3px;
}
.gallery-btn-clear:hover { background: rgba(239,68,68,0.12); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(239,68,68,0.2); }

.gallery-btn-select-all {
  padding: 9px 18px; border-radius: 10px; border: 2px solid #1f2c51;
  background: rgba(31,44,81,0.06); color: #1f2c51;
  font-size: 12px; font-weight: 700; font-family: 'Montserrat', sans-serif;
  cursor: pointer; transition: all 0.25s ease; letter-spacing: 0.3px;
}
.gallery-btn-select-all:hover { background: rgba(31,44,81,0.12); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(31,44,81,0.15); }

.gallery-hint {
  font-size: 12px; color: rgba(31,44,81,0.45); font-family: 'Montserrat', sans-serif;
  font-style: italic; margin-left: auto;
}

/* ── LIGHTBOX CORREGIDA ── */
.lightbox-backdrop {
  position: fixed; inset: 0; z-index: 9998;
  background: rgba(0,0,0,0.95); backdrop-filter: blur(20px);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}

.lightbox-error {
  color: #ff6b6b; font-size: 18px; font-weight: 600;
  text-align: center; padding: 20px; max-width: 400px;
}

.lightbox-loading {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  color: #fff; gap: 16px; min-height: 200px;
}

.spinner {
  width: 48px; height: 48px; border: 4px solid rgba(255,255,255,0.2);
  border-top: 4px solid #fff; border-radius: 50%;
  animation: spin 1s linear infinite;
}
.lightbox-container {
  position: relative; max-width: 95vw; max-height: 95vh; min-height: 200px;
  border-radius: 8px; overflow: hidden;
  box-shadow: 0 0 0 9999px rgba(0,0,0,0.95), 0 40px 100px rgba(0,0,0,0.8);
  animation: popIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  background: #111;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.lightbox-img {
  display: block; max-width: 95vw; max-height: 85vh; width: auto; height: auto;
  object-fit: contain; background: #000;
  animation: fadeInImg 0.3s ease-out;
}
@keyframes fadeInImg {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.lightbox-close {
  position: absolute; top: 16px; right: 16px; z-index: 10001;
  width: 48px; height: 48px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.9);
  background: rgba(255,255,255,0.25); color: #fff; cursor: pointer; font-size: 20px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; backdrop-filter: blur(20px);
  transition: all 0.25s ease; box-shadow: 0 4px 20px rgba(0,0,0,0.5);
}
.lightbox-close:hover { background: rgba(255,255,255,0.4); transform: scale(1.1); box-shadow: 0 6px 25px rgba(0,0,0,0.6); }
.lightbox-close:active { transform: scale(0.95); }
.lightbox-label {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: rgba(0,0,0,0.6); color: #fff; text-align: center;
  padding: 10px 16px; font-size: 13px; font-weight: 600;
  font-family: 'Montserrat', sans-serif; backdrop-filter: blur(8px);
}

/* ── TRANSITIONS ── */
.expand-height-enter-active, .expand-height-leave-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: top center;
}
.expand-height-enter-from, .expand-height-leave-to {
  opacity: 0; max-height: 0; overflow: hidden;
  transform: perspective(600px) rotateX(90deg);
}
.expand-height-enter-to, .expand-height-leave-from {
  opacity: 1; max-height: 9999px;
  transform: perspective(600px) rotateX(0deg);
}

.fade-lightbox-enter-active, .fade-lightbox-leave-active { transition: opacity 0.25s ease; }
.fade-lightbox-enter-from, .fade-lightbox-leave-to { opacity: 0; }

/* ── RESPONSIVE ── */
@media (max-width: 1200px) {
  .components-container { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); padding: 30px; gap: 18px; }
  .gallery-section { padding: 0 30px 30px; }
  .gallery-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
}
@media (max-width: 992px) {
  .panel-header { padding: 25px 30px; }
  .panel-title { font-size: 22px; }
  .panel-subtitle { font-size: 13px; }
  .arrow-wrapper { width: 45px; height: 45px; right: 25px; }
  .arrow-icon { width: 24px; height: 24px; }
  .components-container { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); padding: 25px; gap: 16px; }
  .component-card { padding: 20px; min-height: 130px; }
  .gallery-section { padding: 0 25px 25px; }
}
@media (max-width: 768px) {
  .panel-header { padding: 16px 12px; flex-direction: column; text-align: center; }
  .header-content { margin-bottom: 12px; }
  .arrow-wrapper { position: static; margin-left: 0; margin-top: 8px; }
  .panel-title { font-size: 16px; }
  .panel-subtitle { font-size: 11px; }
  .components-container { grid-template-columns: 1fr; padding: 16px; gap: 12px; }
  .component-card { padding: 12px; min-height: 100px; }
  .component-number { width: 40px; height: 40px; }
  .number-text { font-size: 14px; }
  .component-name { font-size: 12px; }
  .component-description { font-size: 10px; }
  .icon-bubble { width: 50px; height: 50px; font-size: 20px; top: -8px; right: -8px; }
  .warranty-badge { font-size: 9px; padding: 3px 7px; }
  .gallery-section { padding: 0 16px 16px; }
  .gallery-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; }
  .gallery-title { font-size: 16px; }
  .gallery-actions { flex-direction: column; align-items: flex-start; }
  .gallery-hint { margin-left: 0; }
}
@media (max-width: 480px) {
  .gallery-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .gallery-grid.client-view { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 360px) {
  .panel-container { border-radius: 8px; }
  .panel-header { padding: 10px 8px; }
  .panel-title { font-size: 12px; }
  .panel-subtitle { font-size: 7px; }
  .components-container { padding: 8px; gap: 6px; }
  .component-card { padding: 6px; border-radius: 4px; min-height: 70px; }
  .gallery-section { padding: 0 8px 8px; }
  .gallery-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
}
@media (hover: none) and (pointer: coarse) {
  .component-card:hover { transform: none; border-color: transparent; box-shadow: 0 4px 12px rgba(31,44,81,0.15); }
  .component-card:active { transform: scale(0.98); border-color: #1f2c51; box-shadow: 0 8px 25px rgba(31,44,81,0.2); }
  .component-card.active-card { transform: none; border-color: #F5B027; }
  .panel-header:hover { box-shadow: none; }
  .panel-header:active { box-shadow: inset 0 0 20px rgba(255,255,255,0.3); }
  .gallery-item:hover { transform: none; }
  .gallery-item:active { transform: scale(0.97); }
}
/* ── LIGHTBOX ULTRA SIMPLE ── */
.lightbox-simple {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.lightbox-content {
  position: relative;
  max-width: 70vw;
  max-height: 70vh;
  background: white;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.lightbox-content img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
  border-radius: 4px;
}

.close-btn {
  position: absolute;
  top: -12px;
  right: -12px;
  background: #F5B027;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.2s;
}

.close-btn:hover {
  background: #E89B1C;
  transform: scale(1.1);
}
</style>