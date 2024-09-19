import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setRoom, addRoom } from "../redux/chatSlice";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase/firebaseConfig";
import { onSnapshot, doc } from "firebase/firestore";
import Close from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import TagIcon from "@mui/icons-material/Tag";
import Settings from "./Settings";

const RoomsContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  gap: 10px;
  max-width: 200px;
  background-color: #414256;
  height: 100vh;
  top: 0;
  left: 0;
  padding-left: 20px;
  padding-right: 20px;
  transition: all 0.3s ease;
  padding-top: 20px;
  overflow: y-scroll;
  @media (min-width: 768px) {
    width: 300px;
    position: relative;
    height: 100vh;
    border-radius: 20px;
    margin-left: 20px;
  }
`;
const RoomItem = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  font-family: "Poppins", sans-serif;
  height: 40px;
  border-radius: 10px;
  border: 2px solid #303141;
  cursor: pointer;
  color: white;
  background-color: ${(props) => (props.selected ? "#303141" : "transparent")};
  font-weight: ${(props) => (props.selected ? "bold" : "normal")};
  font-size: ${(props) => (props.selected ? "0.9rem" : "0.8rem")};
  padding-left: 10px;
  gap: 10px;
`;
const AddRoomPopup = styled.div`
  position: fixed;
  width: 50%
  height: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #353647;
  padding: 40px;
  border-radius: 10px;
  z-index: 1000;
  display: flex;
  gap: 10px;
  flex-direction: column;
  justify-content: center;
  > div {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    width: 100%;
    gap: 10px;
  }
`;
const AddButton = styled.button`
  background-color: transparent;
  border: none;
  color: white;
  cursor: pointer;
`;
const RoomButton = styled.button`
  margin-top: 10px;
  padding: 10px;
  background-color: #3dc5b7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  align-self: center;
`;
const Input = styled.input`
  height: 50px;
  padding: 10px;
  width: 100%;
  border: none;
  border-radius: 4px;
  margin-bottom: 10px;
  background-color: #414256;
  color: white;
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
`;
const Question = styled.h2`
  color: white;
  font-family: "Poppins", sans-serif;
  font-weight: 200;
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
const TitleDiv = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  color: white;
  font-family: "Poppins", sans-serif;
  font-weight: 300;
  font-size: 1.5rem;
`;
const Title = styled.h1`
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-size: 1rem;
  color: white;
`;
const Select = styled.select`
  height: 50px;
  padding-left: 10px;
  padding-right: 10px;
  border: none;
  border-radius: 4px;
  background-color: #414256;
  color: white;
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
`;
const UserDiv = styled.div`
  padding: 10px;
  color: white;
  border-radius: 5px;
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;
const ContextMenu = styled.div`
  position: absolute;
  background-color: #353647;
  border: 1px solid #414256;
  border-radius: 5px;
  z-index: 1000;
  width: 150px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;
const ContextMenuItem = styled.div`
  padding: 10px;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #3dc5b7;
  }
`;
const DeleteChannelPopup = styled.div`
  position: fixed;
  width: 300px;
  height: 300px;
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
  div {
    display: flex;
    gap: 10px;
    justify-content: end;
  }
`;
interface Message {
  id: string;
  content: string;
  sender: string;
  createdAt: string;
}

interface Room {
  roomName: string;
  roomType: string;
  messages: Message[];
  roomUsers: string[];
}

type RoomType = "text" | "voice";

