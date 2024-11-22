import React, { useState } from 'react';
import { createPost, PostRequestDto } from '../Api';
import { useAuth } from '../AuthContext'; // Importa el hook useAuth

// Global CSS reset styles
const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html, body, #root {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
`;

const CreatePostForm: React.FC = () => {
  const { token, user } = useAuth(); // Usa el contexto de autenticación
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      setError('Image is required');
      return;
    }
    if (!user) {
      setError('User is not authenticated');
      return;
    }
    const postRequestDto: PostRequestDto = {
      content,
      title,
      userId: user.id, // Usa el ID del usuario autenticado
      status: 'ACTIVE', // Replace with the actual status
    };
    try {
      await createPost(postRequestDto, image, token || '');
      setContent('');
      setTitle('');
      setImage(null);
      setSuccessMessage('Post created successfully');
      setError('');
    } catch (error) {
      setError('Error creating post');
      setSuccessMessage('');
    }
  };

  return (
    <>
      {/* Inject global styles */}
      <style>{styles}</style>
      <div
        style={{
          position: 'relative',
          backgroundImage: `url('../src/assets/Img2.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
        }}
      >
        {/* Botón FoodTails */}
        <a
          href="/"
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: '#8B4513',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '5px',
            textDecoration: 'none',
            fontWeight: 'bold',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
            cursor: 'pointer',
          }}
        >
          FoodTails
        </a>

        <div
          style={{
            background: 'rgba(0, 0, 0, 0.7)',
            padding: '30px',
            borderRadius: '10px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
          }}
        >
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create Post</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  outline: 'none',
                  color: '#000',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Content:</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  outline: 'none',
                  color: '#000',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Image:</label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                accept="image/*"
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  outline: 'none',
                  color: '#000',
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                background: '#8B4513',
                color: '#fff',
                padding: '10px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Create Post
            </button>
          </form>
          {/* Mostrar mensajes de éxito o error */}
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          {successMessage && <p style={{ color: 'green', marginTop: '10px' }}>{successMessage}</p>}
        </div>
      </div>
    </>
  );
};

export default CreatePostForm;