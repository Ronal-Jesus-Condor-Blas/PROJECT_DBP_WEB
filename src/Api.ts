// api.ts

import axios from 'axios';

// Define the base URL for the backend
const BASE_URL = 'http://localhost:8080';

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
}

// Function to get all posts
export const getAllPosts = async (): Promise<PostResponseDto[]> => {
    const response = await axios.get<PostResponseDto[]>(`${BASE_URL}/posts`);
    return response.data;
};

// Function to create a new post
export const createPost = async (postRequestDto: PostRequestDto, image: File, token: string): Promise<PostResponseDto> => {
    const formData = new FormData();
    formData.append('post', JSON.stringify(postRequestDto));
    formData.append('image', image);
  
    const response = await axios.post<PostResponseDto>(`${BASE_URL}/posts`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

// Function to delete a post by ID
export const deletePost = async (postId: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/posts/${postId}`);
};