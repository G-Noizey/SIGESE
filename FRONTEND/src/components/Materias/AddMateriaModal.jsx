import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddMateriaModal = ({ showModal, setShowModal, fetchMaterias }) => {
    const [nombre, setNombre] = useState('');
    const [idGrupo, setIdGrupo] = useState('');
    const [grupos, setGrupos] = useState([]);
    const [error, setError] = useState(null);

    // Función para obtener la lista de grupos desde el servidor
    const fetchGrupos = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/sigese/grupos', {
                headers: {
                    Authorization: token,
                },
            });
            setGrupos(response.data);
        } catch (error) {
            console.error('Error fetching grupos:', error);
            setError('Error al obtener la lista de grupos');
        }
    };

    // Llama a fetchGrupos cuando se monta el componente modal
    useEffect(() => {
        fetchGrupos();
    }, []);

    // Función para manejar el envío del formulario
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:3000/sigese/materias',
                {
                    nombre,
                    idGrupo,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            fetchMaterias(); // Actualiza la lista de materias después de agregar una nueva
            handleClose(); // Cierra el modal después de agregar la materia

            // Mostrar alerta de éxito con botón personalizado de color
            Swal.fire({
                icon: 'success',
                title: 'Materia creada',
                text: 'La materia ha sido creada exitosamente.',
                confirmButtonColor: '#165899', // Color del botón de confirmación
            });

        } catch (error) {
            console.error('Error al crear materia:', error);
            // Mostrar alerta de error con botón personalizado de color
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al crear la materia. Por favor, intenta de nuevo.',
                confirmButtonColor: '#165899', // Color del botón de confirmación
            });
        }
    };

    // Función para cerrar el modal
    const handleClose = () => {
        setShowModal(false);
        setNombre('');
        setIdGrupo('');
        setError(null);
    };

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title style={{ fontFamily: 'Ropa Sans' }}>Agregar Materia</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formNombre">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Nombre de la Materia</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingrese el nombre de la materia"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            style={{ fontFamily: 'Ropa Sans' }}
                        />
                    </Form.Group>
                    <Form.Group controlId="formGrupo">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Grupo</Form.Label>
                        <Form.Control
                            as="select"
                            value={idGrupo}
                            onChange={(e) => setIdGrupo(e.target.value)}
                            required
                            style={{ fontFamily: 'Ropa Sans' }}
                        >
                            <option value="">Seleccione un grupo</option>
                            {grupos.map((grupo) => (
                                <option key={grupo.idGrupo} value={grupo.idGrupo}>
                                    {grupo.nombre}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    {error && <p style={{ color: 'red', fontFamily: 'Ropa Sans' }}>{error}</p>}
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose} style={{ fontFamily: 'Ropa Sans' }}>
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit" style={{ fontFamily: 'Ropa Sans' }}>
                            Agregar Materia
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddMateriaModal;
