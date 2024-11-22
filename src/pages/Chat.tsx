import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Chat.css";



// Archivo de estilos CSS
//import Inicio2 from './Inicio2';

interface Chat {
  username: string;
  email: string;
  messages: { text: string; sender: "me" | "other" }[];
}

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [newChatUsername, setNewChatUsername] = useState("");
  const [newChatEmail, setNewChatEmail] = useState("");

  const handleAddChat = () => {
    if (newChatUsername && newChatEmail) {
      const newChat: Chat = { username: newChatUsername, email: newChatEmail, messages: [] };
      setChats((prevChats) => [...prevChats, newChat]);
      setNewChatUsername("");
      setNewChatEmail("");
    }
  };

  const handleDeleteChat = (username: string) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.username !== username));
    if (selectedChat?.username === username) {
      setSelectedChat(null);
    }
  };

  const handleSendMessage = () => {
    if (selectedChat && newMessage.trim() !== "") {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.username === selectedChat.username
            ? { ...chat, messages: [...chat.messages, { text: newMessage, sender: "me" }] }
            : chat
        )
      );
      setSelectedChat((prevSelected) =>
        prevSelected
          ? { ...prevSelected, messages: [...prevSelected.messages, { text: newMessage, sender: "me" }] }
          : null
      );
      setNewMessage(""); // Limpiar el campo de entrada
    }
  };

  return (
   
    <div className="chat-container">
        
        
      {/* Bandeja de Chats */}
      <div className="chat-sidebar">
      
        <h3>Chats</h3>
        {chats.map((chat) => (
          <div
            key={chat.username}
            className={`chat-list-item ${
              selectedChat?.username === chat.username ? "active-chat" : ""
            }`}
            onClick={() => setSelectedChat(chat)}
          >
            <div className="chat-avatar" onClick={(e) => {
              e.stopPropagation();
              navigate(`/perfil/${chat.username}`);
            }}>
              <img
                src={`https://ui-avatars.com/api/?name=${chat.username}&background=random`}
                alt="avatar"
              />
            </div>
            <span className="chat-username">{chat.username}</span>
            <button
              className="delete-chat-button"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteChat(chat.username);
              }}
            >
              ×
            </button>
          </div>
        ))}

        {/* Añadir nuevo chat */}
        <div className="new-chat-form">
          <h4>Añadir Nuevo Chat</h4>
          <input
            type="text"
            placeholder="Username"
            value={newChatUsername}
            onChange={(e) => setNewChatUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={newChatEmail}
            onChange={(e) => setNewChatEmail(e.target.value)}
          />
          <button onClick={handleAddChat}>Añadir</button>
        </div>
      </div>

      {/* Ventana de Chat */}

     

      <div className="chat-window">
        

        {selectedChat ? (
          <>
            <div className="chat-header">
              <h3>{selectedChat.username}</h3>
            </div>
            <div className="chat-messages">
              <img src="../src/assets/Img4.avif" alt="Chat seleccionado" className="chat-image" />
              {selectedChat.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-message ${
                    msg.sender === "me" ? "sent-message" : "received-message"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="chat-input-container">
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button onClick={handleSendMessage}>Enviar</button>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <img src="../src/assets/Img4.jpg" alt="Bienvenida" className="welcome-image" />
            <p>Selecciona un chat para comenzar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;