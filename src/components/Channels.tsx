import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useDispatch } from "react-redux";
import { setChannel } from "../redux/chatSlice";

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
  padding: 10px;
  cursor: pointer;
  color: white;
  background-color: ${(props) => (props.selected ? "#303141" : "transparent")};
  border-radius: ${(props) => (props.selected ? "10px" : "0")};
`;

const AddChannelButton = styled.button`
  margin-top: 20px;
  padding: 10px;
  background-color: #3dc5b7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const Channels: React.FC = () => {
  const [channels, setChannels] = useState<string[]>([]);
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
    setSelectedChannel(channel); // Update the selected channel
    dispatch(setChannel(channel));
  };

  const handleAddChannel = async () => {
    const channelName = prompt("Enter channel name:");
    if (channelName) {
      const channelsRef = collection(db, "channels");
      await addDoc(channelsRef, { name: channelName });
      setChannels((prev) => [...prev, channelName]);
    }
  };

  return (
    <ChannelsContainer>
      {channels.map((channel) => (
        <ChannelItem
          key={channel}
          selected={channel === selectedChannel} // Highlight the selected channel
          onClick={() => handleChannelClick(channel)}
        >
          {channel}
        </ChannelItem>
      ))}
      <AddChannelButton onClick={handleAddChannel}>
        Add Channel
      </AddChannelButton>
    </ChannelsContainer>
  );
};

export default Channels;
