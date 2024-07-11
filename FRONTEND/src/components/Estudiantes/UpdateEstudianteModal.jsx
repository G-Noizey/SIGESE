import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';


function UpdateEstudianteModal({ show, handleClose, estudianteId, onUpdate }) {
    const [estudiante, setEstudiante] = useState({
        matricula: '',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        genero: '',
        fechaNacimiento: '', // Esta debe ser inicializada correctamente
        direccion: '',
        telefono: '',
        correoElectronico: '',
        contrasena: '',
        idGrupo: '',
        estado: '',
        idPeriodo: ''
    });

    const [grupos, setGrupos] = useState([]);
    const [periodos, setPeriodos] = useState([]);

    useEffect(() => {
        const fetchGrupos = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/sigese/grupos/', {
                    headers: {
                        Authorization: token
                    }
                });
                setGrupos(response.data);
            } catch (error) {
                console.error('Error fetching grupos:', error);
            }
        };

        const fetchPeriodos = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/sigese/periodos/', {
                    headers: {
                        Authorization: token
                    }
                });
                setPeriodos(response.data);
            } catch (error) {
                console.error('Error fetching periodos:', error);
            }
        };

        const fetchEstudiante = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/sigese/estudiantes/${estudianteId}`, {
                    headers: {
                        Authorization: token
                    }
                });

                // Formatear la fecha de nacimiento
                const fechaNacimiento = formatDate(response.data.fechaNacimiento);

                setEstudiante({
                    ...response.data,
                    fechaNacimiento: fechaNacimiento
                });
            } catch (error) {
                console.error('Error fetching estudiante:', error);
            }
        };

        if (estudianteId) {
            fetchEstudiante();
        }
        fetchGrupos();
        fetchPeriodos();
    }, [estudianteId]);

    // Función para formatear la fecha a YYYY-MM-DD
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        let month = (1 + date.getMonth()).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEstudiante((prevEstudiante) => ({
            ...prevEstudiante,
            [name]: value
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        axios.put(`http://localhost:3000/sigese/estudiantes/${estudianteId}`, estudiante, {
            headers: {
                Authorization: token
            }
        }).then(() => {
            Swal.fire({
                icon: 'success',
                title: '¡Actualización exitosa!',
                text: 'El estudiante se ha actualizado correctamente.',
                confirmButtonColor: '#165899',
                confirmButtonText: 'OK',
            }).then(() => {
                onUpdate(); // Llama a la función onUpdate después de cerrar la alerta
                handleClose();
                window.location.reload(); // Recarga la página
            });
        }).catch(error => {
            console.error('Error updating estudiante:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el estudiante. Por favor, intenta nuevamente.',
                confirmButtonColor: '#165899',
                confirmButtonText: 'OK',
            });
        });
    };
    
    

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Actualizar Estudiante</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {/* Información Personal */}
                    <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                        <h5 style={{ fontFamily: 'Ropa Sans' }}>Información Personal</h5>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group controlId="matricula">
                                    <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Matrícula</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="matricula"
                                        value={estudiante.matricula}
                                        onChange={handleChange}
                                        required
                                        style={{ fontFamily: 'Ropa Sans' }}
                                    />
                                </Form.Group>
                                <Form.Group controlId="nombre">
                                    <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nombre"
                                        value={estudiante.nombre}
                                        onChange={handleChange}
                                        required
                                        style={{ fontFamily: 'Ropa Sans' }}
                                    />
                                </Form.Group>
                                <Form.Group controlId="apellidoPaterno">
                                    <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Apellido Paterno</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="apellidoPaterno"
                                        value={estudiante.apellidoPaterno}
                                        onChange={handleChange}
                                        required
                                        style={{ fontFamily: 'Ropa Sans' }}
                                    />
                                </Form.Group>
                                <Form.Group controlId="apellidoMaterno">
                                    <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Apellido Materno</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="apellidoMaterno"
                                        value={estudiante.apellidoMaterno}
                                        onChange={handleChange}
                                        required
                                        style={{ fontFamily: 'Ropa Sans' }}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group controlId="genero">
                                    <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Género</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="genero"
                                        value={estudiante.genero}
                                        onChange={handleChange}
                                        required
                                        style={{ fontFamily: 'Ropa Sans' }}
                                    >
                                        <option value="">Seleccionar género</option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Femenino">Femenino</option>
                                        <option value="Otro">Otro</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="fechaNacimiento">
                                    <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Fecha de Nacimiento</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="fechaNacimiento"
                                        value={estudiante.fechaNacimiento}
                                        onChange={handleChange}
                                        required
                                        style={{ fontFamily: 'Ropa Sans' }}
                                    />
                                </Form.Group>
                                <Form.Group controlId="direccion">
                                    <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Dirección</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="direccion"
                                        value={estudiante.direccion}
                                        onChange={handleChange}
                                        required
                                        style={{ fontFamily: 'Ropa Sans' }}
                                    />
                                </Form.Group>
                                <Form.Group controlId="telefono">
                                    <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Teléfono</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="telefono"
                                        value={estudiante.telefono}
                                        onChange={handleChange}
                                        required
                                        style={{ fontFamily: 'Ropa Sans' }}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                    </div>
                    {/* Información de Contacto */}
                    <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginTop: '20px' }}>
                        <h5 style={{ fontFamily: 'Ropa Sans' }}>Información de Contacto</h5>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group controlId="correoElectronico">
                                    <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Correo Electrónico</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="correoElectronico"
                                        value={estudiante.correoElectronico}
                                        onChange={handleChange}
                                        required
                                        style={{ fontFamily: 'Ropa Sans' }}
                                    />
                                </Form.Group>
                                </div>
                                <div className="col-md-6">
                                <Form.Group controlId="contrasena">
                                    <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="contrasena"
                                        value={estudiante.contrasena}
                                        onChange={handleChange}
                                        required
                                        style={{ fontFamily: 'Ropa Sans' }}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                    </div>

                    
                    {/* Selección de Grupo y Período */}
                    <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginTop: '20px' }}>
                        <h5 style={{ fontFamily: 'Ropa Sans' }}>Selección de Grupo y Período</h5>
                        <div className="row">

                            <div className="col-md-6">

                            <Form.Group controlId="idPeriodo">
    <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Periodo</Form.Label>
    <Form.Control
        as="select"
        name="idPeriodo"
        value={estudiante.idPeriodo}
        onChange={handleChange}
        required
        style={{ fontFamily: 'Ropa Sans' }}
    >
        {periodos.map((periodo) => (
            <option key={periodo.id} value={periodo.id} selected={estudiante.idPeriodo === periodo.id}>
                {periodo.nombre}
            </option>
        ))}
    </Form.Control>
