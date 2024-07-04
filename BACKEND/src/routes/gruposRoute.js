const express = require('express');
const router = express.Router();
const gruposController = require('../controllers/gruposController');
const verifyToken = require('../services/verifyToken');

// Rutas para grupos
router.get('/', verifyToken, gruposController.getAllGrupos);
router.get('/:id', verifyToken, gruposController.getGrupoById);
router.post('/', verifyToken, gruposController.createGrupo);
router.put('/:id', verifyToken, gruposController.updateGrupo);
router.delete('/:id', verifyToken, gruposController.deleteGrupo);

module.exports = router;
