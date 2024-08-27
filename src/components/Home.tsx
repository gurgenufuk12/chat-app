import React from "react";
import { styled, createGlobalStyle } from "styled-components";
import ChatWindow from "../components/ChatWindow";
import InputBox from "../components/InputBox";
import Channels from "../components/Channels";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
  }
  body {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #353647;
  min-height: 100vh;
  width: 100vw;
  gap: 30px;
`;

const ChatContainer = styled.div`
  flex-grow: 1;
  height: 100%;
  overflow: hidden; /* Ensure it doesn't overflow */
`;

const Home: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <HomeContainer>
        <Channels />
        <ChatContainer>
          <ChatWindow />
          <InputBox />
        </ChatContainer>
      </HomeContainer>
    </>
  );
};

export default Home;
