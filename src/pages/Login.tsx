import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import { login, JwtAuthResponse, LoginReq } from '../Api';

// Global CSS reset styles
const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html, body, #root {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
`;

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // Estado para mensaje de éxito
    const navigate = useNavigate(); // Hook para redirigir

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const loginReq: LoginReq = { email, password };

        try {
            const response: JwtAuthResponse = await login(loginReq);
            localStorage.setItem('token', response.token); // Guardar token en localStorage
            console.log("Token en el local storage: ", localStorage.getItem('token'));
            setSuccessMessage('¡Inicio de sesión exitoso!');
            setError(''); // Limpiar errores previos
            // Redirigir a la página de Home
            setTimeout(() => navigate('/'), 1000); // Espera 1 segundo antes de redirigir
        } catch (err) {
            console.error('Login failed:', err); // Log de error
            setError('Inicio de sesión fallido. Por favor, verifica tus credenciales.');
            setSuccessMessage(''); // Limpiar mensajes de éxito previos
        }
    };

    return (
        <>
            {/* Inject global styles */}
            <style>{styles}</style>
            <div
                style={{
                    position: 'relative',
                    backgroundImage: `url('../src/assets/Img2.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#fff',
                }}
            >
                {/* Botón FoodTails */}
                <a
                    href="/"
                    style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: '#8B4513',
                        color: '#fff',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
                        cursor: 'pointer',
                    }}
                >
                    FoodTails
                </a>

                <div
                    style={{
                        background: 'rgba(0, 0, 0, 0.7)',
                        padding: '30px',
                        borderRadius: '10px',
                        width: '90%',
                        maxWidth: '400px',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
                    }}
                >
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    border: '1px solid #ccc',
                                    outline: 'none',
                                    color: '#000',
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    border: '1px solid #ccc',
                                    outline: 'none',
                                    color: '#000',
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            style={{
                                background: '#8B4513',
                                color: '#fff',
                                padding: '10px',
                                borderRadius: '5px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '16px',
                            }}
                        >
                            Login
                        </button>
                    </form>
                    {/* Mostrar mensajes de éxito o error */}
                    {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
                    {successMessage && <p style={{ color: 'green', marginTop: '10px' }}>{successMessage}</p>}
                    
                    {/* Links adicionales */}
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <p style={{ marginBottom: '10px' }}>
                            ¿No tienes cuenta?{' '}
                            <a
                                href="/register"
                                style={{ color: '#4CAF50', textDecoration: 'none', fontWeight: 'bold' }}
                            >
                                Regístrate
                            </a>
                        </p>
                        <p>
                            ¿Olvidaste tu contraseña?{' '}
                            <a
                                href="/forgot-password"
                                style={{ color: '#4CAF50', textDecoration: 'none', fontWeight: 'bold' }}
                            >
                                Recuperar
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
