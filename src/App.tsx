import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import HomeLogged from './pages/HomeLogged';
import Login from './pages/Login';
import Register from './pages/Register';
import Inicio from './pages/Inicio';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import CreatePostForm from './components/CreatePostForm';
import NotFound from './pages/NotFound';
import { AuthProvider, useAuth } from './AuthContext';
import Posts from './pages/Posts';
import RestaurantsPage from './pages/RestaurantsPage';
import FoodsPage from './pages/FoodsPage';
import FoodRatingsPage from './pages/FoodsRatingPage';

const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { token } = useAuth();
  return token ? <>{element}</> : <Navigate to="/login" />;
};


const MainRoute: React.FC = () => {
  const { token } = useAuth();
  return token ? <HomeLogged /> : <Home />;
};

const App: React.FC = () => {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta principal */}
          <Route path="/" element={<MainRoute />} />

          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas privadas */}
          <Route path="/inicio" element={<ProtectedRoute element={<Inicio />} />} />
          <Route path="/chat" element={<ProtectedRoute element={<Chat />} />} />
          <Route path="/posts" element={<ProtectedRoute element={<Posts />} />} />
          <Route path="/create-post" element={<ProtectedRoute element={<CreatePostForm />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
          <Route path="/restaurants" element={<ProtectedRoute element={<RestaurantsPage />} />} />
          {/* Ruta para los platillos de un restaurante */}
          <Route path="/restaurants/:restaurantId/foods" element={<FoodsPage />} />
          <Route path="/foods/:foodId/ratings" element={<FoodRatingsPage />} />


          {/* Ruta no encontrada */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
