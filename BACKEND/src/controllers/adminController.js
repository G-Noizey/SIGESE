const pool = require('../services/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Login de Administrador
exports.loginAdmin = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { usuario, contrasena } = req.body;
    
    try {
        // Llamada al procedimiento almacenado para el login de administradores
        const [rows] = await pool.query('CALL loginAdmin(?, ?, @result)', [usuario, contrasena]);
        const [[{ result }]] = await pool.query('SELECT @result AS result');

        if (result > 0) {
            // Obtener información del administrador
            const [adminRows] = await pool.query('SELECT * FROM ADMIN WHERE idAdmin = ?', [result]);

            if (adminRows.length === 0) {
                return res.status(404).json({ error: 'Administrador no encontrado' });
            }

            const admin = adminRows[0];

            // Construir el objeto de respuesta incluyendo el token
            const payload = {
                idAdmin: admin.idAdmin,
                usuario: admin.usuario,
                nombre: admin.nombre,
                apellidoPaterno: admin.apellidoPaterno,
                apellidoMaterno: admin.apellidoMaterno,
                correo_electronico: admin.correo_electronico
                // Puedes agregar más campos según sea necesario
            };

            // Generar el token JWT
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Agregar el token al objeto de respuesta
            admin.token = token;

            // Enviar la respuesta con todos los datos del administrador incluyendo el token
            res.status(200).json(admin);
        } else {
            res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }
    } catch (error) {
        console.error('Error en el login de administrador:', error);
        res.status(500).json({ error: 'Error en el login de administrador' });
    }
};
