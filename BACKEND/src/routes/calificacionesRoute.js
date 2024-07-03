const express = require('express');
const router = express.Router();
const calificacionesController = require('../controllers/calificacionesController');

// Rutas para calificaciones
router.get('/', calificacionesController.getAllCalificaciones);
router.get('/:id', calificacionesController.getCalificacionById);
router.post('/', calificacionesController.createCalificacion);
router.put('/:id', calificacionesController.updateCalificacion);
router.delete('/:id', calificacionesController.deleteCalificacion);


module.exports = router;
