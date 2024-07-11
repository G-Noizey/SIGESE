import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

function AddDocenteModal({ showModal, setShowModal, fetchDocentes }) {
    const [estado] = useState('Activo'); // Estado predeterminado como 'Activo'

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        const docenteData = {
            nombre: formData.get('nombre'),
            apellidoPaterno: formData.get('apellidoPaterno'),
            apellidoMaterno: formData.get('apellidoMaterno'),
            genero: formData.get('genero'),
            direccion: formData.get('direccion'),
            telefono: formData.get('telefono'),
            correoElectronico: formData.get('correoElectronico'),
            contrasena: formData.get('contrasena'),
            estado: estado // Estado predeterminado
        };

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:3000/sigese/docentes/', docenteData, {
                headers: {
                    Authorization: token
                }
            });

            console.log('Docente creado:', response.data);
            setShowModal(false); // Cierra el modal después de agregar
            fetchDocentes(); // Llama a fetchDocentes para obtener los datos actualizados

            // Mostrar alerta de éxito con botón personalizado de color
            Swal.fire({
                icon: 'success',
                title: 'Docente creado',
                text: 'El docente ha sido creado exitosamente.',
                confirmButtonColor: '#165899', // Color del botón de confirmación
            });

        } catch (error) {
            console.error('Error al crear docente:', error);
            // Mostrar alerta de error con botón personalizado de color
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al crear el docente. Por favor, intenta de nuevo.',
                confirmButtonColor: '#165899', // Color del botón de confirmación
            });
        }
    };

    return (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title style={{ fontFamily: 'Ropa Sans' }}>Agregar Docente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {/* Información Personal */}
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
                    <Form.Group controlId="formGenero">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Género</Form.Label>
                        <Form.Control as="select" name="genero" required style={{ fontFamily: 'Ropa Sans' }}>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formDireccion">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Dirección</Form.Label>
                        <Form.Control type="text" name="direccion" required style={{ fontFamily: 'Ropa Sans' }} />
                    </Form.Group>
                    <Form.Group controlId="formTelefono">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Teléfono</Form.Label>
                        <Form.Control type="text" name="telefono" required style={{ fontFamily: 'Ropa Sans' }} />
                    </Form.Group>
                    <Form.Group controlId="formCorreoElectronico">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Correo Electrónico</Form.Label>
                        <Form.Control type="email" name="correoElectronico" required style={{ fontFamily: 'Ropa Sans' }} />
                    </Form.Group>
                    <Form.Group controlId="formContrasena">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Contraseña</Form.Label>
                        <Form.Control type="password" name="contrasena" required style={{ fontFamily: 'Ropa Sans' }} />
                    </Form.Group>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)} style={{ fontFamily: 'Ropa Sans' }}>
                            Cerrar
                        </Button>
                        <Button variant="primary" type="submit" style={{ backgroundColor: '#165899', fontFamily: 'Ropa Sans' }}>
                            Crear Docente
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default AddDocenteModal;
