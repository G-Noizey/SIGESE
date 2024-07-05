import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Logo from '../../assets/Logo.png';
import { useAuth } from '../../components/Secure/useAuth';

const LoginAdmin = () => {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3000/sigese/admin/login', {
                usuario,
                contrasena
            });

            console.log('Respuesta del servidor:', response.data);

            if (response.data.token) {
                // Almacena el token en localStorage
                localStorage.setItem('token', response.data.token);

                // Almacena los datos del usuario en localStorage
                const userData = {
                    idAdmin: response.data.idAdmin,
                    usuario: response.data.usuario,
                    contrasena: response.data.contrasena,
                    nombre: response.data.nombre,
                    apellidoPaterno: response.data.apellidoPaterno,
                    apellidoMaterno: response.data.apellidoMaterno,
                    correo_electronico: response.data.correo_electronico
                    // Añade más campos según sea necesario
                };

                localStorage.setItem('userData', JSON.stringify(userData));

                // Llama a la función login de useAuth para manejar la sesión
                login(response.data.token);

                // Mostrar alerta de éxito con SweetAlert
                Swal.fire({
                    icon: 'success',
                    title: 'Inicio de sesión exitoso',
                    text: 'Has iniciado sesión correctamente.',
                    confirmButtonColor: '#165899'
                }).then(() => {
                    navigate('/Dashboard');
                });
            }
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            setError('Usuario o contraseña incorrectos');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="text-center">
                <img src={Logo} alt="Logo" style={{ marginBottom: '20px', width: '300px' }} />

                <Form style={{ maxWidth: '400px', fontFamily: 'Ropa Sans' }}>
                    <Form.Group controlId="formUsuario">
                        <Form.Label style={{ textAlign: 'left' }}>Usuario:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingrese su usuario"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            style={{ fontFamily: 'Ropa Sans' }}
                        />
                    </Form.Group>

                    <Form.Group controlId="formContrasena">
                        <Form.Label style={{ textAlign: 'left' }}>Contraseña:</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Ingrese su contraseña"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            style={{ fontFamily: 'Ropa Sans', marginBottom: '20px' }}
                        />
                    </Form.Group>

                    <Form.Label style={{ textAlign: 'left' }}>¿Olvidaste tu contraseña?</Form.Label>

                    <Button variant="primary" style={{ width: '100%', backgroundColor: '#165899', fontFamily: 'Ropa Sans' }} onClick={handleLogin}>
                        Confirmar
                    </Button>

                    {error && <Alert variant="danger" style={{ marginTop: '20px' }}>{error}</Alert>}
                </Form>
            </div>
        </div>
    );
};

export default LoginAdmin;
