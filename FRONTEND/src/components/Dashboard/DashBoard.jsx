import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap';
import { FaUserGraduate, FaChalkboardTeacher, FaBook, FaUsers, FaCalendarAlt, FaCheckCircle, FaSignOutAlt } from 'react-icons/fa';
import Logo from '../../assets/Logo.png';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function DashBoard() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState('');

    useEffect(() => {
        // Obtener datos del localStorage al cargar el componente
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            setUsuario(userData.usuario); // Asignar el nombre de usuario desde localStorage
        }
    }, []);

    const handleLogout = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Quieres cerrar sesión?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Limpiar localStorage al hacer logout
                localStorage.removeItem('token');
                localStorage.removeItem('userData');
                navigate('/'); // Redirigir a la página de inicio de sesión
            }
        });
    };

    return (
        <div>
            {/* Barra de navegación */}
            <Navbar bg="light" variant="light" expand="lg">
                <Container fluid>
                    <Navbar.Brand  style={{ fontFamily: 'Ropa Sans' }}>SISTEMA DE GESTIÓN DE SERVICIOS EDUCATIVOS</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link onClick={handleLogout} className="nav-link logout-link" style={{ fontFamily: 'Ropa Sans' }}>
                                <FaSignOutAlt style={{ marginRight: '20px' }} />
                                {usuario}
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Contenido principal */}
            <Container fluid>
                <Row>
                    {/* Sidebar */}
                    <Col md={2} className="bg-light sidebar">
                        <div className="text-center my-3">
                            <img src={Logo} alt="Logo" style={{ width: '200px' }} />
                        </div>
                        <Nav className="flex-column">
                            <Link to="/Dashboard/Estudiantes" className="nav-link"><FaUserGraduate style={{ marginRight: '20px' }} /> Estudiantes</Link>
                            <Link to="/Dashboard/Docentes" className="nav-link"><FaChalkboardTeacher style={{ marginRight: '20px' }} /> Docentes</Link>
                            <Link to="/Dashboard/Materias" className="nav-link"><FaBook style={{ marginRight: '20px' }} /> Materias</Link>
                            <Link to="/Dashboard/Grupos" className="nav-link"><FaUsers style={{ marginRight: '20px' }} /> Grupos</Link>
                            <Link to="/Dashboard/Periodos" className="nav-link"><FaCalendarAlt style={{ marginRight: '20px' }} /> Periodos</Link>
                            <Link to="/Dashboard/Calificaciones" className="nav-link"><FaCheckCircle style={{ marginRight: '20px' }} /> Calificaciones</Link>
                        </Nav>
                        <div className="sidebar-border"></div>
                    </Col>

                    {/* Contenido */}
                    <Col md={10} className="main-content" style={{ padding: '30px' }}>
                        <Outlet /> {/* Este outlet renderiza el contenido dinámico */}
                    </Col>
                </Row>
            </Container>

            {/* Estilos personalizados */}
            <style>{`
                .sidebar-border {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 15px; /* Ancho del borde ajustado */
                    height: 100%;
                    background-color: #165899;
                }
                .sidebar {
                    position: relative;
                    height: 100vh;
                    padding: 20px;
                    background-color: #f8f9fa;
                }
                .nav-link {
                    color: black;
                    padding: 15px;
                    display: flex;
                    align-items: center;
                    transition: background-color 0.5s ease; /* Transición de color al hacer hover */
                    font-family: 'Ropa Sans';
                    border-radius: 15px;
                }
                .nav-link:hover {
                    background-color: #165899; /* Color de fondo al hacer hover */
                    color: white; /* Color de texto al hacer hover */
                    border-radius: 15px;
                }
                .logout-link {
                    transition: none; /* Anula cualquier transición en este enlace */
                }
                .logout-link:hover {
                    background-color: transparent; /* Evita cualquier cambio de color al hacer hover */
                    color: black; /* Mantiene el color de texto normal */
                }
                .nav-link svg {
                    margin-left: 70px; /* Alineación a la derecha */
                    margin-right: 20px; /* Espacio entre el texto y el icono */
                    border-radius: 15px;
                }
            `}</style>
        </div>
    );
}

export default DashBoard;
