import { defineStore } from 'pinia'

export const useCotizacionStore = defineStore('cotizacion', {
  state: () => ({
    consumo: 1000,
    radiacion: 4.5,
    generacion: 0,
    imagen: null,
    registros: [],
    userName: '',
    currentImages: [],
    valorTotalProyecto: 0,
    costoTotal: 0,
    consumoCliente: 0,
    tarifaElectricidad: 1000,
    incrementoAnual: 2,
    structureImages: [],
    _quoteId: ''
  }),

  actions: {
    calcular() {
      this.generacion = this.consumo / 30 / this.radiacion
    },

    setImagen(img) {
      this.imagen = img
    },

    // ✅ NUEVAS ACCIONES PARA PANEL8
    actualizarCostoTotal(costo) {
      this.costoTotal = costo
      this.valorTotalProyecto = costo
    },

    actualizarConsumo(consumo) {
      this.consumoCliente = consumo
    },

    actualizarGeneracion(generacion) {
      this.generacion = generacion
    },

    actualizarAdicionales(adicionales) {
      this.adicionales = adicionales
    },

    updateStructureImages(images) {
      this.structureImages = images
    },

    // Cargar registros desde localStorage
    cargarRegistros() {
      const registrosGuardados = localStorage.getItem('cotizaciones_solar')
      if (registrosGuardados) {
        this.registros = JSON.parse(registrosGuardados)
      } else {
        // Agregar datos de ejemplo si no hay registros guardados
        this.registros = [
          {
            id: 1,
            fecha: new Date(Date.now() - 86400000).toISOString(), // Hace 1 día
            name: 'Juan Pérez',
            email: 'juan.perez@email.com',
            phone: '3001234567',
            city: 'Bogotá',
            consumo: 250,
            factura: 'si',
            tipoInmueble: 'casa',
            tipoTecho: 'teja',
            area: 50,
            politica: true,
            contacto: true
          },
          {
            id: 2,
            fecha: new Date(Date.now() - 43200000).toISOString(), // Hace 12 horas
            name: 'María González',
            email: 'maria.gonzalez@email.com',
            phone: '3019876543',
            city: 'Medellín',
            consumo: 180,
            factura: 'no',
            tipoInmueble: 'apartamento',
            tipoTecho: 'plano',
            area: 35,
            politica: true,
            contacto: true
          },
          {
            id: 3,
            fecha: new Date().toISOString(), // Ahora
            name: 'Carlos Rodríguez',
            email: 'carlos.rodriguez@email.com',
            phone: '3025551234',
            city: 'Cali',
            consumo: 320,
            factura: 'si',
            tipoInmueble: 'oficina',
            tipoTecho: 'metalico',
            area: 80,
            politica: true,
            contacto: true
          }
        ]
        // Guardar los datos de ejemplo en localStorage
        localStorage.setItem('cotizaciones_solar', JSON.stringify(this.registros))
      }
    },

    // Guardar registro en localStorage
    guardarRegistro(registro) {
      // Agregar timestamp y ID único
      const nuevoRegistro = {
        id: Date.now(),
        fecha: new Date().toISOString(),
        ...registro,
        tipoAcometida: registro.tipoAcometida || '',
        calibreAcometida: registro.calibreAcometida || '',
        transformador: registro.transformador || '',
        numeroMatricula: registro.numeroMatricula || ''
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

