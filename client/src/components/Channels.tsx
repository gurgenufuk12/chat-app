import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useAuth } from "../contexts/AuthContext";
import { setChannel } from "../redux/chatSlice";
import Close from "@mui/icons-material/Close";
import Channel from "../assets/Channel.svg";

const SliderButton = styled.button<{ isOpen: boolean }>`
  background-color: #414256;
  color: white;
  border: none;
  width: 80px;
  height: 40px;
  cursor: pointer;
  position: fixed;
  top: ${({ isOpen }) => (isOpen ? "0" : "0%")};
  left: ${({ isOpen }) => (isOpen ? "" : "0")};
  z-index: 1000;

  @media (min-width: 768px) {
    display: none;
  }
`;
const SliderCLoseButton = styled.button<{ isOpen: Boolean }>`
  position: fixed;
  top: 10px;
  left: 250px;
  background-color: #3dc5b7;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  z-index: 1000;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};

  @media (min-width: 768px) {
    display: none;
  }
`;
const ChannelsContainer = styled.div<{ isOpen: boolean }>`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: ${({ isOpen }) => (isOpen ? "80%" : "0")};
  max-width: 90px;
  padding: ${({ isOpen }) => (isOpen ? "10px" : "0")};
  background-color: #414256;
  height: 100vh;
  top: 0;
  left: 0;
  transition: all 0.3s ease;
  padding-top: 20px;
  z-index: 200;
  overflow: y-scroll;
  @media (min-width: 768px) {
    width: 300px;
    position: relative;
    height: 100vh;
    border-radius: 20px;
    margin-left: 20px;
  }
`;
const ChannelImg = styled.img`
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;
const ChannelItem = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Poppins", sans-serif;
  width: 60px;
  height: 60px;
  border-radius: 10px;
  border: 2px solid #303141;
  font-size: 1.5rem;
  cursor: pointer;
  color: white;
  background-color: ${(props) => (props.selected ? "#303141" : "transparent")};
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
const AddChannelPopup = styled.div`
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
const Question = styled.h2`
  color: white;
  font-family: "Poppins", sans-serif;
  font-weight: 200;
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

const Channels: React.FC = () => {
  const { currentUser } = useAuth();
  const [channels, setChannels] = useState<string[]>([]);
  const [deletePopup, setDeletePopup] = useState<{
    visible: boolean;
    channel: string | null;
  }>({ visible: false, channel: null });
  const [channelName, setChannelName] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    channel: string | null;
  }>({ visible: false, x: 0, y: 0, channel: null });

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchChannels = async () => {
      await axios
        .get("http://localhost:8080/channel/getChannels")
        .then((response) => {
          setChannels(response.data);
        })
        .catch((error) => {
          console.error("Error fetching channels: ", error);
        });
    };

    fetchChannels();
  }, []);

  const handleChannelClick = (channel: string) => {
    setSelectedChannel(channel);
    dispatch(setChannel(channel));
    setIsOpen(false);
  };

  const openPopup = () => {
    setShowPopup(true);
  };

  const handleAddChannel = async () => {
    if (!channelName) return;
    try {
      await axios.post("http://localhost:8080/channel/createChannel", {
        channelName: channelName,
        owner: currentUser?.email,
      });
      setChannels((prev) => [...prev, channelName]);
    } catch (error) {
      console.error("Error adding channel: ", error);
    }
  };

  const handleDeleteChannel = async (channel: string) => {
    if (!channel) return;

    try {
      await axios.delete("http://localhost:8080/channel/deleteChannel", {
        data: {
          channelName: channel,
        },
      });

      setChannels((prev) => prev.filter((ch) => ch !== channel));
    } catch (error) {
      console.error("Error deleting channel: ", error);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, channel: string) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.pageX,
      y: e.pageY,
      channel: channel,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, channel: null });
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        setContextMenu({ visible: false, x: 0, y: 0, channel: null });
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenu.visible]);

  const handleDeleteChannelMenu = () => {
    if (contextMenu.channel) {
      setDeletePopup({ visible: true, channel: contextMenu.channel });
    }
    closeContextMenu();
  };

  return (
    <>
      {isOpen ? null : (
        <SliderButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
          {/* <ChannelText>Channels</ChannelText> */}
        </SliderButton>
      )}
      <SliderCLoseButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        <Close />
      </SliderCLoseButton>
      <ChannelsContainer isOpen={isOpen}>
        <ChannelImg src={Channel} alt="channel"></ChannelImg>
        {channels.map((channel) => (
          <ChannelItem
            key={channel}
            selected={channel === selectedChannel}
            onClick={() => handleChannelClick(channel)}
            onContextMenu={(e) => handleContextMenu(e, channel)}
          >
            {channel.charAt(0).toLocaleUpperCase()}
          </ChannelItem>
        ))}
        {deletePopup.visible && (
          <DeleteChannelPopup>
            <Question>
              Are you sure you want to delete this {deletePopup.channel} ?
            </Question>
            <div>
              <ChannelButton
                onClick={() => {
                  handleDeleteChannel(deletePopup.channel || "");
                  setDeletePopup({ visible: false, channel: null });
                }}
              >
                Yes
              </ChannelButton>
              <ChannelButton
                onClick={() =>
                  setDeletePopup({ visible: false, channel: null })
                }
              >
                No
              </ChannelButton>
            </div>
          </DeleteChannelPopup>
        )}
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
              <Question>Add Channel</Question>
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
        {contextMenu.visible && (
          <ContextMenu
            style={{
              top: contextMenu.y,
              left: contextMenu.x,
            }}
            onClick={closeContextMenu}
          >
            <ContextMenuItem onClick={handleDeleteChannelMenu}>
              Delete
            </ContextMenuItem>
          </ContextMenu>
        )}
      </ChannelsContainer>
    </>
  );
};

export default Channels;
