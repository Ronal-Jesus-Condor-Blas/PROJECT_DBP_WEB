import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getFoodRatingsByFoodId,
    createFoodRating,
    updateFoodRating,
    deleteFoodRating,
} from '@/Api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { FiArrowLeft, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import EditFoodRatingModal from '@/components/EditFoodRatingModal';
import { useAuth } from '@/AuthContext';

interface FoodRating {
    comment: string;
    foodId: number;
    foodRatingId: number;
    rating: number;
    ratingDate: string;
    userId: number;
}

const FoodRatingsPage: React.FC = () => {
    const { foodId } = useParams<{ foodId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [ratings, setRatings] = useState<FoodRating[]>([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedRating, setSelectedRating] = useState<FoodRating | null>(null);

    useEffect(() => {
        const fetchRatings = async () => {
            if (!foodId) {
                console.error('No se encontró el ID del alimento.');
                return;
            }
            try {
                const fetchedRatings = await getFoodRatingsByFoodId(Number(foodId));
                console.log('Calificaciones cargadas:', fetchedRatings);
                setRatings(fetchedRatings);
            } catch (error) {
                console.error('Error al cargar las calificaciones:', error);
                alert('No se pudo cargar las calificaciones.');
            }
        };
        fetchRatings();
    }, [foodId]);

    const handleAdd = () => {
        setSelectedRating(null);
        setEditModalOpen(true);
    };

    const handleEdit = (rating: FoodRating) => {
        setSelectedRating(rating);
        setEditModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!id) {
            console.error('No se puede eliminar la calificación sin un ID válido.');
            alert('No se encontró un ID válido para eliminar la calificación.');
            return;
        }
        try {
            await deleteFoodRating(id);
            setRatings((prev) => prev.filter((r) => r.foodRatingId !== id));
        } catch (error) {
            console.error('Error al eliminar la calificación:', error);
            alert('No se pudo eliminar la calificación.');
        }
    };


    const handleSave = async (data: { rating: number; comment: string }) => {
        if (!foodId) {
            alert('No se puede guardar la calificación sin un ID de alimento.');
            return;
        }
        try {
            if (selectedRating) {
                const updatedRating = await updateFoodRating(selectedRating.foodRatingId, data);
                setRatings((prev) =>
                    prev.map((r) => (r.foodRatingId === selectedRating.foodRatingId ? updatedRating : r))
                );
            } else {
                const newRating = await createFoodRating({
                    ...data,
                    foodId: Number(foodId),
                    userId: Number(user?.userId || 0),
                });
                setRatings((prev) => [newRating, ...prev]);
            }
            setEditModalOpen(false);
            setSelectedRating(null);
        } catch (error) {
            console.error('Error al guardar la calificación:', error);
            alert('No se pudo guardar la calificación. Inténtalo nuevamente.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 px-4 py-2 border-gray-300 rounded-lg hover:border-gray-400"
                >
                    <FiArrowLeft />
                    <span>Regresar</span>
                </Button>
                <div className="flex items-center space-x-4">
                    <h1 className="text-4xl font-bold text-gray-800">Calificaciones</h1>
                    <Button
                        onClick={handleAdd}
                        className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                        <FiPlus />
                        <span>Agregar Calificación</span>
                    </Button>
                </div>
            </div>

            {/* Ratings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ratings.map((rating) => (
                    <Card key={`rating-${rating.foodRatingId}`} className="shadow-md rounded-lg">
                        <CardContent className="p-4">
                            <CardTitle className="text-xl font-semibold">Calificación: {rating.rating}/5</CardTitle>
                            <CardDescription className="text-gray-500">
                                {rating.comment || 'Sin comentarios'}
                            </CardDescription>
                        </CardContent>
                        <div className="flex justify-between p-4 border-t border-gray-200">
                            <Button
                                onClick={() => handleEdit(rating)}
                                variant="outline"
                                className="flex items-center space-x-1 text-gray-600"
                            >
                                <FiEdit />
                                <span>Editar</span>
                            </Button>
                            <Button
                                onClick={() => handleDelete(rating.foodRatingId)}
                                variant="destructive"
                                className="flex items-center space-x-1 text-red-500"
                            >
                                <FiTrash2 />
                                <span>Eliminar</span>
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <EditFoodRatingModal
                    open={isEditModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    rating={selectedRating}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default FoodRatingsPage;
