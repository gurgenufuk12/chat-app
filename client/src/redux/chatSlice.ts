import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { channel } from "diagnostics_channel";

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
        console.log("room added", action.payload.room);
      }
      // INFO : ADDS A NEW ROOM TO THE STATE
    },
    setChannel: (state, action: PayloadAction<Channel>) => {
      state.selectedChannel = action.payload;
      state.selectedRoom = null;
      console.log("channel set", action.payload);

      // INFO : SETS CHANNEL WHEN NEW CHANNEL SELECTED
    },
    setRoom: (state, action: PayloadAction<Room>) => {
      state.selectedRoom = action.payload;
      console.log("room set", action.payload);

      // INFO : SETS ROOM WHEN NEW ROOM SELECTED
    },
    addChannel: (state, action: PayloadAction<Channel>) => {
      console.log("channel added", action.payload);
      state.channels.push(action.payload);
      // INFO : ADDS A NEW CHANNEL TO THE STATE
    },
  },
});

export const { setAllChannels, addRoom, setChannel, setRoom, addChannel } =
  chatSlice.actions;
export default chatSlice.reducer;
