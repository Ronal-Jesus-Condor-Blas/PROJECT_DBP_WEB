import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import HomeLogged from './pages/HomeLogged';
import Login from './pages/Login';
import Register from './pages/Register';
import Inicio from './pages/Inicio';
import Chat from './pages/Chat';
import CreatePostForm from './components/CreatePostForm';
import PostList from './components/PostList';
import NotFound  from './pages/NotFound';
import { AuthProvider } from './AuthContext'; // Importa el AuthProvider

const App: React.FC = () => {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={
          localStorage.getItem("token") ? <HomeLogged /> : <Home />
          } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/create-post" element={<CreatePostForm />} />
        <Route path="*" element={< NotFound/>} /> 
      </Routes>
    </Router>
    </AuthProvider>
  );
};

export default App;