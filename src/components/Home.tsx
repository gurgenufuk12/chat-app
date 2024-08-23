import React from "react";
import styled from "styled-components";
import ChatWindow from "../components/ChatWindow";
import InputBox from "../components/InputBox";
import Logout from "../components/Logout";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 10px;
`;

const ChatContainer = styled.div`
  width: 100%;
  max-width: 800px;
`;

const Home: React.FC = () => {
  return (
    <HomeContainer>
      <Title>Welcome to the Chat Application!</Title>
      <ChatContainer>
        <ChatWindow />
        <InputBox />
      </ChatContainer>
      <Logout />
    </HomeContainer>
  );
};

export default Home;
