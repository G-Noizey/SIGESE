const mysql = require('mysql2/promise'); // Importa mysql2 en modo promesa
const pool = require('../services/db');

// Obtener todas las calificaciones
exports.getAllCalificaciones = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        const [rows] = await pool.query('CALL getAllCalificaciones()');
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener todas las calificaciones:', error);
        res.status(500).json({ error: 'Error al obtener calificaciones' });
    }
};

// Obtener calificación por ID
exports.getCalificacionById = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { id } = req.params;
    try {
        const [rows] = await pool.query('CALL getCalificacionById(?)', [id]);
        if (rows[0].length === 0) {
            return res.status(404).json({ error: 'Calificación no encontrada' });
        }
        res.json(rows[0][0]);
    } catch (error) {
        console.error(`Error al obtener calificación con ID ${id}:`, error);
        res.status(500).json({ error: 'Error al obtener calificación por ID' });
    }
};

// Crear calificación
exports.createCalificacion = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const calificacion = req.body;
    try {
        const [result] = await pool.query('CALL createCalificacion(?, ?, ?, ?, ?, ?, ?)', [
            calificacion.idEstudiante,
            calificacion.idMateria,
            calificacion.idDocente,
            calificacion.calificacion,
            calificacion.fecha,
            calificacion.unidad,
            calificacion.idPeriodo // Nuevo parámetro
        ]);
        res.status(201).json({ message: 'Calificación creada', id: result.insertId });
    } catch (error) {
        console.error('Error al crear calificación:', error);
        res.status(500).json({ error: 'Error al crear calificación' });
    }
};

// Actualizar calificación por ID
exports.updateCalificacion = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { id } = req.params;
    const calificacion = req.body;
    try {
        const [result] = await pool.query('CALL updateCalificacion(?,?, ?, ?, ?, ?, ?, ?)', [
            id,
            calificacion.idEstudiante,
            calificacion.idMateria,
            calificacion.idDocente,
            calificacion.calificacion,
            calificacion.fecha,
            calificacion.unidad,
            calificacion.idPeriodo // Nuevo parámetro
        ]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Calificación con ID ${id} no encontrada` });
        }
        res.status(200).json({ message: 'Calificación actualizada' });
    } catch (error) {
        console.error(`Error al actualizar calificación con ID ${id}:`, error);
        res.status(500).json({ error: 'Error al actualizar calificación' });
    }
};

// Eliminar calificación por ID
exports.deleteCalificacion = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { id } = req.params;
    try {
        const [result] = await pool.query('CALL deleteCalificacion(?)', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Calificación con ID ${id} no encontrada` });
        }
        res.status(200).json({ message: 'Calificación eliminada' });
    } catch (error) {
        console.error(`Error al eliminar calificación con ID ${id}:`, error);
        res.status(500).json({ error: 'Error al eliminar calificación' });
    }
};
