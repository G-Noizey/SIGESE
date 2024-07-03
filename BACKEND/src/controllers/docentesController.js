const mysql = require('mysql2/promise');
const pool = require('../services/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();


// Obtener grupos de un docente
exports.getGruposDocente = async (req, res) => {
    const { docente_id } = req.params;
    try {
        const [rows] = await pool.query('CALL getGruposDocente(?)', [docente_id]);
        res.json(rows[0]); // Asumiendo que solo se espera un conjunto de resultados
    } catch (error) {
        console.error('Error al obtener los grupos del docente:', error);
        res.status(500).json({ error: 'Error al obtener los grupos del docente' });
    }
};



// Obtener alumnos de un grupo asignado a un docente
exports.getAlumnosGrupo = async (req, res) => {
    const { docente_id, grupo_id } = req.params;
    try {
        const [rows] = await pool.query('CALL getAlumnosGrupo(?, ?)', [docente_id, grupo_id]);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los alumnos del grupo:', error);
        res.status(500).json({ error: 'Error al obtener los alumnos del grupo' });
    }
};



// Asignar calificación a un estudiante por materia y unidad
exports.asignarCalificacion = async (req, res) => {
    const { estudiante_id, materia_id, docente_id, calificacion, fecha, unidad } = req.body;
    try {
        await pool.query('CALL asignarCalificaciones(?, ?, ?, ?, ?, ?)', [estudiante_id, materia_id, docente_id, calificacion, fecha, unidad]);
        res.status(201).json({ message: 'Calificación asignada exitosamente' });
    } catch (error) {
        console.error('Error al asignar la calificación:', error);
        res.status(500).json({ error: 'Error al asignar la calificación' });
    }
};



// Asignar grupo a un docente
exports.asignarGrupoDocente = async (req, res) => {
    const { docente_id, grupo_id } = req.body;
    try {
        await pool.query('CALL asignarGrupoDocente(?, ?)', [docente_id, grupo_id]);
        res.status(201).json({ message: 'Grupo asignado al docente exitosamente' });
    } catch (error) {
        console.error('Error al asignar grupo al docente:', error);
        res.status(500).json({ error: 'Error al asignar grupo al docente' });
    }
};



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
            docente.estado,
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
        const [result] = await pool.query('CALL updateDocente(?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            id,
            docente.nombre,
            docente.apellidoPaterno,
            docente.apellidoMaterno,
            docente.genero,
            docente.direccion,
            docente.telefono,
            docente.correoElectronico,
            docente.contrasena,
            docente.estado,
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


exports.loginDocente = async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        // Llamada al procedimiento almacenado para verificar las credenciales
        const [rows] = await pool.query('CALL loginDocente(?, ?, @result)', [correo, contrasena]);
        const [result] = await pool.query('SELECT @result as result');
        const loginResult = result[0].result;

        if (loginResult === 0) {
            return res.status(401).json({ error: 'Correo electrónico o contraseña incorrectos' });
        }

        // Obtener información completa del docente
        const [docenteRows] = await pool.query('SELECT * FROM DOCENTES WHERE idDocente = ?', [loginResult]);

        if (docenteRows.length === 0) {
            return res.status(404).json({ error: 'Docente no encontrado' });
        }

        const docente = docenteRows[0];

        // Generar token JWT
        const token = jwt.sign({ idDocente: docente.idDocente }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Construir el objeto de respuesta
        const response = {
            message: 'Inicio de sesión exitoso',
            docente: {
                idDocente: docente.idDocente,
                nombre: docente.nombre,
                apellidoPaterno: docente.apellidoPaterno,
                apellidoMaterno: docente.apellidoMaterno,
                genero: docente.genero,
                direccion: docente.direccion,
                telefono: docente.telefono,
                correoElectronico: docente.correoElectronico,
                estado: docente.estado
            },
            token: token
        };

        // Enviar la respuesta
        res.status(200).json(response);
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};