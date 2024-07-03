const express = require('express');
const router = express.Router();
const estudiantesController = require('../controllers/estudiantesController');
const verifyToken = require('../services/verifyToken');
const upload = require('../services/multer');  // Importa el middleware de multer

// Rutas para estudiantes
router.get('/', verifyToken, estudiantesController.getAllEstudiantes);
router.get('/:id', verifyToken, estudiantesController.getEstudianteById);
router.post('/', verifyToken, estudiantesController.createEstudiante);
router.put('/:id', verifyToken, estudiantesController.updateEstudiante);
router.delete('/:id', verifyToken, estudiantesController.deleteEstudiante);
router.post('/login', estudiantesController.loginEstudiante);

// Ruta para agregar o actualizar imagen de perfil de estudiante
router.post('/imagen/:id', verifyToken, upload.single('imgPerfil'), estudiantesController.addEstudianteImgPerfil);
router.put('/imagen/:id', verifyToken, upload.single('imgPerfil'), estudiantesController.updateEstudianteImgPerfil);

module.exports = router;
