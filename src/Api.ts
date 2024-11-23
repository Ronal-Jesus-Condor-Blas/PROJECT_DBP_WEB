// api.ts

import axios from 'axios';

// Define the base URL for the backend
export const BASE_URL = 'http://localhost:8080';

// Define interfaces based on the backend entities
export interface User {
    userId: string;
    email: string;
    name: string;
    bio: string;
    userType: string;
    createdAt: string;
    updatedAt: string;
}

export interface JwtAuthResponse {
    token: string;
    user: User;
}

export interface LoginReq {
    email: string;
    password: string;
}

export interface RegisterReq {
    email: string;
    password: string;
    name: string;
    bio: string;
    userType: string;

}

// Create methods to interact with the backend

// Register a new user
export const register = async (registerReq: RegisterReq): Promise<JwtAuthResponse> => {
    const response = await axios.post<JwtAuthResponse>(`${BASE_URL}/auth/register`, registerReq);
    return response.data;
};

// Login a user
export const login = async (loginReq: LoginReq): Promise<JwtAuthResponse> => {
    const response = await axios.post<JwtAuthResponse>(`${BASE_URL}/auth/login`, loginReq);
    return response.data;
};

// Get user details
export const getUserDetails = async (userId: string): Promise<User> => {
    const response = await axios.get<User>(`${BASE_URL}/users/${userId}`);
    return response.data;
};


export interface Food {
    id: number;
    type: string;
    name: string;
    rating: number;
    restaurant: string;
    comments: string[];
    influencer?: string; // Asociado al nombre del influencer
}


export interface Restaurant {
    id: number;
    name: string;
    rating: number;
    foods: string[];
    comments: string[];
    location: { lat: number; lng: number };
    country?: string;
}

// Métodos para obtener datos del backend



// api.ts

// Interfaces adicionales
export interface FoodFilter {
    search?: string;
    rating?: number;
    type?: string;
    country?: string; // No está en el backend, pero se puede usar para manejar el filtro en el front
    influencer?: string; // No está en el backend, pero se puede manejar en el front
}

export interface RestaurantFilter {
    search?: string;
    rating?: number;
    country?: string; // No está en el backend, pero se puede manejar en el front
}

// Modificación de los métodos para incluir parámetros de filtrado
export const getFoods = async (token: string, filters?: FoodFilter): Promise<Food[]> => {
    const response = await axios.get<Food[]>(`${BASE_URL}/api/foods`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filters, // Agrega filtros como parámetros en la solicitud
    });
    return response.data;
};

export const getRestaurants = async (token: string, filters?: RestaurantFilter): Promise<Restaurant[]> => {
    const response = await axios.get<Restaurant[]>(`${BASE_URL}/api/restaurants`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filters, // Agrega filtros como parámetros en la solicitud
    });
    return response.data;
};

// Método para búsqueda en Google Maps
export const searchLocation = async (address: string): Promise<{ lat: number; lng: number }> => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''; // Usa la clave de Google Maps
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
            address,
            key: apiKey,
        },
    });

    if (response.data.status === 'OK') {
        const location = response.data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
    } else {
        throw new Error('No se pudo encontrar la ubicación');
    }
};


export interface Post {
    postId: number;
    title: string;
    content: string;
    image: string;
    createdDate: string;
    status: string;
    userId: number;
    userName: string;
    userProfilePicture: string;
}

export interface PostRequestDto {
    title: string;
    content: string;
    userId: number;
    status: string;
}

export interface PostResponseDto {
    postId: number;
    title: string;
    content: string;
    image: string;
    createdDate: string;
    status: string;
    userId: number;
    userName: string;
    userProfilePicture: "";
}

