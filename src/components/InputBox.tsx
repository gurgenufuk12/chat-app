import React, { useState } from "react";
import styled from "styled-components";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

const InputContainer = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #ccc;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SendButton = styled.button`
  padding: 10px 15px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
`;

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState("");
  const { currentUser } = useAuth();

  const handleSend = async () => {
    if (message.trim() === "" || !currentUser) return;

    const messagesRef = collection(db, "messages");

    try {
      await addDoc(messagesRef, {
        content: message,
        sender: currentUser.email,
        createdAt: serverTimestamp(),
      });
      setMessage("");
    } catch (error) {
      console.error("Error adding message: ", error);
    }
  };

  return (
    <InputContainer>
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <SendButton onClick={handleSend}>Send</SendButton>
    </InputContainer>
  );
};

export default ChatInput;
