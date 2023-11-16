const express = require('express');
const bcrypt  = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async(req, res = express.response) => {

    const {  email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({email});
        
        if (usuario){
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe ya con ese correo'
            })
        }
        
        usuario = new Usuario( req.body );

        const token = await generarJWT( usuario.id, usuario.name )

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt)

        await usuario.save();

        
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Porfavor hable con el admin'
        })
    }
}


const loginUsuario = async(req, res = express.response) => {

    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({email});
        
        if (!usuario){
            return res.status(400).json({
                ok: false,
                msg: 'Usuario con email incorrecto'
            })
        }

        // Confirmar los passwords
        const validPassword = bcrypt.compareSync( password, usuario.password )
        if ( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            })
        }

        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name )


        res.status(200).json({
            ok:true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Porfavor hable con el admin'
        })
    }

};


const revalidarToken = async(req, res = express.response) => {

    const uid = req.uid;
    const name = req.name;
    
    // generar un nuevo token y retornarlo en esta petición
    const token = await generarJWT( uid, name )

    res.json({
        ok: true,
        token
    })
}


module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}



