import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setRoom, addRoom } from "../redux/chatSlice";
import { db } from "../firebase/firebaseConfig";
import { onSnapshot, doc } from "firebase/firestore";
import Close from "@mui/icons-material/Close";

const RoomsContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  max-width: 90px;
  background-color: #414256;
  height: 100vh;
  top: 0;
  left: 0;
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
  justify-content: center;
  font-family: "Poppins", sans-serif;
  width: 60px;
  height: 60px;
  border-radius: 10px;
  border: 2px solid #303141;
  font-size: 0.8rem;
  cursor: pointer;
  color: white;
  background-color: ${(props) => (props.selected ? "#303141" : "transparent")};
`;
const AddRoomPopup = styled.div`
  position: fixed;
  width: 400px;
  height: 400px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #353647;
  padding: 20px;
  border-radius: 10px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const ChannelButton = styled.button`
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
interface Message {
  id: string;
  content: string;
  sender: string;
  createdAt: string;
}

interface Room {
  roomName: string;
  messages: Message[];
}

const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomName, setRoomName] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const currentChannel = useSelector(
    (state: RootState) => state.chat.selectedChannel
  );

  const dispatch = useDispatch();

  const handleAddRoomToChannel = async () => {
    if (!currentChannel || !roomName) return;
    try {
      await axios.post("http://localhost:8080/channel/addRoomToChannel", {
        channelName: currentChannel.channelName,
        roomName: roomName,
      });
      setRooms([...rooms, { roomName, messages: [] }]);
      dispatch(
        addRoom({
          channelId: currentChannel.channelName,
          room: { roomName, messages: [] },
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    dispatch(setRoom(room));
  };
  console.log(currentChannel);

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
  return (
    <RoomsContainer>
      <ChannelButton onClick={openPopup}>Add Room</ChannelButton>
      {showPopup && (
        <AddRoomPopup>
          <Input
            type="text"
            value={roomName}
            placeholder="Enter channel name"
            onChange={(e) => setRoomName(e.target.value)}
          />
          <ChannelButton
            onClick={() => {
              handleAddRoomToChannel();
              setShowPopup(false);
              setRoomName("");
            }}
          >
            <Question>Add Room</Question>
          </ChannelButton>
          <CloseButton
            onClick={() => {
              setShowPopup(false);
              setRoomName("");
            }}
          >
            <Close />
          </CloseButton>
        </AddRoomPopup>
      )}
      {rooms.map((room) => (
        <RoomItem
          key={room.roomName}
          selected={room === selectedRoom}
          onClick={() => handleRoomClick(room)}
        >
          {room.roomName}
        </RoomItem>
      ))}
    </RoomsContainer>
  );
};

export default Rooms;
