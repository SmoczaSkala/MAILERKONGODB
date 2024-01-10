import React, { useState, useEffect } from "react";
import axios from "axios";

const Messages = ({ userId }) => {
  const [receivedMessages, setReceivedMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `/api/messages?token=${sessionStorage.getItem("token")}`
        );
        setReceivedMessages(response.data.receivedMessages);
      } catch (error) {
        console.error("Błąd podczas pobierania wiadomości:", error);
      }
    };

    fetchMessages();
  }, [userId]);

  return (
    <div>
      <h2>Odebrane wiadomości</h2>
      <ul>
        {receivedMessages.map((message) => (
          <li key={message._id}>
            <strong>Od:</strong> {message.sender.email}, <strong>Data:</strong>{" "}
            {message.date}
            <br />
            {message.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Messages;