const Rooms: React.FC = () => {
  const { currentUser } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomName, setRoomName] = useState("");
  const [roomType, setRoomType] = useState<RoomType>("text");
  const [singleUser, setSingleUser] = useState("");
  const [roomUsers, setRoomUsers] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const currentChannel = useSelector(
    (state: RootState) => state.chat.selectedChannel
  );
  const currentRoom = useSelector(
    (state: RootState) => state.chat.selectedRoom
  );
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    room: Room | null;
  }>({ visible: false, x: 0, y: 0, room: null });
  const [deletePopup, setDeletePopup] = useState<{
    visible: boolean;
    room: Room | null;
  }>({ visible: false, room: null });
  const [settingsPopup, setSettingsPopup] = useState<{
    visible: boolean;
    room: Room | null;
  }>({ visible: false, room: null });

  const dispatch = useDispatch();

  const conditionalRender = () => {
    return (
      <TitleDiv>
        {currentChannel ? (
          <Title>{currentChannel.channelName} / Rooms </Title>
        ) : (
          <Title>Select a channel</Title>
        )}
        <AddButton onClick={openPopup}>
          {currentChannel?.owner === currentUser?.email ? <AddIcon /> : null}
        </AddButton>
      </TitleDiv>
    );
  };

  const handleAddRoomToChannel = async () => {
    if (!currentChannel || !roomName) return;
    roomUsers.push(currentUser?.email!);
    try {
      await axios.post("http://localhost:8080/channel/addRoomToChannel", {
        channelName: currentChannel.channelName,
        roomName: roomName,
        roomType: roomType,
        roomUsers: roomUsers,
      });
      setRoomUsers([]);
      setRooms([...rooms, { roomName, roomType, roomUsers: [], messages: [] }]);
      dispatch(
        addRoom({
          channelId: currentChannel.channelName,
          room: { roomName, roomType, roomUsers: [], messages: [] },
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteRoom = async (room: Room) => {
    if (!currentChannel) return;
    try {
      await axios.delete("http://localhost:8080/channel/deleteRoomFromChanel", {
        data: {
          channelName: currentChannel.channelName,
          roomName: room.roomName,
        },
      });
      setRooms(rooms.filter((r) => r.roomName !== room.roomName));
    } catch (error) {
      console.log(error);
    }
  };

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    dispatch(setRoom(room));
  };

  useEffect(() => {
    if (!currentChannel) return;

    const unsubscribe = onSnapshot(
      doc(db, "channels", currentChannel.channelName),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const channelData = docSnapshot.data();
          const fetchedRooms = channelData.rooms || [];
          setRooms(fetchedRooms);
        }
      },
      (error) => {
        console.error("Error fetching rooms: ", error);
      }
    );

    return () => unsubscribe();
  }, [currentChannel]);

  const openPopup = () => {
    setShowPopup(true);
  };
  const handleContextMenu = (e: React.MouseEvent, room: Room) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.pageX,
      y: e.pageY,
      room: room,
    });
  };
  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, room: null });
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        setContextMenu({ visible: false, x: 0, y: 0, room: null });
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenu.visible]);

  const handleDeleteChannelMenu = () => {
    if (contextMenu.room) {
      setDeletePopup({ visible: true, room: contextMenu.room });
    }
    closeContextMenu();
  };
  const handleSettingsChannelMenu = () => {
    if (contextMenu.room) {
      setSettingsPopup({ visible: true, room: contextMenu.room });
    }
    closeContextMenu();
  };
  return (
    <RoomsContainer>
      {conditionalRender()}
      {showPopup && (
        <AddRoomPopup>
          <Input
            type="text"
            value={roomName}
            placeholder="Enter room name"
            onChange={(e) => setRoomName(e.target.value)}
          />
          <div>
            <Title>Room Type:</Title>
            <Select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value as "text" | "voice")}
            >
              <option value="text">Text</option>
              <option value="voice">Voice</option>
            </Select>
          </div>
          <div>
            <Input
              type="text"
              value={singleUser}
              placeholder="Enter room users"
              onChange={(e) => setSingleUser(e.target.value)}
            />
            <AddButton
              onClick={() => {
                setRoomUsers([...roomUsers, singleUser]);
                setSingleUser("");
              }}
            >
              <AddIcon />
            </AddButton>
          </div>
          {roomUsers.length > 0 && <Question>Users:</Question>}
          {roomUsers.map((user, idx) => (
            <UserDiv key={idx}>
              {user}
              <AddButton
                onClick={() =>
                  setRoomUsers(roomUsers.filter((u) => u !== user))
                }
              >
                <Close />
              </AddButton>
            </UserDiv>
          ))}
          <RoomButton
            onClick={() => {
              handleAddRoomToChannel();
              setShowPopup(false);
              setRoomName("");
            }}
          >
            <Question>Add Room</Question>
          </RoomButton>
          <CloseButton
            onClick={() => {
              setShowPopup(false);
              setRoomUsers([]);
              setRoomName("");
            }}
          >
            <Close />
          </CloseButton>
        </AddRoomPopup>
      )}
      {rooms
        .filter((room) => room.roomUsers.includes(currentUser?.email!))
        .map((room) => (
          <RoomItem
            key={room.roomName}
            selected={room.roomName === currentRoom?.roomName}
            onClick={() => handleRoomClick(room)}
            onContextMenu={(e) => handleContextMenu(e, room)}
          >
            {room.roomType === "voice" ? <KeyboardVoiceIcon /> : <TagIcon />}
            {room.roomName}
          </RoomItem>
        ))}
      {contextMenu.visible && (
        <ContextMenu
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
          }}
          onClick={closeContextMenu}
        >
          {currentChannel?.owner === currentUser?.email && (
            <ContextMenuItem onClick={handleDeleteChannelMenu}>
              Delete
            </ContextMenuItem>
          )}
          <ContextMenuItem onClick={handleSettingsChannelMenu}>
            Settings
          </ContextMenuItem>
        </ContextMenu>
      )}
      {deletePopup.visible && (
        <DeleteChannelPopup>
          <Question>
            Are you sure you want to delete this {deletePopup.room?.roomName} ?
          </Question>
          <div>
            <RoomButton
              onClick={() => {
                handleDeleteRoom(deletePopup.room!);
                setDeletePopup({ visible: false, room: null });
              }}
            >
              Yes
            </RoomButton>
            <RoomButton
              onClick={() => setDeletePopup({ visible: false, room: null })}
            >
              No
            </RoomButton>
          </div>
        </DeleteChannelPopup>
      )}
      {settingsPopup.visible && (
        <Settings
          propType={settingsPopup.room!}
          closeSettings={() => setSettingsPopup({ visible: false, room: null })}
        />
      )}
    </RoomsContainer>
  );
};

export default Rooms;
