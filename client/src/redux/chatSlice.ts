import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

interface Channel {
  channelName: string;
  owner: string;
  rooms: Room[];
  users: string[];
}

interface ChatState {
  messages: Message[];
  channels: Channel[];
  selectedChannel: Channel | null;
  selectedRoom: Room | null;
}

const initialState: ChatState = {
  messages: [],
  channels: [],
  selectedChannel: null,
  selectedRoom: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setAllChannels: (state, action: PayloadAction<Channel[]>) => {
      state.channels = action.payload;
    },
    addRoom: (
      state,
      action: PayloadAction<{ channelId: string; room: Room }>
    ) => {
      const channel = state.channels.find(
        (channel) => channel.channelName === action.payload.channelId
      );

      if (channel) {
        channel.rooms.push(action.payload.room);
      }
    },
    setChannel: (state, action: PayloadAction<Channel>) => {
      state.selectedChannel = action.payload;
      state.selectedRoom = null;
    },
    setRoom: (state, action: PayloadAction<Room>) => {
      state.selectedRoom = action.payload;
    },
    addChannel: (state, action: PayloadAction<Channel>) => {
      state.channels.push(action.payload);
    },
  },
});

export const { setAllChannels, addRoom, setChannel, setRoom, addChannel } =
  chatSlice.actions;
export default chatSlice.reducer;
