const express = require('express');
const { dbConection } = require('./database/config');
require('dotenv').config();
const cors = require('cors')

// console.log(process.env);
// Crear el server de express

const app = express();

// Base de datos

dbConection();

// CORS
app.use(cors())

// Lectura y parse del body
app.use( express.json() );


// Dir publico
app.use( express.static('public') );


// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// Escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
})