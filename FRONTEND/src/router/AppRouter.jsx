import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../components/Secure/useAuth'; // Importa useAuth desde la ruta correcta

import LoginAdmin from '../components/Admin/LoginAdmin';
import DashBoard from '../components/Dashboard/DashBoard'; 
import Estudiantes from '../components/Estudiantes/Estudiantes';
import Docentes from '../components/Docentes/Docentes';
import Materias from '../components/Materias/Materias';
import Grupos from '../components/Grupos/Grupos';
import Periodos from '../components/Periodos/Periodos';
import Calificaciones from '../components/Calificaciones/Calificaciones';

function AppRouter() {
    const { isAuthenticated } = useAuth(); // Usa la función isAuthenticated de useAuth

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginAdmin />} />
                <Route path="/Dashboard" element={isAuthenticated() ? <DashBoard /> : <Navigate to="/" />}>
                    <Route index element={<Estudiantes />} />
                    <Route path="Estudiantes" element={<Estudiantes />} />
                    <Route path="Docentes" element={<Docentes />} />
                    <Route path="Materias" element={<Materias />} />
                    <Route path="Grupos" element={<Grupos />} />
                    <Route path="Periodos" element={<Periodos />} />
                    <Route path="Calificaciones" element={<Calificaciones />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
