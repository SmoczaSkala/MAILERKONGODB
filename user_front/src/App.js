import "./App.scss";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { useAuth } from "./AuthContext";
import Login from "./components/login/Login";
import Dashboard from "./components/dashboard/Dashboard";
import NewMessage from "./components/NewMessage/NewMessage";

const PrivateRoute = ({ element }) => {
  const { token } = useAuth();
  console.log("Token in PrivateRoute:", token);

  return token ? element : <Navigate to="/" />;
};

const App = () => {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/dashboard"
              element={<PrivateRoute element={<Dashboard />} />}
            />
            <Route
              path="/newmessage"
              element={<PrivateRoute element={<NewMessage />} />}
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
};

export default App;
