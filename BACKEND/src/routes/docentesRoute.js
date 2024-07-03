const express = require('express');
const router = express.Router();
const docentesController = require('../controllers/docentesController');
const verifyToken = require('../services/verifyToken');

// Rutas para docentes
router.get('/', verifyToken, docentesController.getAllDocentes);
router.get('/:id', verifyToken, docentesController.getDocenteById);
router.post('/', verifyToken, docentesController.createDocente);
router.put('/:id', verifyToken, docentesController.updateDocente);
router.delete('/:id', verifyToken, docentesController.deleteDocente);
router.post('/login', docentesController.loginDocente); // El login no necesita autenticación

// Ruta para asignar grupos a un docente
router.post('/grupo', verifyToken, docentesController.asignarGrupoDocente);

// Rutas para gestionar grupos y calificaciones de docentes
router.get('/:docente_id/grupos', verifyToken, docentesController.getGruposDocente);
router.get('/:docente_id/grupos/:grupo_id/estudiantes', verifyToken, docentesController.getAlumnosGrupo);
router.post('/calificaciones', verifyToken, docentesController.asignarCalificacion);

module.exports = router;
