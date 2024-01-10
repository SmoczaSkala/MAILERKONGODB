import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Message.scss";

const Messages = ({ userId }) => {
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);

  // Przenieś definicję fetchMessages poza useEffect
  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `/api/messages?token=${sessionStorage.getItem("token")}`
      );
      setReceivedMessages(response.data.receivedMessages);
      setSentMessages(response.data.sentMessages);
    } catch (error) {
      console.error("Błąd podczas pobierania wiadomości:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [userId]);

  const handleDeleteMessage = async (messageId) => {
    try {
      const response = await axios.delete(
        `/api/messages/${messageId}?token=${sessionStorage.getItem("token")}`
      );
      if (response.data.success) {
        fetchMessages();
      } else {
        console.error(
          "Błąd podczas usuwania wiadomości:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Błąd podczas usuwania wiadomości:", error);
    }
  };

  return (
    <div>
      <h2>Odebrane wiadomości</h2>
      <ul>
        {receivedMessages.map((message) => (
          <li key={message._id}>
            <strong>Od:</strong> {message.sender}, <strong>Data:</strong>{" "}
            {message.sentAt}
            <br />
            {message.content}
          </li>
        ))}
      </ul>

      <h2>Wysłane wiadomości</h2>
      <ul>
        {sentMessages.map((message) => (
          <li key={message._id}>
            <strong>Do:</strong> {message.receiver}, <strong>Data:</strong>{" "}
            {message.sentAt}
            <br />
            {message.content}
            <button onClick={() => handleDeleteMessage(message._id)}>
              Usuń
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Messages;
