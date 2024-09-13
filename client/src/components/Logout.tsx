import React from "react";
import styled from "styled-components";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #ff6347;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #e55342;
  }
`;

const Logout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Failed to log out", err);
    }
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

export default Logout;
