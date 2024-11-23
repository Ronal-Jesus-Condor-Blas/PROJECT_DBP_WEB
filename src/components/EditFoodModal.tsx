import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Importar useParams para obtener el restaurantId
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Food, FoodRequestDto } from '@/Api';

interface EditFoodModalProps {
    open: boolean;
    onClose: () => void;
    food?: Food | null; // Platillo seleccionado para editar
    onSave: (data: FoodRequestDto) => Promise<void>; // Función para guardar
}

const EditFoodModal: React.FC<EditFoodModalProps> = ({ open, onClose, food, onSave }) => {
    const { restaurantId } = useParams<{ restaurantId: string }>(); // Obtener restaurantId desde la URL

    const [formData, setFormData] = useState<FoodRequestDto>({
        name: '',
        description: '',
        price: 0,
        restaurantId: Number(restaurantId), // Usar restaurantId desde la URL
        status: 'AVAILABLE',
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (food) {
            setFormData({
                name: food.name,
                description: food.description,
                price: food.price,
                restaurantId: food.restaurantId, // Si estamos editando, usar el restaurantId del platillo
                status: food.status,
            });
        } else {
            setFormData({
                name: '',
                description: '',
                price: 0,
                restaurantId: Number(restaurantId), // Asignar restaurantId desde la URL
                status: 'AVAILABLE',
            });
        }
    }, [food, restaurantId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = async () => {
        if (!formData.name.trim() || formData.price <= 0) {
            alert('Por favor, completa todos los campos obligatorios y asegúrate de que el precio sea válido.');
            return;
        }

        setLoading(true);
        try {
            await onSave(formData); // Llamar a la función onSave con los datos del formulario
            onClose();
        } catch (error) {
            console.error('Error al guardar el platillo:', error);
            alert('Ocurrió un error al guardar el platillo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">
                        {food ? 'Editar Platillo' : 'Nuevo Platillo'}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Nombre del platillo"
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Descripción del platillo"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Precio</label>
                        <Input
                            name="price"
                            type="number"
                            step="0.01"
                            value={formData.price.toString()}
                            onChange={handleInputChange}
                            placeholder="Precio del platillo"
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Estado</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                        >
                            <option value="AVAILABLE">Disponible</option>
                            <option value="UNAVAILABLE">No disponible</option>
                        </select>
                    </div>
                </div>
                <DialogFooter className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Guardando...' : food ? 'Guardar Cambios' : 'Crear Platillo'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditFoodModal;
