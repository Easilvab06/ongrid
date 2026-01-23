const express = require('express')
const XLSX = require('xlsx')
const app = express()

app.use(express.json())

app.post('/guardar', (req, res) => {
  const wb = XLSX.readFile('ON000- COTIZACION SISTEMA ON GRID.xlsx')
  const ws = wb.Sheets[wb.SheetNames[0]]

  ws['B2'] = { v: req.body.consumo }
  ws['B3'] = { v: req.body.generacion }

  XLSX.writeFile(wb, 'ON000- COTIZACION SISTEMA ON GRID.xlsx')
  res.send({ ok: true })
})

app.listen(3000, () => console.log('Servidor listo'))
