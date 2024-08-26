import React from "react";
import styled from "styled-components";
import ChatWindow from "../components/ChatWindow";
import InputBox from "../components/InputBox";
import Channels from "../components/Channels";
import Logout from "../components/Logout";
import { useAuth } from "../contexts/AuthContext";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 10px;
  text-align: center;
`;

const ChatContainer = styled.div`
  width: 100%;
`;
const Home: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <HomeContainer>
      {/* <Title>Welcome {currentUser?.email} to the chat!</Title> */}
      <Channels />
      <ChatContainer>
        <ChatWindow />
        <InputBox />
      </ChatContainer>
      {/* <Logout /> */}
    </HomeContainer>
  );
};

export default Home;
