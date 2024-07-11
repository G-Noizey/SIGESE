import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import MateriasTable from './MateriasTable'; // Asegúrate de crear este componente
import AddMateriaModal from './AddMateriaModal'; // Asegúrate de crear este componente

function Materias() {
    const [materias, setMaterias] = useState([]);
    const [showModal, setShowModal] = useState(false);

    // Función para obtener la lista de materias desde el servidor
    const fetchMaterias = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/sigese/materias/', {
                headers: {
                    Authorization: token
                }
            });
            setMaterias(response.data);
        } catch (error) {
            console.error('Error fetching materias:', error);
        }
    };

    // Llama a fetchMaterias cuando se monta el componente
    useEffect(() => {
        fetchMaterias();
    }, []);

    return (
        <div>
            <h2 style={{ fontFamily: 'Ropa Sans', marginBottom: '20px' }}>Gestión de Materias</h2>

            <Button
                variant="primary"
                onClick={() => setShowModal(true)}
                style={{ fontFamily: 'Ropa Sans', backgroundColor: '#165899' }}
            >
                Crear Materia
            </Button>

            <AddMateriaModal showModal={showModal} setShowModal={setShowModal} fetchMaterias={fetchMaterias} />

            <MateriasTable materias={materias} /> {/* Asegúrate de crear este componente */}
        </div>
    );
}

export default Materias;
