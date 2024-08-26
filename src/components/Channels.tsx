import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useDispatch } from "react-redux";
import { setChannel } from "../redux/chatSlice";
import Close from "@mui/icons-material/Close";
import Delete from "@mui/icons-material/Delete";

const ChannelsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 10px;
  background-color: #414256;
  margin-left: 20px;
  height: 80vh;
  border-radius: 20px;
`;

const ChannelItem = styled.div<{ selected: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  cursor: pointer;
  color: white;
  background-color: ${(props) => (props.selected ? "#303141" : "transparent")};
  border-radius: ${(props) => (props.selected ? "10px" : "0")};
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
const DeletChanneleButton = styled.button`
  background-color: transparent;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
const AddChannelPopup = styled.div`
  position: absolute;
  width: 300px;
  height: 300px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #353647;
  padding: 20px;
  border-radius: 10px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const Input = styled.input`
  padding: 10px;
  width: 100%;
  border: none;
  border-radius: 4px;
  margin-bottom: 10px;
  background-color: #414256;
  color: white;
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
const DeleteChannelPopup = styled.div`
  position: absolute;
  width: 300px;
  height: 300px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #353647;
  padding: 20px;
  border-radius: 10px;
  z-index: 100;
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
`;
const Channels: React.FC = () => {
  const [channels, setChannels] = useState<string[]>([]);
  const [deletePopup, setDeletePopup] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchChannels = async () => {
      const channelsRef = collection(db, "channels");
      const channelsSnapshot = await getDocs(channelsRef);
      const channelsList = channelsSnapshot.docs.map((doc) => doc.data().name);
      setChannels(channelsList);
    };

    fetchChannels();
  }, []);

  const handleChannelClick = (channel: string) => {
    setSelectedChannel(channel);
    dispatch(setChannel(channel));
  };
  const openPopup = () => {
    setShowPopup(true);
  };
  const handleAddChannel = async () => {
    if (channelName) {
      const channelsRef = collection(db, "channels");
      await addDoc(channelsRef, { name: channelName });
      setChannels((prev) => [...prev, channelName]);
    }
  };
  const handleDeleteChannel = async (channel: string) => {
    if (!channel) return;

    try {
      const channelsRef = collection(db, "channels");
      const q = query(channelsRef, where("name", "==", channel));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (docSnapshot) => {
        const docRef = doc(db, "channels", docSnapshot.id);
        await deleteDoc(docRef);
      });

      setChannels((prev) => prev.filter((ch) => ch !== channel));
    } catch (error) {
      console.error("Error deleting channel: ", error);
    }
  };
  return (
    <ChannelsContainer>
      {channels.map((channel) => (
        <ChannelItem
          key={channel}
          selected={channel === selectedChannel}
          onClick={() => handleChannelClick(channel)}
        >
          {channel}
          <DeletChanneleButton
            onClick={() => {
              setDeletePopup(true);
            }}
          >
            <Delete />
          </DeletChanneleButton>
          {deletePopup && (
            <DeleteChannelPopup>
              <h2>Are you sure you want to delete this channel?</h2>
              <ChannelButton
                onClick={() => {
                  handleDeleteChannel(channel);
                  setDeletePopup(false);
                }}
              >
                Yes
              </ChannelButton>
              <ChannelButton onClick={() => setDeletePopup(false)}>
                No
              </ChannelButton>
            </DeleteChannelPopup>
          )}
        </ChannelItem>
      ))}
      <ChannelButton onClick={openPopup}>Add Channel</ChannelButton>
      {showPopup && (
        <AddChannelPopup>
          <Input
            type="text"
            value={channelName}
            placeholder="Enter channel name"
            onChange={(e) => setChannelName(e.target.value)}
          />
          <ChannelButton
            onClick={() => {
              handleAddChannel();
              setShowPopup(false);
              setChannelName("");
            }}
          >
            Add Channel
          </ChannelButton>
          <CloseButton
            onClick={() => {
              setShowPopup(false);
              setChannelName("");
            }}
          >
            <Close />
          </CloseButton>
        </AddChannelPopup>
      )}
    </ChannelsContainer>
  );
};

export default Channels;
