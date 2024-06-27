const mysql = require('mysql2/promise'); // Importa mysql2 en modo promesa
const pool = require('../../db'); // Asegúrate de que el path sea correcto

// Obtener todos los estudiantes
exports.getAllEstudiantes = async (req, res) => {
    try {
        const [rows] = await pool.query('CALL getAllEstudiantes()');
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener todos los estudiantes:', error);
        res.status(500).json({ error: 'Error al obtener estudiantes' });
    }
};

// Obtener estudiante por ID
exports.getEstudianteById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('CALL getEstudianteById(?)', [id]);
        if (rows[0].length === 0) {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
        }
        res.json(rows[0][0]);
    } catch (error) {
        console.error(`Error al obtener estudiante con ID ${id}:`, error);
        res.status(500).json({ error: 'Error al obtener estudiante por ID' });
    }
};

// Crear estudiante
exports.createEstudiante = async (req, res) => {
    const estudiante = req.body;
    try {
        const [result] = await pool.query('CALL createEstudiante(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            estudiante.matricula,
            estudiante.nombre,
            estudiante.apellidoPaterno,
            estudiante.apellidoMaterno,
            estudiante.genero,
            estudiante.fechaNacimiento,
            estudiante.direccion,
            estudiante.telefono,
            estudiante.correoElectronico,
            estudiante.idGrupo,
            estudiante.estado
        ]);
        res.status(201).json({ message: 'Estudiante creado', id: result.insertId });
    } catch (error) {
        console.error('Error al crear estudiante:', error);
        res.status(500).json({ error: 'Error al crear estudiante' });
    }
};

// Actualizar estudiante por ID
exports.updateEstudiante = async (req, res) => {
    const { id } = req.params;
    const estudiante = req.body;
    try {
        const [result] = await pool.query('CALL updateEstudiante(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            id,
            estudiante.matricula,
            estudiante.nombre,
            estudiante.apellidoPaterno,
            estudiante.apellidoMaterno,
            estudiante.genero,
            estudiante.fechaNacimiento,
            estudiante.direccion,
            estudiante.telefono,
            estudiante.correoElectronico,
            estudiante.idGrupo,
            estudiante.estado
        ]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Estudiante con ID ${id} no encontrado` });
        }
        res.status(200).json({ message: 'Estudiante actualizado' });
    } catch (error) {
        console.error(`Error al actualizar estudiante con ID ${id}:`, error);
        res.status(500).json({ error: 'Error al actualizar estudiante' });
    }
};

// Eliminar estudiante por ID
exports.deleteEstudiante = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('CALL deleteEstudiante(?)', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Estudiante con ID ${id} no encontrado` });
        }
        res.status(200).json({ message: 'Estudiante eliminado' });
    } catch (error) {
        console.error(`Error al eliminar estudiante con ID ${id}:`, error);
        res.status(500).json({ error: 'Error al eliminar estudiante' });
    }
};
