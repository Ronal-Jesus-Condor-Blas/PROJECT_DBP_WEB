import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Restaurant, RestaurantRequestDto } from '@/Api';
import LocationMap from '@/components/LocationMap';
import { FiSave, FiX } from 'react-icons/fi';

interface EditRestaurantModalProps {
    open: boolean;
    onClose: () => void;
    restaurant?: Restaurant | null;
    onSave: (data: RestaurantRequestDto) => Promise<void>;
}

const EditRestaurantModal: React.FC<EditRestaurantModalProps> = ({ open, onClose, restaurant, onSave }) => {
    const [formData, setFormData] = useState<Omit<RestaurantRequestDto, 'location'> & { location: { lat: number; lng: number } }>(
        {
            name: '',
            location: { lat: -12.0464, lng: -77.0428 },
            email: '',
            status: 'OPEN',
        }
    );

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (restaurant) {
            setFormData({
                name: restaurant.name,
                location: typeof restaurant.location === 'string' ? JSON.parse(restaurant.location) : restaurant.location,
                email: restaurant.email,
                status: restaurant.status,
            });
        } else {
            setFormData({
                name: '',
                location: { lat: -12.0464, lng: -77.0428 },
                email: '',
                status: 'OPEN',
            });
        }
    }, [restaurant]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLocationChange = (lat: number, lng: number) => {
        setFormData((prev) => ({
            ...prev,
            location: { lat, lng },
        }));
    };

    const handleSubmit = async () => {
        if (!formData.name.trim() || !formData.email.trim()) {
            alert('Por favor, completa todos los campos obligatorios.');
            return;
        }

        const payload: RestaurantRequestDto = {
            ...formData,
            location: JSON.stringify(formData.location),
        };

        setLoading(true);
        try {
            await onSave(payload);
            onClose();
        } catch (error) {
            console.error('Error al guardar el restaurante:', error);
            alert('Ocurrió un error al guardar el restaurante.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">
                        {restaurant ? 'Editar Restaurante' : 'Nuevo Restaurante'}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Nombre del restaurante"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <Input
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Correo electrónico"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Estado</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="OPEN">Abierto</option>
                            <option value="CLOSED">Cerrado</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                        <LocationMap initialPosition={formData.location} onLocationChange={handleLocationChange} />
                        <div className="mt-2 text-sm text-gray-600">
                            Latitud: {formData.location.lat.toFixed(6)} | Longitud: {formData.location.lng.toFixed(6)}
                        </div>
                    </div>
                </div>
                <DialogFooter className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose} className="flex items-center space-x-1">
                        <FiX />
                        <span>Cancelar</span>
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white"
                    >
                        <FiSave />
                        <span>{loading ? 'Guardando...' : restaurant ? 'Guardar Cambios' : 'Crear Restaurante'}</span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditRestaurantModal;
