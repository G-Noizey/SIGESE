import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

function AddEstudianteModal({ showModal, setShowModal, fetchEstudiantes }) {
    const [periodos, setPeriodos] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [selectedPeriodo, setSelectedPeriodo] = useState('');
    const [selectedGrupo, setSelectedGrupo] = useState('');

    useEffect(() => {
        if (showModal) {
            fetchPeriodos();
        }
    }, [showModal]);

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

    const fetchGrupos = async (periodoId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/sigese/grupos/periodo/${periodoId}`, {
                headers: {
                    Authorization: token
                }
            });
    
            // Mapear los datos recibidos para asegurarnos de que cada grupo tenga un ID numérico
            const gruposData = response.data.map(grupo => ({
                id: grupo.idGrupo,
                nombre: grupo.nombre
            }));
    
            setGrupos(gruposData);
        } catch (error) {
            console.error('Error fetching grupos:', error);
        }
    };
    
    
    const handlePeriodoChange = (event) => {
        const periodoId = parseInt(event.target.value); // Asegurar que periodoId sea numérico
        setSelectedPeriodo(periodoId);
        fetchGrupos(periodoId);
    };
    

    const handleGrupoChange = (event) => {
        const value = event.target.value; // Obtener el valor seleccionado (cadena de texto)
        console.log('Valor seleccionado del grupo:', value);
    
        // Convertir el valor a número entero, asegurándonos de manejar casos no válidos
        const grupoId = parseInt(value, 10);
        
        // Verificar si la conversión fue exitosa y no es NaN
        if (!isNaN(grupoId)) {
            console.log('ID del grupo seleccionado:', grupoId);
            setSelectedGrupo(grupoId); // Asignar el ID del grupo seleccionado al estado
        } else {
            console.error('Valor no válido para el ID del grupo:', value);
        }
    };
    

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const formData = new FormData(event.target);
    
        // Obtener el valor de estado del formulario o establecerlo por defecto
        const estado = formData.get('estado') || 'Activo';
    
        const estudianteData = {
            matricula: formData.get('matricula'),
            nombre: formData.get('nombre'),
            apellidoPaterno: formData.get('apellidoPaterno'),
            apellidoMaterno: formData.get('apellidoMaterno'),
            genero: formData.get('genero'),
            fechaNacimiento: formData.get('fechaNacimiento'),
            direccion: formData.get('direccion'),
            telefono: formData.get('telefono'),
            correoElectronico: formData.get('correoElectronico'),
            contrasena: formData.get('contrasena'),
            idGrupo: selectedGrupo,
            estado: estado, // Asignar el valor de estado obtenido o por defecto
            idPeriodo: selectedPeriodo,
        };
    
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:3000/sigese/estudiantes/', estudianteData, {
                headers: {
                    Authorization: token
                }
            });
    
            console.log('Estudiante creado:', response.data);
            setShowModal(false); // Cierra el modal después de agregar
            fetchEstudiantes(); // Llama a fetchEstudiantes para obtener los datos actualizados
    
            // Mostrar alerta de éxito con botón personalizado de color
            Swal.fire({
                icon: 'success',
                title: 'Estudiante creado',
                text: 'El estudiante ha sido creado exitosamente.',
                confirmButtonColor: '#165899', // Color del botón de confirmación
            });
    
        } catch (error) {
            console.error('Error al crear estudiante:', error);
            // Mostrar alerta de error con botón personalizado de color
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al crear el estudiante. Por favor, intenta de nuevo.',
                confirmButtonColor: '#165899', // Color del botón de confirmación
            });
        }
    };
    

    return (

<Modal show={showModal} onHide={() => setShowModal(false)}>
    <Modal.Header closeButton>
        <Modal.Title>Agregar Estudiante</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Form onSubmit={handleSubmit}>
            <div>
                {/* Información Personal */}
                <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                    <h5 style={{ fontFamily: 'Ropa Sans' }}>Información Personal</h5>
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group controlId="formMatricula">
                                <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Matrícula</Form.Label>
                                <Form.Control type="text" name="matricula" required style={{ fontFamily: 'Ropa Sans' }} />
                            </Form.Group>
                            <Form.Group controlId="formNombre">
                                <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Nombre</Form.Label>
                                <Form.Control type="text" name="nombre" required style={{ fontFamily: 'Ropa Sans' }} />
                            </Form.Group>
                            <Form.Group controlId="formApellidoPaterno">
                                <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Apellido Paterno</Form.Label>
                                <Form.Control type="text" name="apellidoPaterno" required style={{ fontFamily: 'Ropa Sans' }} />
                            </Form.Group>
                            <Form.Group controlId="formApellidoMaterno">
                                <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Apellido Materno</Form.Label>
                                <Form.Control type="text" name="apellidoMaterno" required style={{ fontFamily: 'Ropa Sans' }} />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group controlId="formGenero">
                                <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Género</Form.Label>
                                <Form.Control as="select" name="genero" required style={{ fontFamily: 'Ropa Sans' }}>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Femenino">Femenino</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formFechaNacimiento">
                                <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Fecha de Nacimiento</Form.Label>
                                <Form.Control type="date" name="fechaNacimiento" required style={{ fontFamily: 'Ropa Sans' }} />
                            </Form.Group>
                            <Form.Group controlId="formDireccion">
                                <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Dirección</Form.Label>
                                <Form.Control type="text" name="direccion" required style={{ fontFamily: 'Ropa Sans' }} />
                            </Form.Group>
                            <Form.Group controlId="formTelefono">
                                <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Teléfono</Form.Label>
                                <Form.Control type="text" name="telefono" required style={{ fontFamily: 'Ropa Sans' }} />
                            </Form.Group>
                        </div>
                    </div>
                </div>
                
                {/* Información de Inscripción */}
                <div style={{ marginTop: '20px' }}>
                    <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                        <h5 style={{ fontFamily: 'Ropa Sans' }}>Información de Inscripción</h5>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group controlId="formCorreoElectronico">
                                    <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Correo Electrónico</Form.Label>
                                    <Form.Control type="email" name="correoElectronico" required style={{ fontFamily: 'Ropa Sans' }} />
                                </Form.Group>
                                <Form.Group controlId="formContrasena">
                                    <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Contraseña</Form.Label>
                                    <Form.Control type="password" name="contrasena" required style={{ fontFamily: 'Ropa Sans' }} />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group controlId="formIdPeriodo">
                                    <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Periodo</Form.Label>
                                    <Form.Control as="select" name="idPeriodo" required style={{ fontFamily: 'Ropa Sans' }} onChange={handlePeriodoChange}>
                                        <option value="">Seleccionar periodo</option>
                                        {periodos.map((periodo) => (
                                            <option key={periodo.id} value={periodo.id}>
                                                {periodo.nombre}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="formIdGrupo">
                                    <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Grupo</Form.Label>
                                    <Form.Control as="select" name="idGrupo" required style={{ fontFamily: 'Ropa Sans' }} onChange={handleGrupoChange} disabled={!selectedPeriodo}>
                                        <option value="">Seleccionar grupo</option>
                                        {grupos.map((grupo) => (
                                            <option key={grupo.id} value={grupo.id}>
                                                {grupo.nombre}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal.Footer>
            
                <Button variant="primary" type="submit" style={{ fontFamily: 'Ropa Sans', backgroundColor: '#165899' }}>
                    Crear Estudiante
                </Button>
            </Modal.Footer>
        </Form>
    </Modal.Body>
</Modal>


    );
}

export default AddEstudianteModal;