// Function to get all posts
export const getAllPosts = async (token: string): Promise<PostResponseDto[]> => {
    const response = await axios.get<PostResponseDto[]>(`${BASE_URL}/posts`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const updatePost = async (
    postId: number,
    postRequestDto: PostRequestDto,
    token: string
): Promise<PostResponseDto> => {
    const response = await axios.put<PostResponseDto>(`${BASE_URL}/posts/${postId}`, postRequestDto, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};


export const createPost = async (
    postRequestDto: PostRequestDto,
    image: File | null,
    token: string
): Promise<PostResponseDto> => {
    try {
        const formData = new FormData();

        // Convertir el postRequestDto a un blob JSON
        formData.append(
            "post",
            new Blob([JSON.stringify(postRequestDto)], { type: "application/json" })
        );

        // Adjuntar la imagen si existe
        if (image) {
            formData.append("image", image);
        }

        // Hacer la petición al backend
        const response = await axios.post<PostResponseDto>(`${BASE_URL}/posts`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data; // Devolver los datos del post creado
    } catch (error: any) {
        // Lanzar el error con más información para manejarlo en el frontend
        throw error.response
            ? new Error(error.response.data.message || "Error al crear el post")
            : new Error("Error de red o problema desconocido");
    }
};



// Function to delete a post by ID
export const deletePost = async (postId: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/posts/${postId}`);
};

export const fetchCurrentUserDetails = async (userId: number) => {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    if (!response.ok) {
        throw new Error("Error fetching user details");
    }

    return response.json();
};

export interface CommentRequestDto {
    userId: number;
    postId: number;
    content: string;
}

export interface CommentResponseDto {
    commentId: number;
    userId: number;
    postId: number;
    content: string;
    commentDate: string; // Usa string porque las fechas suelen venir en este formato desde la API
}


export const getCommentsByPostId = async (
    postId: number,
    token: string
): Promise<CommentResponseDto[]> => {
    const response = await axios.get<CommentResponseDto[]>(`${BASE_URL}/comments/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const createComment = async (
    commentRequestDto: CommentRequestDto,
    token: string
): Promise<CommentResponseDto> => {
    const response = await axios.post<CommentResponseDto>(`${BASE_URL}/comments`, commentRequestDto, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};


export const updateComment = async (
    commentId: number,
    commentRequestDto: CommentRequestDto,
    token: string
): Promise<CommentResponseDto> => {
    const response = await axios.put<CommentResponseDto>(
        `${BASE_URL}/comments/${commentId}`,
        commentRequestDto,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export const deleteComment = async (commentId: number, token: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/comments/${commentId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

// Modelo para los datos de los restaurantes
export interface Restaurant {
    restaurantId: number;
    name: string;
    email: string;
    location: {
        lat: number;
        lng: number;
    };
    status: 'OPEN' | 'CLOSED';
    createdDate: string; // Asegúrate de que el tipo coincida con el formato de fecha
}

// Modelo para el request de crear/editar restaurantes
export interface RestaurantRequestDto {
    name: string;
    location: string; // Cambiar a string
    email: string;
    status: 'OPEN' | 'CLOSED';
}


// Función para obtener todos los restaurantes
export const getAllRestaurants = async (token: string) => {
    const response = await axios.get(`${BASE_URL}/restaurants`, {
        headers: {
            Authorization: `Bearer ${token}`, // Agregar token en las cabeceras
        },
    });
    return response.data;
};

// Función para obtener un restaurante por ID
export const getRestaurantById = async (id: number): Promise<Restaurant> => {
    const response = await axios.get(`${BASE_URL}/restaurants/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Agregar token en las cabeceras
        },
    });
    return response.data;
};

// Función para crear un nuevo restaurante
export const createRestaurant = async (data: RestaurantRequestDto): Promise<Restaurant> => {
    const response = await axios.post(`${BASE_URL}/restaurants`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Agregar token en las cabeceras
        },
    });
    return response.data;
};

// Función para editar un restaurante existente
export const updateRestaurant = async (
    id: number,
    data: RestaurantRequestDto
): Promise<Restaurant> => {
    const response = await axios.put(`${BASE_URL}/restaurants/${id}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Agregar token en las cabeceras
        },
    });
    return response.data;
};

// Función para eliminar un restaurante por ID
export const deleteRestaurant = async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/restaurants/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Agregar token en las cabeceras
        },
    });
};

export interface Food {
    foodId: number;
    name: string;
    description: string;
    price: number;
    restaurantId: number;
    status: string; // Ejemplo: 'AVAILABLE' o 'UNAVAILABLE'
}

export interface FoodRequestDto {
    name: string;
    description: string;
    price: number;
    restaurantId: number;
    status: string;
}

// Obtener todos los platillos de un restaurante
export const getFoodsByRestaurantId = async (restaurantId: number): Promise<Food[]> => {
    const response = await axios.get(`${BASE_URL}/foods/restaurants/${restaurantId}/foods`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
};

// Crear un nuevo platillo
export const createFood = async (data: FoodRequestDto): Promise<Food> => {
    const response = await axios.post(`${BASE_URL}/foods`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
};

// Actualizar un platillo existente
export const updateFood = async (foodId: number, data: FoodRequestDto): Promise<Food> => {
    const response = await axios.put(`${BASE_URL}/foods/${foodId}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
};

// Eliminar un platillo
export const deleteFood = async (foodId: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/foods/${foodId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
};

// Modelo para las calificaciones de los platillos
export interface FoodRating {
    foodRatingId: number;
    id: number;
    rating: number;
    comment: string;
    foodId: number;
    createdAt: string;
}

export interface FoodRatingRequestDto {
    rating: number;
    comment: string;
}

// Obtener todas las calificaciones de un platillo por su ID
export const getFoodRatingsByFoodId = async (foodId: number) => {
    const response = await axios.get(`${BASE_URL}/foodratings/food/${foodId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
};

// Obtener una calificación específica por su ID
export const getFoodRatingById = async (id: number) => {
    const response = await axios.get(`${BASE_URL}/foodratings/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
};

// Crear una nueva calificación para un platillo
export const createFoodRating = async (data: { foodId: number; userId: number; rating: number; comment: string }) => {
    const response = await axios.post(`${BASE_URL}/foodratings`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
};

// Actualizar parcialmente una calificación
export const patchFoodRating = async (id: number, data: { rating?: number; comment?: string }) => {
    const response = await axios.patch(`${BASE_URL}/foodratings/${id}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
};

// Actualizar completamente una calificación
export const updateFoodRating = async (id: number, data: { rating: number; comment: string }) => {
    const response = await axios.put(`${BASE_URL}/foodratings/${id}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
};

// Eliminar una calificación por su ID
export const deleteFoodRating = async (id: number) => {
    const response = await axios.delete(`${BASE_URL}/foodratings/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
};

// Obtener todas las calificaciones hechas por un usuario
export const getFoodRatingsByUserId = async (userId: number) => {
    const response = await axios.get(`${BASE_URL}/foodratings/users/${userId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
};

// Obtener todos los comentarios de un platillo específico
export const getCommentsByFoodId = async (foodId: number) => {
    const response = await axios.get(`${BASE_URL}/foodratings/foods/${foodId}/comments`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
};