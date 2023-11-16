const express = require('express');
const router = express.Router();

// Todas tienen que pasar por la validación del jwt

const { getEventos, crearEvento, actualizarEvento, deleteEvent } = require("../controllers/events")
const { validarJWT } = require("../middlewares/validar-jwt");
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');



router.use( validarJWT )

// Obtener eventos
router.get('/', getEventos)


// Crear un evento
router.post(
    '/',
     [
        check('title', 'El título es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha de finalización es obligatoria').custom(isDate),
        validarCampos
     ],
     crearEvento
)


// Actualizar un evento
router.put('/:id', actualizarEvento)



// Actualizar un evento
router.delete('/:id', deleteEvent)


module.exports = router;