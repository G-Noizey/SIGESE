const express = require('express');
const router = express.Router();
const calificacionesController = require('../controllers/calificacionesController');
const verifyToken = require('../services/verifyToken');

// Rutas para calificaciones
router.get('/', verifyToken, calificacionesController.getAllCalificaciones);
router.get('/:id', verifyToken, calificacionesController.getCalificacionById);
router.post('/', verifyToken, calificacionesController.createCalificacion);
router.put('/:id', verifyToken, calificacionesController.updateCalificacion);
router.delete('/:id', verifyToken, calificacionesController.deleteCalificacion);

module.exports = router;
