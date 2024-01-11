import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./NewMessage.scss";

const NewMessage = ({ userId }) => {
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [content, setContent] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [availableRecipients, setAvailableRecipients] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const sessionToken = sessionStorage.getItem("token");
    setToken(sessionToken);
  }, []);

  useEffect(() => {
    if (token) {
      const fetchUsersList = async () => {
        try {
          const response = await axios.get("/api/users", { params: { token } });

          if (response.data.success) {
            // Pobierz tablicę obiektów użytkowników z odpowiedzi
            const usersData = response.data.users;

            // Mapuj tablicę użytkowników na format { id, email }
            const formattedUsers = usersData.map((user) => ({
              id: user._id,
              email: user.email,
            }));

            // Ustaw listę użytkowników i dostępne odbiorcy
            setUsersList(formattedUsers);
            setAvailableRecipients(formattedUsers.map((user) => user.email));
          } else {
            setUsersList([]);
            setAvailableRecipients([]);
            setError(
              response.data.message ||
                "Błąd podczas pobierania listy użytkowników"
            );
          }

          console.log(response);
        } catch (err) {
          setError("Błąd podczas pobierania listy użytkowników");
          console.error(err.response ? err.response.data : err.message);
        }
      };

      fetchUsersList();
    }
  }, [token, setError]);

  useEffect(() => {
    if (usersList) {
      setFilteredUsers(
        usersList.filter((user) => {
          console.log(user); // Log the user object
          return (
            user.email &&
            user.email.toLowerCase().includes(selectedRecipient.toLowerCase())
          );
        })
      );
    }
  }, [selectedRecipient, usersList]);

  const handleSendMessage = async () => {
    try {
      const recipient = filteredUsers.find(
        (user) => user.email === selectedRecipient
      );

      if (!recipient) {
        setError("Nieprawidłowy odbiorca");
        return;
      }
      const response = await axios.post("/api/messages", {
        token,
        sender: userId,
        receiver: recipient.email,
        content,
      });

      console.log(response.data);

      setSuccessMessage("Wiadomość została wysłana pomyślnie.");
    } catch (err) {
      setError("Błąd podczas wysyłania wiadomości");
      console.error(err.response ? err.response.data : err.message);
    }
  };

  return (
    <div className="new-message-container">
      <label className="message-label">
        <input
          type="text"
          list="users"
          value={selectedRecipient}
          onChange={(e) => setSelectedRecipient(e.target.value)}
        />
        <datalist id="users">
          {availableRecipients.map((recipient, index) => (
            <option key={index} value={recipient} />
          ))}
        </datalist>
      </label>
      <label className="message-label">
        Treść:
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </label>
      <br />
      <button className="send-btn" onClick={handleSendMessage}>
        Wyślij
      </button>
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        Powrót
      </button>
    </div>
  );
};

export default NewMessage;
