import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { BASE_URL } from '@/Api';
import { FaArrowLeft, FaEdit, FaSignOutAlt } from 'react-icons/fa';

const Profile: React.FC = () => {
  const { user, setToken, setUser } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
  });

  if (!user) {
    return (
      <div className="text-center text-red-500">
        <p>No estás autenticado. Por favor, inicia sesión.</p>
      </div>
    );
  }

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    window.location.href = '/login';
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/${user.userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          name: editData.name,
          bio: editData.bio,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el perfil');
      }

      const updatedUser = await response.json();
      setUser(updatedUser); // Actualiza el usuario en el contexto
      setIsEditModalOpen(false); // Cierra el modal
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-6 relative"
      style={{
        backgroundImage: `url('bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Capa de desenfoque y oscurecimiento */}
      <div
        className={`absolute inset-0 bg-black/60 ${isEditModalOpen ? 'backdrop-blur-none' : 'backdrop-blur-md'
          }`}
      ></div>

      {/* Botón para regresar */}
      <div className="absolute top-4 left-4 z-20">
        <Button
          variant="ghost"
          className="flex items-center text-white hover:bg-transparent hover:text-white focus-visible:outline-none"
          onClick={() => (window.location.href = '/')}
        >
          <FaArrowLeft className="mr-2" /> Regresar
        </Button>
      </div>

      {/* Card del perfil */}
      <Card className="w-full max-w-2xl bg-white/90 shadow-2xl rounded-lg z-20">
        <CardHeader className="flex items-center space-x-4">
          <div className="flex flex-col">
            <CardTitle className="text-3xl font-bold flex items-center justify-center">
              {user.name}
              <FaEdit
                className="ml-2 text-gray-500 cursor-pointer hover:text-gray-700 transition"
                onClick={() => setIsEditModalOpen(true)}
              />
            </CardTitle>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Información Personal</h3>
            <Separator className="my-2" />
            <p><strong>Nombre:</strong> {user.name}</p>
            <p><strong>Biografía:</strong> {user.bio || 'No especificada'}</p>
            <p><strong>Rol:</strong> {user.userType}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
            <FaEdit className="mr-2" /> Editar Perfil
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            <FaSignOutAlt className="mr-2" /> Cerrar Sesión
          </Button>
        </CardFooter>
      </Card>

      {/* Modal para editar el perfil */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-white p-6 rounded-lg shadow-xl z-50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Editar Perfil</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <Input
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="border border-gray-300 rounded-lg w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Biografía</label>
              <Input
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                className="border border-gray-300 rounded-lg w-full"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditSubmit}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
