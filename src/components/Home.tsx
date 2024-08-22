// src/pages/Home.tsx
import React from "react";
import Logout from "../components/Logout";

const Home: React.FC = () => {
  return (
    <div className="home">
      <h1>Welcome to the Chat Application!</h1>
      <p>You have successfully logged in.</p>
      <Logout />
    </div>
  );
};

export default Home;
