import React, { useEffect } from "react";
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
  max-width: 600px;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
`;

const Messages = styled.div`
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
`;

const MessageStyled = styled.div<{ isCurrentUser: boolean }>`
  margin-bottom: 10px;
  padding: 10px;
  background-color: ${({ isCurrentUser }) =>
    isCurrentUser ? "#007BFF" : "#e0e0e0"};
  color: ${({ isCurrentUser }) => (isCurrentUser ? "white" : "#333")};
  border-radius: 10px;
  width: fit-content;
`;

const Sender = styled.div<{ isCurrentUser: boolean }>`
  font-weight: bold;
  margin-bottom: 5px;
  color: ${({ isCurrentUser }: { isCurrentUser: boolean }) =>
    isCurrentUser ? "white" : "#333"};
`;
const MessageBox = styled.div`
  font-size: 0.8rem;
  display: flex;
`;

const ChatWindow: React.FC = () => {
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const messages = useSelector((state: RootState) => state.chat.messages);
  console.log(currentUser?.email);
  useEffect(() => {
    const messagesRef = collection(db, "messages");
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
  }, [dispatch]);

  const isCurrentUser = (sender: string) => sender === currentUser?.email;

  return (
    <ChatContainer>
      <Messages>
        {messages.map((message) => (
          <MessageStyled
            key={message.id}
            isCurrentUser={isCurrentUser(message.sender)}
          >
            <Sender isCurrentUser={isCurrentUser(message.sender)}>
              {message.sender}
            </Sender>
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
        ))}
      </Messages>
    </ChatContainer>
  );
};

export default ChatWindow;
