import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import styled from "styled-components";
import { Close } from "@mui/icons-material";
import axios from "axios";

interface Message {
  id: string;
  content: string;
  sender: string;
  createdAt: string;
}

interface Room {
  roomName: string;
  roomType: string;
  roomUsers: string[];
  messages: Message[];
}

interface Channel {
  channelName: string;
  owner: string;
  rooms: Room[];
  users: string[];
}

const SettingsChannelPopup = styled.div`
  position: fixed;
  width: 40%;
  height: 80%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #353647;
  padding: 20px;
  border-radius: 10px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.3s ease;
`;

const HeaderDiv = styled.div`
  display: flex;
  justify-content: space-between;
  color: white;
  font-family: "Poppins", sans-serif;
`;

const ContentDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  color: white;
  font-family: "Poppins", sans-serif;
  height: 100%;
`;

const Navbar = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 30%;
  padding: 10px;
  background-color: #414256;
  border-radius: 10px;
  margin-bottom: 20px;
  gap: 10px;
`;

const NavBarItem = styled.div<{ isSelected?: boolean }>`
  display: flex;
  gap: 10px;
  height: 50px;
  cursor: pointer;
  padding: 10px;
  border-radius: 10px;
  color: white;
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  background-color: ${({ isSelected }) =>
    isSelected ? "#353647" : "transparent"};
  &:hover {
    background-color: #353647;
  }
`;

const Info = styled.div`
  display: flex;
  height: 100%;
  width: 70%;
  padding: 10px;
  flex-direction: column;
  background-color: #414256;
  border-radius: 10px;
`;

const Title = styled.div`
  font-size: 1.5rem;
  font-family: "Poppins", sans-serif;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: white;
`;

const ItemDiv = styled.div`
  display: flex;
  flex-direction: column;
  height: 20px;
  padding: 5px;
  width: min-content;
  border: none;
  border-radius: 4px;
  background-color: #414256;
  color: white;
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  cursor: not-allowed;
  margin-bottom: 20px;
`;
const RoomDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;
const Input = styled.input`
  height: 50px;
  padding: 10px;
  width: 100%;
  border: 5px solid #353647;
  border-radius: 4px;
  background-color: #414256;
  color: white;
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
`;
const Button = styled.button`
  height: 50px;
  padding: 10px;
  width: 100%;
  border: 5px solid #353647;
  border-radius: 4px;
  background-color: #353647;
  color: white;
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  cursor: pointer;
`;

const ChannelSettings = (props: {
  propType: Channel | Room;
  closeSettings: () => void;
}) => {
  const [selectedNavItem, setSelectedNavItem] = React.useState<string | null>(
    null
  );
  const [userToAdd, setUserToAdd] = React.useState("");
  const currentChannel = useSelector(
    (state: RootState) => state.chat.selectedChannel
  );
  const currentRoom = useSelector(
    (state: RootState) => state.chat.selectedRoom
  );

  useEffect(() => {
    if ("channelName" in props.propType) {
      setSelectedNavItem("channelName");
    } else {
      setSelectedNavItem("roomName");
    }
  }, [props.propType]);
  const conditionalRender = () => {
    if ("channelName" in props.propType) {
      return (
        <>
          <NavBarItem
            isSelected={selectedNavItem === "channelName"}
            onClick={() => setSelectedNavItem("channelName")}
          >
            Channel Name
          </NavBarItem>
          <NavBarItem
            isSelected={selectedNavItem === "owner"}
            onClick={() => setSelectedNavItem("owner")}
          >
            Owner
          </NavBarItem>
          <NavBarItem
            isSelected={selectedNavItem === "users"}
            onClick={() => setSelectedNavItem("users")}
          >
            Users
          </NavBarItem>
          <NavBarItem
            isSelected={selectedNavItem === "rooms"}
            onClick={() => setSelectedNavItem("rooms")}
          >
            Rooms
          </NavBarItem>
        </>
      );
    } else {
      return (
        <>
          <NavBarItem
            isSelected={selectedNavItem === "roomName"}
            onClick={() => setSelectedNavItem("roomName")}
          >
            Room Name
          </NavBarItem>
          <NavBarItem
            isSelected={selectedNavItem === "roomType"}
            onClick={() => setSelectedNavItem("roomType")}
          >
            Room Type
          </NavBarItem>
          <NavBarItem
            isSelected={selectedNavItem === "roomUsers"}
            onClick={() => setSelectedNavItem("roomUsers")}
          >
            Room Users
          </NavBarItem>
        </>
      );
    }
  };

  const renderInfoContent = () => {
    if ("channelName" in props.propType) {
      switch (selectedNavItem) {
        case "channelName":
          return <div>{props.propType.channelName}</div>;
        case "owner":
          return <div>{props.propType.owner}</div>;
        case "users":
          return (
            <div>
              {props.propType.users.map((user, index) => (
                <ItemDiv key={index}>{user}</ItemDiv>
              ))}
              <Input
                placeholder="Add User"
                value={userToAdd}
                onChange={(e) => setUserToAdd(e.target.value)}
              />
              <Button onClick={() => handleAddUsertoChannel()}>Add User</Button>
            </div>
          );
        case "rooms":
          return (
            <div>
              {props.propType.rooms.map((room, index) => (
                <>
                  <RoomDiv>
                    <span key={index}>{room.roomName}</span>
                    <span key={index}>{room.roomType}</span>
                  </RoomDiv>
                </>
              ))}
            </div>
          );
        default:
          setSelectedNavItem("channelName");
      }
    } else {
      switch (selectedNavItem) {
        case "roomName":
          return <div>{props.propType.roomName}</div>;
        case "roomType":
          return <div>{props.propType.roomType.toUpperCase()}</div>;
        case "roomUsers":
          return (
            <div>
              Users: {""}
              {props.propType.roomUsers.map((user, index) => (
                <span key={index}>{user} /</span>
              ))}
              <Input
                placeholder="Add User"
                value={userToAdd}
                onChange={(e) => setUserToAdd(e.target.value)}
              />
              <Button onClick={() => handleAddUsertoRoom()}>Add User</Button>
            </div>
          );
        default:
          setSelectedNavItem("roomName");
      }
    }
  };

  const handleAddUsertoRoom = async () => {
    if (!("channelName" in props.propType)) {
      try {
        await axios.post("http://localhost:8080/channel/addUserstoRoom", {
          channelName: currentChannel?.channelName,
          roomName: props.propType.roomName,
          userToAdd: userToAdd,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleAddUsertoChannel = async () => {
    if ("channelName" in props.propType) {
      try {
        await axios.post("http://localhost:8080/channel/addUserToChannel", {
          channelName: currentChannel?.channelName,
          roomName: currentRoom?.roomName,
          userToAdd: userToAdd,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <SettingsChannelPopup>
      <HeaderDiv>
        {"channelName" in props.propType ? (
          <Title>Channel Settings</Title>
        ) : (
          <Title>Room Settings</Title>
        )}
        <CloseButton onClick={props.closeSettings}>
          <Close />
        </CloseButton>
      </HeaderDiv>
      <ContentDiv>
        <Navbar>{conditionalRender()}</Navbar>
        <Info>{renderInfoContent()}</Info>
      </ContentDiv>
    </SettingsChannelPopup>
  );
};

export default ChannelSettings;
