const multer = require('multer');

// Configuración de multer para cargar archivos
const storage = multer.memoryStorage();  // Almacenamiento en memoria para manejar datos binarios
const upload = multer({ storage: storage });

module.exports = upload;
