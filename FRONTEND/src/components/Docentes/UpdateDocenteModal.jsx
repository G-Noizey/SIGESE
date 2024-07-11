import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

function UpdateDocenteModal({ showModal, setShowModal, docenteId, onUpdate }) {
    const [docenteData, setDocenteData] = useState({
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        genero: '',
        direccion: '',
        telefono: '',
        correoElectronico: '',
        contrasena: '', 
        estado: '' 
    });

    useEffect(() => {
        const fetchDocente = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/sigese/docentes/${docenteId}`, {
                    headers: {
                        Authorization: token
                    }
                });

                const { nombre, apellidoPaterno, apellidoMaterno, genero, direccion, telefono, correoElectronico, contrasena, estado } = response.data;
                setDocenteData({
                    nombre,
                    apellidoPaterno,
                    apellidoMaterno,
                    genero,
                    direccion,
                    telefono,
                    correoElectronico,
                    contrasena, 
                    estado,
                });

            } catch (error) {
                console.error('Error al obtener docente:', error);
                // Mostrar alerta de error con botón personalizado de color
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al obtener los datos del docente. Por favor, intenta de nuevo.',
                    confirmButtonColor: '#165899', // Color del botón de confirmación
                });
            }
        };

        if (showModal) {
            fetchDocente();
        }
    }, [showModal, docenteId]);

    const handleSubmit = async (event) => {
      event.preventDefault();

      const formData = new FormData(event.target);

      const updatedDocenteData = {
          nombre: formData.get('nombre'),
          apellidoPaterno: formData.get('apellidoPaterno'),
          apellidoMaterno: formData.get('apellidoMaterno'),
          genero: formData.get('genero'),
          direccion: formData.get('direccion'),
          telefono: formData.get('telefono'),
          correoElectronico: formData.get('correoElectronico'),
          contrasena: formData.get('contrasena'),
          estado: formData.get('estado') // Ahora se obtiene desde el formulario
      };

      try {
          const token = localStorage.getItem('token');
          await axios.put(`http://localhost:3000/sigese/docentes/${docenteId}`, updatedDocenteData, {
              headers: {
                  Authorization: token
              }
          });

          console.log('Docente actualizado');
          setShowModal(false); // Cierra el modal después de actualizar

          // Mostrar alerta de éxito con botón personalizado de color
          Swal.fire({
              icon: 'success',
              title: 'Docente actualizado',
              text: 'Los datos del docente han sido actualizados exitosamente.',
              confirmButtonColor: '#165899', // Color del botón de confirmación
          }).then(() => {
              onUpdate(); // Llama a la función onUpdate después de cerrar la alerta
          });

      } catch (error) {
          console.error('Error al actualizar docente:', error);
          // Mostrar alerta de error con botón personalizado de color
          Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al actualizar el docente. Por favor, intenta de nuevo.',
              confirmButtonColor: '#165899', // Color del botón de confirmación
          });
      }
  };

    return (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title style={{ fontFamily: 'Ropa Sans' }}>Actualizar Docente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {/* Información Personal */}
                    <Form.Group controlId="formNombre">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Nombre</Form.Label>
                        <Form.Control type="text" name="nombre" value={docenteData.nombre} onChange={(e) => setDocenteData({ ...docenteData, nombre: e.target.value })} required style={{ fontFamily: 'Ropa Sans' }} />
                    </Form.Group>
                    <Form.Group controlId="formApellidoPaterno">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Apellido Paterno</Form.Label>
                        <Form.Control type="text" name="apellidoPaterno" value={docenteData.apellidoPaterno} onChange={(e) => setDocenteData({ ...docenteData, apellidoPaterno: e.target.value })} required style={{ fontFamily: 'Ropa Sans' }} />
                    </Form.Group>
                    <Form.Group controlId="formApellidoMaterno">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Apellido Materno</Form.Label>
                        <Form.Control type="text" name="apellidoMaterno" value={docenteData.apellidoMaterno} onChange={(e) => setDocenteData({ ...docenteData, apellidoMaterno: e.target.value })} required style={{ fontFamily: 'Ropa Sans' }} />
                    </Form.Group>
                    <Form.Group controlId="formGenero">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Género</Form.Label>
                        <Form.Control as="select" name="genero" value={docenteData.genero} onChange={(e) => setDocenteData({ ...docenteData, genero: e.target.value })} required style={{ fontFamily: 'Ropa Sans' }}>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formDireccion">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Dirección</Form.Label>
                        <Form.Control type="text" name="direccion" value={docenteData.direccion} onChange={(e) => setDocenteData({ ...docenteData, direccion: e.target.value })} required style={{ fontFamily: 'Ropa Sans' }} />
                    </Form.Group>
                    <Form.Group controlId="formTelefono">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Teléfono</Form.Label>
                        <Form.Control type="text" name="telefono" value={docenteData.telefono} onChange={(e) => setDocenteData({ ...docenteData, telefono: e.target.value })} required style={{ fontFamily: 'Ropa Sans' }} />
                    </Form.Group>
                    <Form.Group controlId="formCorreoElectronico">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Correo Electrónico</Form.Label>
                        <Form.Control type="email" name="correoElectronico" value={docenteData.correoElectronico} onChange={(e) => setDocenteData({ ...docenteData, correoElectronico: e.target.value })} required style={{ fontFamily: 'Ropa Sans' }} />
                    </Form.Group>
                    <Form.Group controlId="formContrasena">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Contraseña</Form.Label>
                        <Form.Control type="password" name="contrasena" value={docenteData.contrasena} onChange={(e) => setDocenteData({ ...docenteData, contrasena: e.target.value })} style={{ fontFamily: 'Ropa Sans' }} />
                    </Form.Group>
                    <Form.Group controlId="formEstado">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Estado</Form.Label>
                        <Form.Control as="select" name="estado" value={docenteData.estado} onChange={(e) => setDocenteData({ ...docenteData, estado: e.target.value })} required style={{ fontFamily: 'Ropa Sans' }}>
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </Form.Control>
                    </Form.Group>

                    <Modal.Footer>
                       
                        <Button variant="primary" type="submit" style={{ backgroundColor: '#165899', fontFamily: 'Ropa Sans' }}>
                            Actualizar
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default UpdateDocenteModal;
