const express = require('express');
const router = express.Router();
const periodosController = require('../controllers/periodosController');
const verifyToken = require('../services/verifyToken');

// Rutas para periodos
router.get('/', verifyToken, periodosController.getAllPeriodos);
router.get('/:id', verifyToken, periodosController.getPeriodoById);
router.post('/', verifyToken, periodosController.createPeriodo);
router.put('/:id', verifyToken, periodosController.updatePeriodo);
router.delete('/:id', verifyToken, periodosController.deletePeriodo);

module.exports = router;
