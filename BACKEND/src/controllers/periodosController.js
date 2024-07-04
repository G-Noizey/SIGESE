const mysql = require('mysql2/promise'); // Importa mysql2 en modo promesa
const pool = require('../services/db');

// Obtener todos los periodos
exports.getAllPeriodos = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        const [rows] = await pool.query('CALL getAllPeriodos()');
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener todos los periodos:', error);
        res.status(500).json({ error: 'Error al obtener todos los periodos' });
    }
};

// Obtener periodo por ID
exports.getPeriodoById = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { id } = req.params;
    try {
        const [rows] = await pool.query('CALL getPeriodoById(?)', [id]);
        if (rows[0].length === 0) {
            return res.status(404).json({ error: 'Periodo no encontrado' });
        }
        res.json(rows[0][0]);
    } catch (error) {
        console.error('Error al obtener el periodo por ID:', error);
        res.status(500).json({ error: 'Error al obtener el periodo por ID' });
    }
};

// Crear periodo
exports.createPeriodo = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { nombre, semestre, fechaInicio, fechaFin } = req.body;
    try {
        const [result] = await pool.query('CALL createPeriodo(?, ?, ?, ?)', [nombre, semestre, fechaInicio, fechaFin]);
        res.status(201).json({ message: 'Periodo creado', id: result.insertId });
    } catch (error) {
        console.error('Error al crear el periodo:', error);
        res.status(500).json({ error: 'Error al crear el periodo' });
    }
};

// Actualizar periodo por ID
exports.updatePeriodo = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { id } = req.params;
    const { nombre, semestre, fechaInicio, fechaFin } = req.body;
    try {
        const [result] = await pool.query('CALL updatePeriodo(?, ?, ?, ?, ?)', [id, nombre, semestre, fechaInicio, fechaFin]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Periodo no encontrado' });
        }
        res.status(200).json({ message: 'Periodo actualizado' });
    } catch (error) {
        console.error('Error al actualizar el periodo:', error);
        res.status(500).json({ error: 'Error al actualizar el periodo' });
    }
};

// Eliminar periodo por ID
exports.deletePeriodo = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { id } = req.params;
    try {
        const [result] = await pool.query('CALL deletePeriodo(?)', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Periodo no encontrado' });
        }
        res.status(200).json({ message: 'Periodo eliminado' });
    } catch (error) {
        console.error('Error al eliminar el periodo:', error);
        res.status(500).json({ error: 'Error al eliminar el periodo' });
    }
};
