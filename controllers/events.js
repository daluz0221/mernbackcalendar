const { response } = require("express");
const Evento = require('../models/Events');


const getEventos = async(req, res = response) => {

    const eventos = await Evento.find().populate('user', 'name')
  
    res.json({
        ok:true,
        eventos
    })

}


const crearEvento = async(req, res = response) => {

    const evento = new Evento(req.body);

    try {

        evento.user = req.uid;

        const eventoSaved = await evento.save();


        res.status(201).json({
            ok: true,
            eventoSaved
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor habla con el admin back end'
        })
    }
  

}


const actualizarEvento = async(req, res = response) => {

    const eventoID = req.params.id;

    try {
        
        const evento = await Evento.findById( eventoID);

        if (!evento){
            res.status(404).json({
                ok: false,
                msg:'Evento no exite por ese Id'
            })
        }

        if (evento.user.toString() !== req.uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio para editar este evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: req.uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoID, nuevoEvento, {new: true});

        return res.json({
            ok: true,
            evento: eventoActualizado
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor habla con el admin back end'
        })
    }


   

}


const deleteEvent = async(req, res = response) => {
  
    const eventoID = req.params.id;

    try {
        
        const evento = await Evento.findById( eventoID);

        if (!evento){
            res.status(404).json({
                ok: false,
                msg:'Evento no exite por ese Id'
            })
        }

        if (evento.user.toString() !== req.uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio para editar este evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: req.uid
        }

        await Evento.findByIdAndDelete(eventoID);

        return res.json({
            ok: true
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor habla con el admin back end'
        })
    }

}


module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    deleteEvent
}