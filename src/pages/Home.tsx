import React, { useState } from 'react';
import "../style/Home.css";
// Archivo CSS para los estilos personalizados

const Home: React.FC = () => {
    const [surpriseMessage, setSurpriseMessage] = useState('');

    const handleSurpriseClick = (message: string) => {
        setSurpriseMessage(message);
        setTimeout(() => setSurpriseMessage(''), 3000); // Limpia el mensaje después de 3 segundos
    };

    return (
        <div className="home-container">
            <div className="home-content">
                {/* Sección izquierda */}
                <div className="left-section">
                    <h1 className="welcome-title">¡Bienvenido a FoodTails!</h1>
                    <p className="welcome-description">
                        La red social para amantes de la comida. Comparte experiencias y encuentra los mejores lugares para comer.
                    </p>
                    <div className="button-group">
                        <a href="/register" className="btn register-btn">¡Regístrate ahora!</a>
                        <a href="/login" className="btn login-btn">Inicia sesión</a>
                        <a href="/posts" className="btn login-btn">Ver Posts</a>
                        <a href="/create-post" className="btn login-btn">Crear Post</a>
                    </div>
                </div>

                {/* Sección derecha */}
                <div className="right-section">
                    {surpriseMessage && (
                        <div className="surprise-message">
                            {surpriseMessage}
                        </div>
                    )}
                    {['El pisco se disfruta mejor en Perú.', 
                      '¡El ceviche es la joya de los mares!', 
                      'La comida une culturas.', 
                      'Un buen café empieza el día con magia.'].map((message, index) => (
                        <div
                            key={index}
                            onClick={() => handleSurpriseClick(message)}
                            className="surprise-box"
                        >
                            🎁 Caja sorpresa {index + 1}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;