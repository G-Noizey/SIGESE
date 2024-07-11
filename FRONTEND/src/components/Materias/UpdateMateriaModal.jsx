import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

function UpdateMateriaModal({ showModal, setShowModal, materiaId, onUpdate }) {
    const [materiaData, setMateriaData] = useState({
        nombre: '',
        idGrupo: '',
    });

    const [grupos, setGrupos] = useState([]);
    const [grupoNombre, setGrupoNombre] = useState('');

    useEffect(() => {
        const fetchMateria = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/sigese/materias/${materiaId}`, {
                    headers: {
                        Authorization: token,
                    },
                });

                console.log('Materia Data:', response.data); // Verificar datos obtenidos

                const { nombre, idGrupo } = response.data;
                setMateriaData({
                    nombre,
                    idGrupo,
                });
                fetchGrupoName(idGrupo);
            } catch (error) {
                console.error('Error fetching materia:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al obtener los datos de la materia. Por favor, intenta de nuevo.',
                    confirmButtonColor: '#165899',
                });
            }
        };

        const fetchGrupos = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/sigese/grupos`, {
                    headers: {
                        Authorization: token,
                    },
                });
                setGrupos(response.data);
            } catch (error) {
                console.error('Error fetching grupos:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al obtener los grupos. Por favor, intenta de nuevo.',
                    confirmButtonColor: '#165899',
                });
            }
        };

        if (showModal && materiaId) {
            fetchMateria();
            fetchGrupos();
        }
    }, [showModal, materiaId]);

    const fetchGrupoName = (idGrupo) => {
        const grupo = grupos.find(grupo => grupo.id === idGrupo);
        if (grupo) {
            setGrupoNombre(grupo.nombre);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const updatedMateriaData = {
            nombre: materiaData.nombre,
            idGrupo: parseInt(materiaData.idGrupo, 10), // Asegurarse de que el idGrupo sea un número entero
        };

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3000/sigese/materias/${materiaId}`, updatedMateriaData, {
                headers: {
                    Authorization: token,
                },
            });

            setShowModal(false);
            Swal.fire({
                icon: 'success',
                title: 'Materia actualizada',
                text: 'Los datos de la materia han sido actualizados correctamente.',
                confirmButtonColor: '#165899',
            }).then(() => {
                onUpdate();
            });

        } catch (error) {
            console.error('Error updating materia:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al actualizar la materia. Por favor, intenta de nuevo.',
                confirmButtonColor: '#165899',
            });
        }
    };

    return (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title style={{ fontFamily: 'Ropa Sans' }}>Actualizar Materia</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formNombre">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Nombre de la Materia</Form.Label>
                        <Form.Control type="text" name="nombre" value={materiaData.nombre} onChange={(e) => setMateriaData({ ...materiaData, nombre: e.target.value })} required style={{ fontFamily: 'Ropa Sans' }} />
                    </Form.Group>
                    <Form.Group controlId="formGrupo">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Grupo</Form.Label>
                        <Form.Control as="select" name="idGrupo" value={materiaData.idGrupo} onChange={(e) => setMateriaData({ ...materiaData, idGrupo: e.target.value })} required style={{ fontFamily: 'Ropa Sans' }}>
                            <option value="" disabled>Seleccione un grupo</option>
                            {grupos.map((grupo) => (
                                <option key={grupo.id} value={grupo.id}>
                                    {grupo.nombre}
                                </option>
                            ))}
                        </Form.Control>
                        {grupoNombre && (
                            <Form.Text muted>
                                Nombre del Grupo: <strong>{grupoNombre}</strong>
                            </Form.Text>
                        )}
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

export default UpdateMateriaModal;
