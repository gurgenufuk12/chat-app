import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  id: string;
  content: string;
  sender: string;
  createdAt: Date;
}

interface ChatState {
  messages: Message[];
  channel: string | null;
}

const initialState: ChatState = {
  messages: [],
  channel: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload.map((message) => ({
        ...message,
        createdAt: new Date(message.createdAt),
      }));
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push({
        ...action.payload,
        createdAt: new Date(action.payload.createdAt),
      });
    },
    setChannel: (state, action: PayloadAction<string>) => {
      state.channel = action.payload;
    },
  },
});

export const { setMessages, addMessage, setChannel } = chatSlice.actions;
export default chatSlice.reducer;
