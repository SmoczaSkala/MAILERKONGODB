import { useState, useEffect } from "react";
import "./Dashboard.scss";
import { jwtDecode } from "jwt-decode";
import Messages from "./../message/Message";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const navigate = useNavigate();
  const { userId } = useParams();

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `/api/messages?token=${sessionStorage.getItem("token")}`
      );
      setReceivedMessages(response.data.receivedMessages);
      setSentMessages(response.data.sentMessages);
    } catch (error) {
      console.error("Błąd podczas pobierania wiadomości:", error.response.data);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);

      setUserInfo(decodedToken);
      fetchMessages();
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  const handleRefreshMessages = () => {
    fetchMessages();
  };

  return (
    <div className="dashboard-container">
      <div className="user-info">
        {userInfo && (
          <p>
            Zalogowany użytkownik: {userInfo.name} (
            {userInfo.admin ? "Admin" : "Standardowy użytkownik"})
          </p>
        )}
        <button onClick={handleLogout}>Wyloguj</button>{" "}
      </div>
      <div className="received-mess">
        <h1>
          Odebrane <button onClick={handleRefreshMessages}>Odśwież</button>
        </h1>
        <Messages userId={userId} messages={receivedMessages} />
      </div>
      <div className="send-mess">
        <Link to="/NewMessage">Nowa Wiadomość</Link>
      </div>
    </div>
  );
};

export default Dashboard;
