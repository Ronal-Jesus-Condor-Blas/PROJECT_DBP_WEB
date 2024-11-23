import React, { useState } from 'react';
import { register, JwtAuthResponse, RegisterReq } from '../Api';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState(''); // New field
    const [userType, setUserType] = useState('CONSUMER'); // Default value
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // New state for success message

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const registerReq: RegisterReq = { email, password, name, bio, userType };

        try {
            const response: JwtAuthResponse = await register(registerReq);
            console.log('Registration successful! Token:', response.token);
            setSuccessMessage('¡Registro exitoso!');
            setError('');
            window.location.href = '/login';
        } catch (err) {
            console.error('Registration failed:', err);
            setError('Error al registrarse. Por favor, inténtalo de nuevo.');
            setSuccessMessage('');
        }
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat relative"
            style={{
                backgroundImage: `url('../src/assets/Img2.jpg')`, // Ruta de tu imagen
            }}
        >
            {/* Superposición */}
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>

            {/* Botón FoodTails */}
            <a
                href="/"
                className="absolute top-6 left-6 bg-yellow-600 hover:bg-yellow-700 text-black px-4 py-2 rounded-lg text-lg font-semibold shadow-md"
            >
                FoodTails
            </a>

            {/* Formulario */}
            <div className="relative z-10 bg-white bg-opacity-90 p-6 rounded-xl shadow-xl w-full max-w-md mx-4">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Registro</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Biografía</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Usuario</label>
                        <select
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                            <option value="INFLUENCER">Influencer</option>
                            <option value="CONSUMER">Consumidor</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold py-2 rounded-lg transition duration-300"
                    >
                        Registrar
                    </button>
                </form>
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                {successMessage && <p className="text-green-500 text-center mt-4">{successMessage}</p>}
                <div className="mt-4 text-center">
                    <p>
                        ¿Ya tienes una cuenta?{' '}
                        <a
                            href="/login"
                            className="text-yellow-500 hover:text-yellow-600 font-semibold"
                        >
                            Inicia sesión
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
