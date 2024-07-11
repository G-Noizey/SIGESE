import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import DocentesTable from './DocentesTable';
import AddDocenteModal from './AddDocenteModal'; // Asegúrate de crear este componente

function Docentes() {
    const [docentes, setDocentes] = useState([]);
    const [showModal, setShowModal] = useState(false);

    // Función para obtener la lista de docentes desde el servidor
    const fetchDocentes = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/sigese/docentes/', {
                headers: {
                    Authorization: token
                }
            });
            setDocentes(response.data);
        } catch (error) {
            console.error('Error fetching docentes:', error);
        }
    };

    // Llama a fetchDocentes cuando se monta el componente
    useEffect(() => {
        fetchDocentes();
    }, []);

    return (
        <div>
            <h2 style={{ fontFamily: 'Ropa Sans', marginBottom: '20px' }}>Gestión de Docentes</h2>

            <Button
                variant="primary"
                onClick={() => setShowModal(true)}
                style={{ fontFamily: 'Ropa Sans', backgroundColor: '#165899' }}
            >
                Crear Docente
            </Button>

            <AddDocenteModal showModal={showModal} setShowModal={setShowModal} fetchDocentes={fetchDocentes} />

            <DocentesTable docentes={docentes} /> {/* Asegúrate de crear este componente */}
        </div>
    );
}

export default Docentes;
