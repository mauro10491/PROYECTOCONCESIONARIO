import express from 'express'
import {PORT} from './config.js'
import consecionarioRoute from './routes/consecionario.routes.js'
import vendedorRoute from './routes/vendedores.routes.js'
import clienteRoute from './routes/clientes.routes.js'
import productoRoute from './routes/productos.routes.js'
import insumoRoute from './routes/insumos.routes.js'
import vehiculoRoute from './routes/vehiculos.routes.js'
import ventaRoute from './routes/ventas.routes.js'
import detalleventaRoute from './routes/detalleventas.routes.js'
import tallerRoute from './routes/taller.routes.js'
import productotallerRoute from './routes/productostaller.routes.js'

const app = express()

app.use(express.json())
app.use(consecionarioRoute);
app.use(vendedorRoute);
app.use(clienteRoute);
app.use(productoRoute);
app.use(insumoRoute);
app.use(vehiculoRoute);
app.use(ventaRoute);
app.use(detalleventaRoute);
app.use(tallerRoute);
app.use(productotallerRoute);

app.listen(PORT)
console.log('Server on port', PORT)