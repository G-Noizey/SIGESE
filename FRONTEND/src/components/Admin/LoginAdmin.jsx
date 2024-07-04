import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const LoginAdmin = () => {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');

    const handleLogin = () => {
        // Aquí puedes implementar la lógica para manejar el inicio de sesión
        console.log('Usuario:', usuario);
        console.log('Contraseña:', contrasena);
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="text-center">
                {/* Aquí puedes colocar tu logo */}
                <img src="../../assets/Logo.png" alt="Logo" style={{ marginBottom: '20px' }} />

                <Form style={{ maxWidth: '400px', fontFamily: 'Ropa Sans' }}>
                    <Form.Group controlId="formUsuario">
                        <Form.Label style={{ textAlign: 'left' }}>Usuario</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingrese su usuario"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            style={{ fontFamily: 'Ropa Sans' }}
                        />
                    </Form.Group>

                    <Form.Group controlId="formContrasena">
                        <Form.Label style={{ textAlign: 'left' }}>Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Ingrese su contraseña"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            style={{ fontFamily: 'Ropa Sans', marginBottom: '20px' }}
                        />
                    </Form.Group>

                   

                    <Button variant="primary" style={{ width: '100%', backgroundColor: '#165899', fontFamily: 'Ropa Sans' }} onClick={handleLogin}>
                        Confirmar
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default LoginAdmin;