</Form.Group>

                                



                            </div>

                            <div className="col-md-6">

                                
                            <Form.Group controlId="idGrupo">
    <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Grupo</Form.Label>
    <Form.Control
        as="select"
        name="idGrupo"
        value={estudiante.idGrupo}
        onChange={handleChange}
        required
        style={{ fontFamily: 'Ropa Sans' }}
    >
        {grupos.map((grupo) => (
            <option key={grupo.id} value={grupo.id} selected={estudiante.idGrupo === grupo.id}>
                {grupo.nombre}
            </option>
        ))}
    </Form.Control>
</Form.Group>


                          

                            </div>


                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                
                            <Form.Group controlId="estado">
                                    <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Estado</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="estado"
                                        value={estudiante.estado}
                                        onChange={handleChange}
                                        required
                                        style={{ fontFamily: 'Ropa Sans' }}
                                    >
                                        <option value="">Seleccionar estado</option>
                                        <option value="Activo">Activo</option>
                                        <option value="Inactivo">Inactivo</option>
                                    </Form.Control>
                                </Form.Group>

                            </div>
                        </div>
                    </div>
                    <div className="text-center mt-4">
                        <Button variant="primary" type="submit" style={{ backgroundColor: '#165899', fontFamily: 'Ropa Sans' }}>
                            Actualizar Estudiante
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default UpdateEstudianteModal;
