const express = require('express');
const router = express.Router();
const materiasController = require('../controllers/materiasController');
const verifyToken = require('../services/verifyToken');

// Rutas para materias
router.get('/', verifyToken, materiasController.getAllMaterias);
router.get('/:id', verifyToken, materiasController.getMateriaById);
router.post('/', verifyToken, materiasController.createMateria);
router.put('/:id', verifyToken, materiasController.updateMateria);
router.delete('/:id', verifyToken, materiasController.deleteMateria);

module.exports = router;
