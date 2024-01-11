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

          if (response.data.users) {
            setUsersList(response.data.users);
            setAvailableRecipients(
              response.data.users.map((user) => user.email)
            );
          } else {
            setUsersList([]);
            setAvailableRecipients([]);
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
        usersList.filter(
          (user) =>
            user.email &&
            user.email.toLowerCase().includes(selectedRecipient.toLowerCase())
        )
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
        Odbiorca:
        <input
          type="text"
          list="users"
          value={selectedRecipient}
          onChange={(e) => setSelectedRecipient(e.target.value)}
        />
        <datalist id="users">
          {availableRecipients.map((recipient) => (
            <option key={recipient} value={recipient} />
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
