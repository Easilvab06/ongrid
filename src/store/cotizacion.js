import { defineStore } from 'pinia'

export const useCotizacionStore = defineStore('cotizacion', {
  state: () => ({
    consumo: 300,
    radiacion: 4.5,
    generacion: 0,
    imagen: null
  }),

  actions: {
    calcular() {
      this.generacion = this.consumo / 30 / this.radiacion
    },

    setImagen(img) {
      this.imagen = img
    }
  }
})
