const express = require('express');
const { crearUsuario, revalidarToken, loginUsuario } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = express.Router();


router.post(
    '/new',
    [
        // middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password es obligatorio y debe tener mínimo 6 caracteres').isLength({min: 6}),
        validarCampos
    ] ,
    crearUsuario);

router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password es obligatorio y debe tener mínimo 6 caracteres').isLength({min: 6}),
        validarCampos
    ],
    loginUsuario);

router.get('/renew',validarJWT ,revalidarToken);


module.exports = router;