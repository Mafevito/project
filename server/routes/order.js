const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const orderRoutes = express.Router();

/* Obtener lista */
orderRoutes.get('/orders', (req, res, next) => {
    Order.find((err, orderList) => {
        if(err) {
            return res.json(err);
        }
        res.json(orderList);
    });
});

/* Crear nuevo pedido*/
orderRoutes.post('/orders', (req, res, next) => {
    const theOrder = new Order({
        emailOrder: req.body.emailOrder,
        tittleOrder: req.body.tittleOrder,
        descriptionOrder: req.body.descriptionOrder,
        nameCompany: req.body.nameCompany,
        webCompany: req.body.webCompany,
        socialCompany: req.body.socialCompany
    });
    theOrder.save((err) => {
        if(err) {
            return res.json(err);
           
        }
        res.json({
            message: 'Nuevo pedido creado',
            id: theOrder
        });
    });
});

/* Obtener pedido especifico */
orderRoutes.get('/orders/:id', (req, res) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: 'id especifico no valido' });
        return;
    }

    Order.findById(req.params.id, (err, theOrder) => {
        if(err) {
            return res.json(err);
        }
        res.json(theOrder)
    });
});

/* Editar pedido especifico */
orderRoutes.put('orders/:id', (req, res) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: 'id especifico no valido' });
        return;
    }

    const updates = {
        emailOrder: req.body.emailOrder,
        tittleOrder: req.body.tittleOrder,
        descriptionOrder: req.body.descriptionOrder,
        nameCompany: req.body.nameCompany,
        webCompany: req.body.webCompany,
        socialCompany: req.body.socialCompany
    };

    theOrder.findByIdAndUpdate(req.params.id, updates, (err) => {
        if(err) {
            return res.json(err);
        }
        res.json({
            message: 'Pedido actualizado'
        });
    });
});

/* Eliminar pedido especifico */
orderRoutes.delete('/orders/:id', (req, res) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: 'id especifico no valido' });
        return;
    }

    theOrder.remove({_id: req.params.id}, (err) => {
        if(err) {
            return res.json(err);
        }
        return res.json({
            message: 'Pedido eliminado'
        });
    });
});

module.exports = orderRoutes;