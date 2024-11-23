import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
    getAllRestaurants,
    deleteRestaurant,
    createRestaurant,
    updateRestaurant,
    Restaurant,
    RestaurantRequestDto,
} from '@/Api';
import EditRestaurantModal from '@/components/EditRestaurantModal';
import { useAuth } from '@/AuthContext';
import { FiEdit, FiTrash2, FiPlus, FiEye, FiArrowLeft } from 'react-icons/fi';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';

const RestaurantsPage: React.FC = () => {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

    const { token } = useAuth();

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const fetchedRestaurants = await getAllRestaurants(token!);
                setRestaurants(fetchedRestaurants);
            } catch (error) {
                console.error("Error fetching restaurants:", error);
            }
        };
        fetchRestaurants();
    }, [token]);

    const parseLocation = (location: string | { lat: number; lng: number }): { lat: number; lng: number } => {
        if (typeof location === 'object' && location !== null && 'lat' in location && 'lng' in location) {
            return location as { lat: number; lng: number };
        }
        try {
            return JSON.parse(location);
        } catch {
            return { lat: 0, lng: 0 };
        }
    };

    const handleEdit = (restaurant: Restaurant) => {
        setSelectedRestaurant(restaurant);
        setEditModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        await deleteRestaurant(id);
        setRestaurants((prev) => prev.filter((r) => r.restaurantId !== id));
    };

    const handleSave = async (data: RestaurantRequestDto) => {
        if (selectedRestaurant) {
            const updatedRestaurant = await updateRestaurant(selectedRestaurant.restaurantId, data);
            setRestaurants((prev) =>
                prev.map((r) => (r.restaurantId === updatedRestaurant.restaurantId ? updatedRestaurant : r))
            );
        } else {
            const newRestaurant = await createRestaurant(data);
            setRestaurants((prev) => [newRestaurant, ...prev]);
        }
        setEditModalOpen(false);
        setSelectedRestaurant(null);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="flex items-center space-x-2 px-4 py-2 border-gray-300 rounded-lg hover:border-gray-400"
                    >
                        <FiArrowLeft />
                        <span className="hidden sm:inline">Regresar</span>
                    </Button>
                    <h1 className="text-4xl font-bold text-gray-800">Restaurantes</h1>
                </div>
                <Button
                    onClick={() => {
                        setSelectedRestaurant(null);
                        setEditModalOpen(true);
                    }}
                    className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                    <FiPlus />
                    <span>Nuevo Restaurante</span>
                </Button>
            </div>

            {/* Restaurant Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((restaurant) => {
                    const location = parseLocation(restaurant.location);

                    return (
                        <Card key={restaurant.restaurantId} className="shadow-md rounded-lg">
                            <img
                                src="https://via.placeholder.com/400x200.png?text=Restaurant+Image"
                                alt={`Imagen de ${restaurant.name}`}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <CardContent className="p-4">
                                <CardTitle className="text-xl font-semibold">{restaurant.name}</CardTitle>
                                <CardDescription className="text-gray-500">
                                    Ubicación:{' '}
                                    {location
                                        ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
                                        : 'Ubicación no válida'}
                                    <br />
                                    Email: {restaurant.email}
                                    <br />
                                    Estado:{' '}
                                    <span
                                        className={`font-bold ${restaurant.status === 'OPEN' ? 'text-green-500' : 'text-red-500'
                                            }`}
                                    >
                                        {restaurant.status === 'OPEN' ? 'Abierto' : 'Cerrado'}
                                    </span>
                                </CardDescription>
                            </CardContent>
                            <div className="flex flex-wrap justify-between p-4 border-t border-gray-200 gap-y-2 gap-x-2">
                                <Button
                                    onClick={() => handleEdit(restaurant)}
                                    variant="outline"
                                    className="flex items-center justify-center space-x-1 text-gray-600 border-gray-300 hover:border-gray-400 flex-grow sm:flex-grow-0 sm:w-auto"
                                >
                                    <FiEdit />
                                    <span>Editar</span>
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(restaurant.restaurantId)}
                                    className="flex items-center justify-center space-x-1 text-red-500 flex-grow sm:flex-grow-0 sm:w-auto"
                                >
                                    <FiTrash2 />
                                    <span>Eliminar</span>
                                </Button>
                                <Button
                                    onClick={() => navigate(`/restaurants/${restaurant.restaurantId}/foods`)}
                                    className="flex items-center justify-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white flex-grow sm:flex-grow-0 sm:w-auto"
                                >
                                    <FiEye />
                                    <span>Ver Platillos</span>
                                </Button>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <EditRestaurantModal
                    open={isEditModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    restaurant={selectedRestaurant}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default RestaurantsPage;
