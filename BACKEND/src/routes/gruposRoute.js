const express = require('express');
const router = express.Router();
const gruposController = require('../controllers/gruposController');

// Rutas para grupos
router.get('/', gruposController.getAllGrupos);
router.get('/:id', gruposController.getGrupoById);
router.post('/', gruposController.createGrupo);
router.put('/:id', gruposController.updateGrupo);
router.delete('/:id', gruposController.deleteGrupo);

module.exports = router;
