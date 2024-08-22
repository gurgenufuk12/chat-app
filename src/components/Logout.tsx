import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

const Logout: React.FC = () => {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
