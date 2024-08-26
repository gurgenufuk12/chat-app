import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { setMessages } from "../redux/chatSlice";
import { RootState } from "../redux/store";
import { useAuth } from "../contexts/AuthContext";

interface Message {
  id: string;
  content: string;
  sender: string;
  createdAt: Date;
}

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 80vh;
  width: 100%;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  background-color: #5c4f81;
`;

const Messages = styled.div<{ isMessagesEmpty: boolean }>`
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: ${({ isMessagesEmpty }) =>
    isMessagesEmpty ? "center" : "flex-start"};
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
  const messages = useSelector((state: RootState) => state.chat.messages);
  const currentChannel = useSelector((state: RootState) => state.chat.channel);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!currentChannel) return;

    const messagesRef = collection(db, "channels", currentChannel, "messages");
    const q = query(messagesRef, orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData: Message[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          content: data.content,
          sender: data.sender,
          createdAt: data.createdAt.toDate(),
        };
      });
      dispatch(setMessages(messagesData));
    });

    return () => unsubscribe();
  }, [dispatch, currentChannel]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const isCurrentUser = (sender: string) => sender === currentUser?.email;
  const isMessagesEmpty = messages.length === 0;

  return (
    <ChatContainer>
      <Messages isMessagesEmpty={isMessagesEmpty}>
        {messages.length === 0 ? (
          <NoMessages>No messages sent yet</NoMessages>
        ) : (
          messages.map((message) => (
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
                  {message.createdAt.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}
                </span>
              </MessageBox>
            </MessageStyled>
          ))
        )}
        <div ref={messagesEndRef} />
      </Messages>
    </ChatContainer>
  );
};

export default ChatWindow;
