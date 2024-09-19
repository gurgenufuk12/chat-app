import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import ChatInput from "./InputBox";
import { RootState } from "../redux/store";
import { useAuth } from "../contexts/AuthContext";

interface Room {
  roomName: string;
  messages: Array<{
    id?: string;
    content: string;
    sender: string;
    createdAt: any;
  }>;
}

interface Message {
  id: string;
  content: string;
  sender: string;
  createdAt: string;
}

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  background-color: #414256;
  margin-right: 20px;

  @media (max-width: 768px) {
    width: 90%;

    height: 70vh;
    display: flex;
    flex-direction: column;
    margin-top: 100px;
  }
`;

const ChannelTitle = styled.div`
  width: 100%;
  height: 60px;
  top: 0;
  left: 0;
  background-color: #343543;
  padding: 10px;
  border-radius: 10px 10px 0 0;
  z-index: 100;
  color: white;
  text-align: center;
  display: flex;
  align-items: center;
  font-family: "Poppins", sans-serif;
`;

const Messages = styled.div`
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;

  @media (min-width: 768px) {
    gap: 15px;
  }
`;

const MessageStyled = styled.div<{ isCurrentUser: boolean }>`
  padding: 10px;
  background-color: ${({ isCurrentUser }) =>
    isCurrentUser ? "#4e426d" : "#efaa86"};
  color: ${({ isCurrentUser }) => (isCurrentUser ? "white" : "white")};
  border-radius: 10px;
  width: fit-content;
  align-self: ${({ isCurrentUser }) =>
    isCurrentUser ? "flex-end" : "flex-start"};

  @media (min-width: 768px) {
    padding: 15px;
  }
`;

const Sender = styled.div<{ isCurrentUser: boolean }>`
  font-weight: bold;
  margin-bottom: 5px;
  color: ${({ isCurrentUser }) => (isCurrentUser ? "white" : "white")};
`;

const MessageBox = styled.div`
  font-size: 0.8rem;
  display: flex;
  gap: 10px;
`;

const NoMessages = styled.div`
  padding: 20px;
  font-size: 1.5rem;
  color: white;
  font-weight: bold;
`;

const ChatWindow: React.FC = () => {
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const currentChannel = useSelector(
    (state: RootState) => state.chat.selectedChannel
  );
  const currentRoom = useSelector(
    (state: RootState) => state.chat.selectedRoom
  );

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!currentChannel || !currentRoom) return setMessages([]);

    const channelDocRef = doc(db, "channels", currentChannel.channelName);

    const unsubscribe = onSnapshot(
      channelDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const channelData = docSnapshot.data();

          if (channelData && channelData.rooms) {
            const room = channelData.rooms.find(
              (room: Room) => room.roomName === currentRoom.roomName
            );

            if (room && room.messages) {
              const messagesData: Message[] = room.messages.map(
                (message: Message) => ({
                  id: message.id || "",
                  content: message.content,
                  sender: message.sender,
                  createdAt: message.createdAt
                    ? new Date(message.createdAt).toISOString()
                    : new Date().toISOString(),
                })
              );
              setMessages(messagesData);
            } else {
              setMessages([]);
            }
          } else {
            setMessages([]);
          }
        } else {
          setMessages([]);
        }
      },
      (error) => {
        console.error("Error fetching channel:", error);
      }
    );
    return () => unsubscribe();
  }, [dispatch, currentChannel, currentRoom]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const isCurrentUser = (sender: string) => sender === currentUser?.email;
  const checkIsThereMessages = () => {
    if (!currentChannel || !currentRoom) {
      return (
        <NoMessages>Select a channel and room to start chatting</NoMessages>
      );
    }
  };

  return (
    <ChatContainer>
      <ChannelTitle>
        {currentChannel?.channelName} / {currentRoom?.roomName}
      </ChannelTitle>
      <Messages>
        {checkIsThereMessages()}
        {messages.map((message: Message) => (
          <MessageStyled
            key={message.id}
            isCurrentUser={isCurrentUser(message.sender)}
          >
            {!isCurrentUser(message.sender) && (
              <Sender isCurrentUser={isCurrentUser(message.sender)}>
                {message.sender}
              </Sender>
            )}
            <MessageBox>
              {message.content}
              <span style={{ marginLeft: "auto" }}>
                {new Date(message.createdAt).toLocaleTimeString()}
              </span>
            </MessageBox>
          </MessageStyled>
        ))}
        <div ref={messagesEndRef} />
      </Messages>

      <ChatInput />
    </ChatContainer>
  );
};

export default ChatWindow;
