const mysql = require('mysql2/promise');
const pool = require('../services/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Obtener todos los estudiantes
exports.getAllEstudiantes = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
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
    res.setHeader('Access-Control-Allow-Origin', '*');
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
    res.setHeader('Access-Control-Allow-Origin', '*');
    const estudiante = req.body;
    try {
        const [result] = await pool.query('CALL createEstudiante(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            estudiante.matricula,
            estudiante.nombre,
            estudiante.apellidoPaterno,
            estudiante.apellidoMaterno,
            estudiante.genero,
            estudiante.fechaNacimiento,
            estudiante.direccion,
            estudiante.telefono,
            estudiante.correoElectronico,
            estudiante.contrasena,
            estudiante.idGrupo,
            estudiante.estado,
            estudiante.idPeriodo // Nuevo campo idPeriodo agregado
        ]);
        res.status(201).json({ message: 'Estudiante creado', id: result.insertId });
    } catch (error) {
        console.error('Error al crear estudiante:', error);
        res.status(500).json({ error: 'Error al crear estudiante' });
    }
};

// Actualizar estudiante por ID
exports.updateEstudiante = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { id } = req.params;
    const estudiante = req.body;
    try {
        const [result] = await pool.query('CALL updateEstudiante(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
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
            estudiante.contrasena,
            estudiante.idGrupo,
            estudiante.estado,
            estudiante.idPeriodo // Nuevo campo idPeriodo agregado
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
    res.setHeader('Access-Control-Allow-Origin', '*');
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

// Método para agregar imagen de perfil en la base de datos
exports.addEstudianteImgPerfil = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { id } = req.params;
    const imgPerfil = req.file.buffer;  // Obtiene los datos binarios de la imagen desde multer

    try {
        // Llamada al procedimiento almacenado para agregar imagen de perfil
        await pool.query('CALL addEstudianteImgPerfil(?, ?)', [id, imgPerfil]);
        
        res.status(200).json({ message: 'Imagen de perfil agregada correctamente' });
    } catch (error) {
        console.error('Error al agregar imagen de perfil:', error);
        res.status(500).json({ error: 'Error al agregar imagen de perfil' });
    }
};

// Método para actualizar la imagen de perfil en la base de datos
exports.updateEstudianteImgPerfil = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { id } = req.params;
    const imgPerfil = req.file;  // Asumiendo que estás usando multer para la carga de archivos

    try {
        if (!imgPerfil) {
            return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
        }

        // Llamada al procedimiento almacenado para actualizar la imagen de perfil
        await pool.query('CALL updateEstudianteImgPerfil(?, ?)', [id, imgPerfil.buffer]);
        
        // Si no hubo errores, enviar respuesta exitosa
        res.status(200).json({ message: 'Imagen de perfil actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar imagen de perfil:', error);
        res.status(500).json({ error: 'Error al actualizar imagen de perfil' });
    }
};

// Login de estudiante
exports.loginEstudiante = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { matricula, contrasena } = req.body;

    try {
        // Llamada al procedimiento almacenado para el login
        const [rows] = await pool.query('CALL loginEstudiante(?, ?, @result)', [matricula, contrasena]);
        const [result] = await pool.query('SELECT @result as result');
        const loginResult = result[0].result;

        if (loginResult === 0) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Obtener información del estudiante
        const [studentRows] = await pool.query('SELECT * FROM ESTUDIANTES WHERE idEstudiante = ?', [loginResult]);

        if (studentRows.length === 0) {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
        }

        const estudiante = studentRows[0];

        // Obtener calificaciones actuales del estudiante
        const [calificacionesActualesRows] = await pool.query('CALL getCalificacionesActuales(?)', [estudiante.idEstudiante]);

        // Obtener calificaciones anteriores del estudiante
        const [calificacionesAnterioresRows] = await pool.query('CALL getCalificacionesAnteriores(?)', [estudiante.idEstudiante]);

        // Crear token JWT
        const token = jwt.sign({ idEstudiante: estudiante.idEstudiante, matricula: estudiante.matricula }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        // Construir el objeto de respuesta
        const response = {
            message: 'Login exitoso',
            token,
            estudiante: {
                idEstudiante: estudiante.idEstudiante,
                nombre: estudiante.nombre,
                apellidoPaterno: estudiante.apellidoPaterno,
                apellidoMaterno: estudiante.apellidoMaterno,
                imgPerfil: estudiante.imgPerfil, // Incluir el campo de imagen de perfil si se necesita
                calificacionesActuales: calificacionesActualesRows[0], // Incluir las calificaciones actuales del estudiante
                calificacionesAnteriores: calificacionesAnterioresRows[0] // Incluir las calificaciones anteriores del estudiante
            }
        };

        // Enviar la respuesta
        res.status(200).json(response);
    } catch (error) {
        console.error('Error en el login de estudiante:', error);
        res.status(500).json({ error: 'Error en el login de estudiante' });
    }
};
