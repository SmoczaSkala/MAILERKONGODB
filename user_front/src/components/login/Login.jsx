import "./Login.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const loginFn = async (e) => {
    e.preventDefault();

    const form = e.target;
    const email = form[0].value;
    const password = form[1].value;

    if (email && password) {
      const credentials = { email, password };

      try {
        const response = await axios.post("/api/user/login", credentials);
        const data = response.data;

        if (data.success && data.token) {
          sessionStorage.setItem("token", data.token);
          console.log(data);
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Login error:", error);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="form">
        <h2>Login</h2>
        <form onSubmit={(e) => loginFn(e)}>
          <input type="text" placeholder="Login" />
          <input type="password" placeholder="Hasło" />
          <button type="submit">Zaloguj</button>
          <h4>
            Po poprawnynm podaniu loginu wpisz w URL /dashboard, jest to
            innowacyjna ochrona witryny
          </h4>
        </form>
      </div>
    </div>
  );
};

export default Login;
