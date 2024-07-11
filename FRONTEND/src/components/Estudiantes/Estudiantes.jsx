

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import EstudiantesTable from './EstudiantesTable';
import AddEstudianteModal from './AddEstudiantesModal';

function Estudiantes() {
    const [estudiantes, setEstudiantes] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const fetchEstudiantes = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/sigese/estudiantes/', {
                headers: {
                    Authorization: `${token}`
                }
            });
            setEstudiantes(response.data);
        } catch (error) {
            console.error('Error fetching estudiantes:', error);
        }
    };

    useEffect(() => {
        fetchEstudiantes();
    }, []);

    return (
        <div>
            <h2 style={{ fontFamily: 'Ropa Sans', marginBottom: '20px' }}>Gestión de Estudiantes</h2>


            <Button variant="primary" onClick={() => setShowModal(true)} style={{ fontFamily: 'Ropa Sans', backgroundColor: '#165899' }}>
                Crear Estudiante
            </Button>

            <AddEstudianteModal showModal={showModal} setShowModal={setShowModal} fetchEstudiantes={fetchEstudiantes} />

            <EstudiantesTable estudiantes={estudiantes}   />
        </div>
    );
}

export default Estudiantes;
