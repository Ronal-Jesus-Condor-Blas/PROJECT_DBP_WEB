import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    getFoodsByRestaurantId,
    deleteFood,
    createFood,
    updateFood,
    Food,
    FoodRequestDto,
} from '@/Api';
import { useParams, useNavigate } from 'react-router-dom';
import EditFoodModal from '@/components/EditFoodModal';
import { FiEdit, FiTrash2, FiPlus, FiArrowLeft, FiStar } from 'react-icons/fi';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';

const FoodsPage: React.FC = () => {
    const { restaurantId } = useParams<{ restaurantId: string }>();
    const navigate = useNavigate();

    const [foods, setFoods] = useState<Food[]>([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);

    useEffect(() => {
        const fetchFoods = async () => {
            const fetchedFoods = await getFoodsByRestaurantId(Number(restaurantId));
            setFoods(fetchedFoods);
        };
        fetchFoods();
    }, [restaurantId]);

    const handleEdit = (food: Food) => {
        setSelectedFood(food);
        setEditModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        await deleteFood(id);
        setFoods((prev) => prev.filter((f) => f.foodId !== id));
    };

    const handleSave = async (data: FoodRequestDto) => {
        if (selectedFood) {
            // Actualizar un platillo existente
            const updatedFood = await updateFood(selectedFood.foodId, data);
            setFoods((prev) =>
                prev.map((f) => (f.foodId === updatedFood.foodId ? updatedFood : f))
            );
        } else {
            // Crear un nuevo platillo
            const newFood = await createFood(data);
            setFoods((prev) => [newFood, ...prev]);
        }
        setEditModalOpen(false);
        setSelectedFood(null);
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
                        <span>Regresar</span>
                    </Button>
                    <h1 className="text-4xl font-bold text-gray-800">Platillos</h1>
                </div>
                <Button
                    onClick={() => {
                        setSelectedFood(null);
                        setEditModalOpen(true);
                    }}
                    className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                    <FiPlus />
                    <span>Nuevo Platillo</span>
                </Button>
            </div>

            {/* Foods Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {foods.map((food) => (
                    <Card key={food.foodId} className="shadow-md rounded-lg">
                        <img
                            src="https://via.placeholder.com/400x200.png?text=Food+Image"
                            alt={`Imagen de ${food.name}`}
                            className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <CardContent className="p-4">
                            <CardTitle className="text-xl font-semibold">{food.name}</CardTitle>
                            <CardDescription className="text-gray-500">
                                Precio: ${food.price.toFixed(2)}
                                <br />
                                Estado:{' '}
                                <span
                                    className={`font-bold ${food.status === 'AVAILABLE'
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                        }`}
                                >
                                    {food.status === 'AVAILABLE' ? 'Disponible' : 'No disponible'}
                                </span>
                            </CardDescription>
                        </CardContent>
                        <div className="flex flex-wrap justify-between p-4 border-t border-gray-200 gap-y-2 gap-x-2">
                            <Button
                                onClick={() => handleEdit(food)}
                                variant="outline"
                                className="flex items-center justify-center space-x-1 text-gray-600 border-gray-300 hover:border-gray-400 flex-grow sm:flex-grow-0 sm:w-auto"
                            >
                                <FiEdit />
                                <span>Editar</span>
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => handleDelete(food.foodId)}
                                className="flex items-center justify-center space-x-1 text-red-500 flex-grow sm:flex-grow-0 sm:w-auto"
                            >
                                <FiTrash2 />
                                <span>Eliminar</span>
                            </Button>
                            <Button
                                onClick={() => navigate(`/foods/${food.foodId}/ratings`)}
                                className="flex items-center justify-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white flex-grow sm:flex-grow-0 sm:w-auto"
                            >
                                <FiStar />
                                <span>Ver Calificaciones</span>
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <EditFoodModal
                    open={isEditModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    food={selectedFood}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default FoodsPage;
