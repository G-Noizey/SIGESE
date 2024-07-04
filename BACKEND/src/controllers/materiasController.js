const mysql = require('mysql2/promise');
const pool = require('../services/db');

// Obtener todas las materias
exports.getAllMaterias = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        const [rows] = await pool.query('CALL getAllMaterias()');
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener todas las materias:', error);
        res.status(500).json({ error: 'Error al obtener materias' });
    }
};

// Obtener materia por ID
exports.getMateriaById = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { id } = req.params;
    try {
        const [rows] = await pool.query('CALL getMateriaById(?)', [id]);
        if (rows[0].length === 0) {
            return res.status(404).json({ error: 'Materia no encontrada' });
        }
        res.json(rows[0][0]);
    } catch (error) {
        console.error('Error al obtener la materia por ID:', error);
        res.status(500).json({ error: 'Error al obtener la materia por ID' });
    }
};

// Crear materia
exports.createMateria = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { nombre, idGrupo } = req.body;
    try {
        const [result] = await pool.query('CALL createMateria(?, ?)', [nombre, idGrupo]);
        res.status(201).json({ message: 'Materia creada', id: result.insertId });
    } catch (error) {
        console.error('Error al crear la materia:', error);
        res.status(500).json({ error: 'Error al crear la materia' });
    }
};

// Actualizar materia por ID
exports.updateMateria = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { id } = req.params;
    const { nombre, idGrupo } = req.body;
    try {
        const [result] = await pool.query('CALL updateMateria(?, ?, ?)', [id, nombre, idGrupo]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Materia no encontrada' });
        }
        res.status(200).json({ message: 'Materia actualizada' });
    } catch (error) {
        console.error('Error al actualizar la materia:', error);
        res.status(500).json({ error: 'Error al actualizar la materia' });
    }
};

// Eliminar materia por ID
exports.deleteMateria = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { id } = req.params;
    try {
        const [result] = await pool.query('CALL deleteMateria(?)', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Materia no encontrada' });
        }
        res.status(200).json({ message: 'Materia eliminada' });
    } catch (error) {
        console.error('Error al eliminar la materia:', error);
        res.status(500).json({ error: 'Error al eliminar la materia' });
    }
};
