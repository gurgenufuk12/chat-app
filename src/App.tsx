import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import { useAuth } from "./contexts/AuthContext";

const App: React.FC = () => {
  const { currentUser } = useAuth();
  return (
    <Router>
      <Routes>
        {/* Only accessible after login */}
        <Route
          path="/home"
          element={currentUser ? <Home /> : <Navigate to="/" replace />}
        />

        {/* Public routes */}
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={!currentUser ? <Login /> : <Navigate to="/home" replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;
