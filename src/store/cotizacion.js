import { defineStore } from 'pinia'

export const useCotizacionStore = defineStore('cotizacion', {
  state: () => ({
    consumo: 300,
    radiacion: 4.5,
    generacion: 0,
    imagen: null,
    registros: []
  }),

  actions: {
    calcular() {
      this.generacion = this.consumo / 30 / this.radiacion
    },

    setImagen(img) {
      this.imagen = img
    },

    // Cargar registros desde localStorage
    cargarRegistros() {
      const registrosGuardados = localStorage.getItem('cotizaciones_solar')
      if (registrosGuardados) {
        this.registros = JSON.parse(registrosGuardados)
      }
    },

    // Guardar registro en localStorage
    guardarRegistro(registro) {
      // Agregar timestamp y ID único
      const nuevoRegistro = {
        id: Date.now(),
        fecha: new Date().toISOString(),
        ...registro
      }

      this.registros.push(nuevoRegistro)

      // Guardar en localStorage
      localStorage.setItem('cotizaciones_solar', JSON.stringify(this.registros))
    },

    // Obtener todos los registros
    obtenerRegistros() {
      return this.registros
    },

    // Limpiar todos los registros
    limpiarRegistros() {
      this.registros = []
      localStorage.removeItem('cotizaciones_solar')
    }
  }
})
