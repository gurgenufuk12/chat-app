import React, { useState } from "react";
import styled from "styled-components";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-top: 1px solid #ccc;
`;

const InputRow = styled.div`
  display: flex;
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

const SelectContainer = styled.div`
  margin-top: 10px;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
`;

const AutocompleteList = styled.ul`
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  list-style: none;
  padding: 0;
`;

const AutocompleteItem = styled.li`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState("");
  const [showSelect, setShowSelect] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { currentUser } = useAuth();

  const commonPhrases = [
    "Hello!",
    "How are you?",
    "What's up?",
    "Good morning",
    "Good night",
    "Thank you",
    "See you later",
    "Have a great day!",
    "I love this!",
    "Can we talk?",
    "That's awesome",
    "I don't understand",
    "Please explain",
    "What's going on?",
    "I'm busy right now",
    "Let's meet up",
    "I agree",
    "Sounds good",
    "I'll get back to you",
    "Take care",
  ];

  const handleSend = async () => {
    if (message.trim() === "" || !currentUser) return;

    const messagesRef = collection(db, "messages");

    try {
      await addDoc(messagesRef, {
        content: message,
        sender: currentUser.email,
        createdAt: Timestamp.fromDate(new Date()),
      });
      setMessage("");
      setShowSelect(false);
      setSuggestions([]);
    } catch (error) {
      console.error("Error adding message: ", error);
    }
  };

  const handleSelectChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedOption = event.target.value;

    if (selectedOption && currentUser) {
      const messagesRef = collection(db, "messages");

      try {
        await addDoc(messagesRef, {
          content: selectedOption,
          sender: currentUser.email,
          createdAt: Timestamp.fromDate(new Date()),
        });
        setMessage("");
        setShowSelect(false);
        setSuggestions([]);
      } catch (error) {
        console.error("Error adding message: ", error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    if (value === "/select") {
      setShowSelect(true);
    } else {
      setShowSelect(false);
    }
    if (value) {
      const filteredSuggestions = commonPhrases.filter((phrase) =>
        phrase.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    setSuggestions([]);
  };

  return (
    <InputContainer>
      <InputRow>
        <Input
          type="text"
          value={message}
          onChange={handleInputChange}
          placeholder="Type a message..."
        />
        <SendButton onClick={handleSend}>Send</SendButton>
      </InputRow>
      {showSelect && (
        <SelectContainer>
          <Select onChange={handleSelectChange}>
            <option value="">Select an option</option>
            <option value="Hello">Hello</option>
            <option value="How are you today ?">How are you today ?</option>
            <option value="Nice to meet you!">Nice to meet you!</option>
            <option value="How is your day going?">
              How is your day going?
            </option>
            <option value="How was your night?">How was your night?</option>
          </Select>
        </SelectContainer>
      )}
      {suggestions.length > 0 && (
        <AutocompleteList>
          {suggestions.map((suggestion, index) => (
            <AutocompleteItem
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </AutocompleteItem>
          ))}
        </AutocompleteList>
      )}
    </InputContainer>
  );
};

export default ChatInput;
