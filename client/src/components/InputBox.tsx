import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import useImagePlaceholder from "../hooks/useImage";
import SendIcon from "@mui/icons-material/Send";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import Close from "@mui/icons-material/Close";

const InputContainer = styled.div`
  position: relative;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 5px;
  }
`;
const InputRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 10px;

  @media (max-width: 600px) {
    gap: 5px;
  }
`;
const Input = styled.input`
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 50px;
  width: 100%;
  box-sizing: border-box;
  min-width: 0;
  &::placeholder {
    color: black;
  }
  @media (max-width: 600px) {
    padding: 8px;
  }
`;
const SendButton = styled.button`
  padding: 10px;
  border: none;
  background-color: #3dc5b7;
  color: white;
  border-radius: 100%;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;

  @media (max-width: 600px) {
    padding: 8px 12px;
  }
`;
const SelectContainer = styled.div`
  margin-top: 10px;
  width: 100%;
`;
const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 8px;
  }
`;
const AutocompleteList = styled.ul`
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  margin: 0;
  padding: 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  list-style: none;
  z-index: 1000;
  max-height: 150px;
  overflow-y: auto;

  @media (max-width: 600px) {
    max-height: 100px;
  }
`;
const AutocompleteItem = styled.li`
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }

  @media (max-width: 600px) {
    padding: 8px;
  }
`;
const ImagePlaceholder = styled.img`
  margin-top: 10px;
  width: 100px;
  height: 100px;
  border-radius: 4px;
`;
const Error = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 200px;
  padding: 20px;
  color: white;
  background-color: #353647;
  border-radius: 10px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const Button = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: white;
`;
const ChatInput: React.FC = () => {
  const { currentUser } = useAuth();
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [showSelect, setShowSelect] = useState(false);
  const [showError, setShowError] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { imagePlaceholder, generateImagePlaceholder, clearPlaceholder } =
    useImagePlaceholder();
  const currentChannel = useSelector(
    (state: RootState) => state.chat.selectedChannel
  );
  const currentRoom = useSelector(
    (state: RootState) => state.chat.selectedRoom
  );

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
    if (!currentChannel) {
      setShowError(true);
      return;
    }

    if (
      message.trim() === "" ||
      !currentUser ||
      !currentChannel ||
      !currentRoom
    )
      return;
    const content = imagePlaceholder ? imagePlaceholder : message;

    try {
      await axios.post("http://localhost:8080/channel/addMessageToChannel", {
        channelId: currentChannel.channelName,
        roomId: currentRoom.roomName,
        sender: currentUser.email,
        content: content,
        createdAt: new Date().toISOString(),
      });
      setMessage("");
      setShowSelect(false);
      setSuggestions([]);
      clearPlaceholder();
    } catch (error) {
      console.error("Error adding message: ", error);
    }
  };
  // TODO : Add a new message to the firestore database
  const handleSelectChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedOption = event.target.value;

    if (selectedOption && currentUser && currentChannel) {
      const messagesRef = collection(
        db,
        "channels",
        currentChannel.channelName,
        "messages"
      );

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

    if (value.startsWith("/image")) {
      const parts = value.split(" ");
      if (parts.length === 2) {
        const imageNumber = parseInt(parts[1]);
        if (!isNaN(imageNumber)) {
          generateImagePlaceholder(imageNumber);
        }
      }
    } else {
      clearPlaceholder();
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
        <SendButton onClick={handleSend}>
          <SendIcon />
        </SendButton>
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
      {imagePlaceholder && (
        <ImagePlaceholder src={imagePlaceholder} alt="Image preview" />
      )}
      {showError && (
        <Error>
          <div>
            <h2>Error</h2>
            <p>Please select a channel to send a message</p>
          </div>
          <Button onClick={() => setShowError(false)}>
            <Close />
          </Button>
        </Error>
      )}
    </InputContainer>
  );
};

export default ChatInput;
