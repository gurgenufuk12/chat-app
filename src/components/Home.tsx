import React from "react";
import styled from "styled-components";
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

const Message = styled.p`
  font-size: 1.2rem;
`;

const Home: React.FC = () => {
  return (
    <HomeContainer>
      <Title>Welcome to the Chat Application!</Title>
      <Message>You have successfully logged in.</Message>
      <Logout />
    </HomeContainer>
  );
};

export default Home;
