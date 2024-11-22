import React from "react";
import "../style/Profile.css"; // Asegúrate de ajustar la ruta de importación según tu estructura de archivos

interface ProfileProps {
  username: string;
  email: string;
  type: "INFLUENCER" | "ADMIN"; // Tipo de usuario
  onClose: () => void;
}

const Profile: React.FC<ProfileProps> = ({ username, email, type, onClose }) => {
  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <h2>Perfil de {username}</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      {/* Descripción */}
      <div className="profile-description">
        <p><strong>Usuario:</strong> {username}</p>
        <p><strong>Email:</strong> {email}</p>
        {type === "ADMIN" && (
          <p><strong>Rating:</strong> ⭐⭐⭐⭐☆</p>
        )}
        <p>Descripción breve sobre el {type === "INFLUENCER" ? "influencer" : "restaurante"}.</p>
      </div>

      <div className="profile-body">
        {/* Dashboard de publicaciones */}
        <div className="dashboard-left">
          <h3>Publicaciones</h3>
          {/* Contenido dinámico de publicaciones */}
        </div>

        {/* Panel derecho */}
        <div className="dashboard-right">
          {type === "INFLUENCER" ? (
            <>
              {/* Botones para INFLUENCER */}
              <div className="buttons-container">
                <button>Logout</button>
                <button>Eliminar cuenta</button>
                <button>Editar información</button>
              </div>
              {/* Chat debajo de los botones */}
              <div className="chat-section">
                <h3>Chat</h3>
                {/* Componente de chat */}
              </div>
            </>
          ) : (
            <>
              {/* Dashboard de comidas para ADMIN */}
              <div className="admin-dashboard">
                <h3>Menú de comidas</h3>
                <p>Filtra, crea, edita o elimina comidas.</p>
              </div>
              <div className="buttons-container">
                <button>Logout</button>
                <button>Eliminar cuenta</button>
                <button>Editar información</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;