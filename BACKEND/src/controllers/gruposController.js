const mysql = require('mysql2/promise'); // Importa mysql2 en modo promesa
const pool = require('../services/db');

// Obtener todos los grupos
exports.getAllGrupos = async (req, res) => {
    try {
        const [rows] = await pool.query('CALL getAllGrupos()');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener todos los grupos:', error);
        res.status(500).json({ error: 'Error al obtener todos los grupos' });
    }
};

// Obtener grupo por ID
exports.getGrupoById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('CALL getGrupoById(?)', [id]);
        if (rows[0].length === 0) {
            return res.status(404).json({ error: 'Grupo no encontrado' });
        }
        res.json(rows[0][0]);
    } catch (error) {
        console.error('Error al obtener el grupo por ID:', error);
        res.status(500).json({ error: 'Error al obtener el grupo por ID' });
    }
};

// Crear grupo
exports.createGrupo = async (req, res) => {
    const { nombre, semestre } = req.body;
    try {
        const [result] = await pool.query('CALL createGrupo(?, ?)', [nombre, semestre]);
        res.status(201).json({ message: 'Grupo creado', id: result.insertId });
    } catch (error) {
        console.error('Error al crear el grupo:', error);
        res.status(500).json({ error: 'Error al crear el grupo' });
    }
};

// Actualizar grupo por ID
exports.updateGrupo = async (req, res) => {
    const { id } = req.params;
    const { nombre, semestre } = req.body;
    try {
        const [result] = await pool.query('CALL updateGrupo(?, ?, ?)', [id, nombre, semestre]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Grupo no encontrado' });
        }
        res.status(200).json({ message: 'Grupo actualizado' });
    } catch (error) {
        console.error('Error al actualizar el grupo:', error);
        res.status(500).json({ error: 'Error al actualizar el grupo' });
    }
};

// Eliminar grupo por ID
exports.deleteGrupo = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('CALL deleteGrupo(?)', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Grupo no encontrado' });
        }
        res.status(200).json({ message: 'Grupo eliminado' });
    } catch (error) {
        console.error('Error al eliminar el grupo:', error);
        res.status(500).json({ error: 'Error al eliminar el grupo' });
    }
};
