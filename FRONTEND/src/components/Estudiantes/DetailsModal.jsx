import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

function DetailsModal({ show, handleClose, estudianteId }) {
    const [estudiante, setEstudiante] = useState(null);
    const [grupo, setGrupo] = useState('');
    const [periodo, setPeriodo] = useState('');

    useEffect(() => {
        const fetchEstudiante = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/sigese/estudiantes/${estudianteId}`, {
                    headers: {
                        Authorization: token
                    }
                });
                setEstudiante(response.data);
                return response.data; // Return data for further processing
            } catch (error) {
                console.error('Error fetching estudiante:', error);
            }
        };

        const fetchGrupo = async (idGrupo) => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/sigese/grupos/${idGrupo}`, {
                    headers: {
                        Authorization: token
                    }
                });
                setGrupo(response.data.nombre);
            } catch (error) {
                console.error('Error fetching grupo:', error);
            }
        };

        const fetchPeriodo = async (idPeriodo) => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/sigese/periodos/${idPeriodo}`, {
                    headers: {
                        Authorization: token
                    }
                });
                setPeriodo(response.data.nombre);
            } catch (error) {
                console.error('Error fetching periodo:', error);
            }
        };

        if (estudianteId) {
            fetchEstudiante().then((data) => {
                if (data) {
                    fetchGrupo(data.idGrupo);
                    fetchPeriodo(data.idPeriodo);
                }
            });
        }
    }, [estudianteId]);

    if (!estudiante) {
        return null;
    }

    return (
<Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title style={{ fontFamily: 'Ropa Sans' }}>Detalles del Estudiante</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                    <h5 style={{ fontFamily: 'Ropa Sans' }}>Información Personal</h5>
                    <div className="row">
                        <div className="col-md-6">
                            <p style={{ fontFamily: 'Ropa Sans' }}><strong>Matrícula:</strong> {estudiante.matricula}</p>
                            <p style={{ fontFamily: 'Ropa Sans' }}><strong>Nombre:</strong> {estudiante.nombre}</p>
                            <p style={{ fontFamily: 'Ropa Sans' }}><strong>Apellido Paterno:</strong> {estudiante.apellidoPaterno}</p>
                            <p style={{ fontFamily: 'Ropa Sans' }}><strong>Apellido Materno:</strong> {estudiante.apellidoMaterno}</p>
                        </div>
                        <div className="col-md-6">
                            <p style={{ fontFamily: 'Ropa Sans' }}><strong>Género:</strong> {estudiante.genero}</p>
                            <p style={{ fontFamily: 'Ropa Sans' }}><strong>Fecha de Nacimiento:</strong> {new Date(estudiante.fechaNacimiento).toLocaleDateString()}</p>
                            <p style={{ fontFamily: 'Ropa Sans' }}><strong>Dirección:</strong> {estudiante.direccion}</p>
                        </div>
                    </div>
                </div>
                <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginTop: '20px' }}>
                    <h5 style={{ fontFamily: 'Ropa Sans' }}>Información de Contacto</h5>

                    <div className="row">
                        <div className="col-md-12">
                            <p style={{ fontFamily: 'Ropa Sans' }}><strong>Correo Electrónico:</strong> {estudiante.correoElectronico}</p>
                            <p style={{ fontFamily: 'Ropa Sans' }}><strong>Teléfono:</strong> {estudiante.telefono}</p>

                        </div>
                    </div>

                </div>
                
                <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginTop: '20px' }}>
                    <h5 style={{ fontFamily: 'Ropa Sans' }}>Grupo y Período</h5>

                    <div className="row">
                        <div className="col-md-6">
                            <p style={{ fontFamily: 'Ropa Sans' }}><strong>Periodo:</strong> {periodo}</p>
                        </div>
                        <div className="col-md-6">
                            <p style={{ fontFamily: 'Ropa Sans' }}><strong>Grupo:</strong> {grupo}</p>
                        </div>
                    </div>
                    
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} style={{ fontFamily: 'Ropa Sans' }}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>


    );
}

export default DetailsModal;
