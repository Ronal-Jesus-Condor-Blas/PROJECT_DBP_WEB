import React, { useState, useEffect } from 'react';
import { getFoods, getRestaurants, Food, Restaurant } from '../Api';

const Inicio: React.FC = () => {
    const [token] = useState(localStorage.getItem('token') || ''); // Obtenemos el token del almacenamiento local
    const [view, setView] = useState<'COMIDAS' | 'RESTAURANTES'>('COMIDAS');
    const [foods, setFoods] = useState<Food[]>([]);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [filters, setFilters] = useState({ search: '', rating: '', type: '', influencer: '', country: '' });

    // Efecto para cargar los datos dependiendo de la vista actual
    useEffect(() => {
        if (view === 'COMIDAS') {
            getFoods(token)
                .then(setFoods)
                .catch((err) => console.error('Error al cargar comidas:', err));
        } else {
            getRestaurants(token)
                .then(setRestaurants)
                .catch((err) => console.error('Error al cargar restaurantes:', err));
        }
    }, [view, token]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const filteredFoods = foods.filter(
        (food) =>
            (!filters.search || food.name.toLowerCase().includes(filters.search.toLowerCase())) &&
            (!filters.rating || food.rating >= Number(filters.rating)) &&
            (!filters.type || food.type === filters.type) &&
            (!filters.influencer || food.influencer?.toLowerCase().includes(filters.influencer.toLowerCase())) &&
            (!filters.country || food.restaurant.includes(filters.country))
    );

    const filteredRestaurants = restaurants.filter(
        (restaurant) =>
            (!filters.search || restaurant.name.toLowerCase().includes(filters.search.toLowerCase())) &&
            (!filters.rating || restaurant.rating >= Number(filters.rating)) &&
            (!filters.country || restaurant.name.includes(filters.country))
    );

    return (
        <div style={{ padding: '20px' }}>
            {/* Selector de vista */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <button onClick={() => setView('COMIDAS')} style={{ padding: '10px 20px' }}>
                    COMIDAS
                </button>
                <button onClick={() => setView('RESTAURANTES')} style={{ padding: '10px 20px' }}>
                    RESTAURANTES
                </button>
            </div>

            {/* Filtros */}
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    style={{ marginRight: '10px', padding: '5px' }}
                />
                <input
                    type="number"
                    placeholder="Rating mínimo"
                    name="rating"
                    value={filters.rating}
                    onChange={handleFilterChange}
                    style={{ marginRight: '10px', padding: '5px' }}
                />
                {view === 'COMIDAS' && (
                    <>
                        <input
                            type="text"
                            placeholder="Tipo de comida"
                            name="type"
                            value={filters.type}
                            onChange={handleFilterChange}
                            style={{ marginRight: '10px', padding: '5px' }}
                        />
                        <input
                            type="text"
                            placeholder="Influencer"
                            name="influencer"
                            value={filters.influencer}
                            onChange={handleFilterChange}
                            style={{ marginRight: '10px', padding: '5px' }}
                        />
                    </>
                )}
                <input
                    type="text"
                    placeholder="País"
                    name="country"
                    value={filters.country}
                    onChange={handleFilterChange}
                    style={{ marginRight: '10px', padding: '5px' }}
                />
            </div>

            {/* Vista de tarjetas */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {view === 'COMIDAS' &&
                    filteredFoods.map((food) => (
                        <div
                            key={food.id}
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: '10px',
                                padding: '10px',
                                width: '250px',
                            }}
                        >
                            <h3>{food.name}</h3>
                            <p>Tipo: {food.type}</p>
                            <p>Rating: {food.rating}</p>
                            <p>Restaurante: {food.restaurant}</p>
                            <p>Influencer: {food.influencer || 'N/A'}</p>
                            <p>Comentarios: {food.comments.join(', ')}</p>
                        </div>
                    ))}
                {view === 'RESTAURANTES' &&
                    filteredRestaurants.map((restaurant) => (
                        <div
                            key={restaurant.id}
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: '10px',
                                padding: '10px',
                                width: '250px',
                            }}
                        >
                            <h3>{restaurant.name}</h3>
                            <p>Rating: {restaurant.rating}</p>
                            <p>Comidas: {restaurant.foods.join(', ')}</p>
                            <p>Comentarios: {restaurant.comments.join(', ')}</p>
                        </div>
                    ))}
            </div>

            {/* Reemplazo de Google Maps */}
            {view === 'RESTAURANTES' && (
                <div
                    style={{
                        height: '500px',
                        width: '100%',
                        marginTop: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundImage: 'url(../src/assets/Img2.jpg)',
                        backgroundSize: 'cover',
                        color: '#fff',
                        fontSize: '24px',
                        fontWeight: 'bold',
                    }}
                >
                    Aquí va Google Maps
                </div>
            )}
        </div>
    );
};

export default Inicio;