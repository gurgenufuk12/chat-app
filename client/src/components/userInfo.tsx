import React from "react";
import axios from "axios";
import styled, { keyframes, css } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface User {
  email: string | null | undefined;
  name: string;
  surname: string;
  username: string;
  userInfoCompleted?: boolean;
}

const Questions = [
  {
    id: 0,
    question: "What is your name?",
    placeholder: "Enter your name",
  },
  {
    id: 1,
    question: "What is your surname?",
    placeholder: "Enter your surname",
  },
  {
    id: 2,
    question: "What is your username?",
    placeholder: "Enter your username",
  },
];

const slideLeft = keyframes`
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-100%);
    opacity: 0;
  }
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
  color: #1e1e1e;
`;

const AccordeonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 500px;
  height: 500px;
  background-color: #89cff0;
  border-radius: 30px;
  transition: transform 0.5s ease-in-out;
`;
const Slider = styled.div<{ animate: boolean }>`
  ${({ animate }) =>
    animate &&
    css`
      animation: ${slideLeft} 0.5s ease-in-out;
    `}
`;
const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 10px;
  margin: 10px;
  border: none;
`;

const Button = styled.button`
  border-radius: 10px;
  background-color: transparent;
  border: none;
`;
const ErrorMessage = styled.p`
  color: red;
  font-weight: bold;
`;

const UserInfo: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [name, setName] = React.useState("");
  const [surname, setSurname] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [animate, setAnimate] = React.useState(false);
  const [error, setError] = React.useState(false);

  const saveUserToDB = async (user: User) => {
    console.log(user);
    try {
      await axios.post("http://localhost:8080/api/createUser", user);
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = () => {
    if (
      (currentQuestion === 0 && !name) ||
      (currentQuestion === 1 && !surname) ||
      (currentQuestion === 2 && !userName)
    ) {
      setError(true);
      return;
    }

    setError(false);
    if (currentQuestion === 2) {
      saveUserToDB({
        email: currentUser?.email,
        name: name,
        surname: surname,
        username: userName,
        userInfoCompleted: true,
      });
    } else {
      setAnimate(true);
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1);
        setAnimate(false);
      }, 500);
    }
  };

  return (
    <PageContainer>
      <Title>User Info</Title>
      <AccordeonContainer>
        <Slider key={currentQuestion} animate={animate}>
          <Title>{Questions[currentQuestion].question}</Title>
          <InputContainer>
            <Input
              type="text"
              placeholder={Questions[currentQuestion].placeholder}
              value={
                currentQuestion === 0
                  ? name
                  : currentQuestion === 1
                  ? surname
                  : userName
              }
              onChange={(e) => {
                if (currentQuestion === 0) {
                  setName(e.target.value);
                } else if (currentQuestion === 1) {
                  setSurname(e.target.value);
                } else {
                  setUserName(e.target.value);
                }
              }}
            />
            <Button onClick={handleClick}>
              <ArrowForwardIcon
                sx={{
                  width: 50,
                  height: 30,
                  color: "white",
                }}
              />
            </Button>
          </InputContainer>
          {error && (
            <ErrorMessage>Please fill out the form to continue.</ErrorMessage>
          )}
        </Slider>
      </AccordeonContainer>
    </PageContainer>
  );
};

export default UserInfo;
