import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
    const [surpriseMessage, setSurpriseMessage] = useState("");
    const navigate = useNavigate();

    const handleSurpriseClick = (message: string) => {
        setSurpriseMessage(message);
        setTimeout(() => setSurpriseMessage(""), 3000);
    };

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat p-6 relative"
            style={{
                backgroundImage: `url('../src/assets/Img2.jpg')`,
            }}
        >
            {/* Superposición oscura para mejorar el contraste */}
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

            {/* Contenido principal */}
            <Card className="w-full max-w-6xl shadow-lg rounded-xl overflow-hidden relative z-10 bg-white bg-opacity-90">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Sección izquierda */}
                    <div className="p-6 flex flex-col items-center justify-center bg-white">
                        <img
                            src="fancy_restaurant.jpg"
                            alt="Delicious food"
                            className="w-full max-w-md rounded-lg shadow-md mb-6 border-4 border-yellow-500"
                        />
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
                                ¡Bienvenido a FoodTails!
                            </CardTitle>
                            <p className="text-lg text-gray-600">
                                La red social para amantes de la comida. Comparte experiencias
                                y encuentra los mejores lugares para comer.
                            </p>
                        </CardHeader>
                        <div className="flex flex-wrap gap-4 mt-6">
                            <Button
                                onClick={() => navigate("/register")}
                                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                            >
                                ¡Regístrate ahora!
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => navigate("/login")}
                                className="border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white"
                            >
                                Inicia sesión
                            </Button>
                        </div>
                    </div>

                    {/* Sección derecha */}
                    <div className="p-6 bg-yellow-100 flex flex-col justify-center">
                        {surpriseMessage && (
                            <Alert className="mb-4 bg-black text-white font-semibold">
                                <AlertDescription>{surpriseMessage}</AlertDescription>
                            </Alert>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                "El pisco se disfruta mejor en Perú.",
                                "¡El ceviche es la joya de los mares!",
                                "La comida une culturas.",
                                "Un buen café empieza el día con magia.",
                            ].map((message, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-center border-2 border-yellow-500 bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-yellow-500 transition"
                                    onClick={() => handleSurpriseClick(message)}
                                >
                                    <p className="text-center text-gray-800 font-bold">
                                        🎁 Caja sorpresa {index + 1}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Home;
