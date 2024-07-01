const mysql = require('mysql2/promise');
const pool = require('../../db');

// Obtener todos los docentes
exports.getAllDocentes = async (req, res) => {
    try {
        const [rows] = await pool.query('CALL getAllDocentes()');
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener todos los docentes:', error);
        res.status(500).json({ error: 'Error al obtener docentes' });
    }
};

// Obtener docente por ID
exports.getDocenteById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('CALL getDocenteById(?)', [id]);
        if (rows[0].length === 0) {
            return res.status(404).json({ error: 'Docente no encontrado' });
        }
        res.json(rows[0][0]);
    } catch (error) {
        console.error(`Error al obtener docente con ID ${id}:`, error);
        res.status(500).json({ error: 'Error al obtener docente por ID' });
    }
};

// Crear docente
exports.createDocente = async (req, res) => {
    const docente = req.body;
    try {
        const [result] = await pool.query('CALL createDocente(?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            docente.nombre,
            docente.apellidoPaterno,
            docente.apellidoMaterno,
            docente.genero,
            docente.direccion,
            docente.telefono,
            docente.correoElectronico,
            docente.contrasena,
            docente.estado
        ]);

        res.status(201).json({ message: 'Docente creado', id: result.insertId });
    } catch (error) {
        console.error('Error al crear docente:', error);
        res.status(500).json({ error: 'Error al crear docente' });
    }
};

// Actualizar docente por ID
exports.updateDocente = async (req, res) => {
    const { id } = req.params;
    const docente = req.body;
    try {
        const [result] = await pool.query('CALL updateDocente(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            id,
            docente.nombre,
            docente.apellidoPaterno,
            docente.apellidoMaterno,
            docente.genero,
            docente.direccion,
            docente.telefono,
            docente.correoElectronico,
            docente.contrasena,
            docente.estado 
        ]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Docente con ID ${id} no encontrado` });
        }
        res.status(200).json({ message: 'Docente actualizado' });
    } catch (error) {
        console.error(`Error al actualizar docente con ID ${id}:`, error);
        res.status(500).json({ error: 'Error al actualizar docente' });
    }
};

// Eliminar docente por ID
exports.deleteDocente = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('CALL deleteDocente(?)', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Docente con ID ${id} no encontrado` });
        }
        res.status(200).json({ message: 'Docente eliminado' });
    } catch (error) {
        console.error(`Error al eliminar docente con ID ${id}:`, error);
        res.status(500).json({ error: 'Error al eliminar docente' });
    }
};


// Login de docente
exports.loginDocente = async (req, res) => {
    const { correoElectronico, contrasena } = req.body;
    try {
        const [rows] = await pool.query('CALL loginDocente(?, ?)', [correoElectronico, contrasena]);
        if (rows[0].length === 0) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
        const docente = rows[0][0];
        // Aquí podrías generar un token JWT si lo deseas
        res.json({ message: 'Login exitoso', docente });
    } catch (error) {
        console.error('Error en el login del docente:', error);
        res.status(500).json({ error: 'Error en el login del docente' });
    }
};




