import React from "react";
import { styled, createGlobalStyle } from "styled-components";
import ChatWindow from "../components/ChatWindow";
import InputBox from "../components/InputBox";
import Channels from "../components/Channels";
import Rooms from "../components/Rooms";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    width: 100%;
    overflow-x: hidden;;
  }
  body {
    display: flex;
  }
`;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #353647;
  height: 100vh;
  width: 100vw;
  gap: 30px;
  overflow: hidden;
`;

const ChatContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden; /* Ensure it doesn't overflow */
`;

const Home: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <HomeContainer>
        <Channels />
        <Rooms />
        <ChatContainer>
          <ChatWindow />
        </ChatContainer>
      </HomeContainer>
    </>
  );
};

export default Home;
