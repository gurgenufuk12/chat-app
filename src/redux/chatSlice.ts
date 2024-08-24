import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  id: string;
  content: string;
  sender: string;
  createdAt: Date;
}

interface ChatState {
  messages: Message[];
}

const initialState: ChatState = {
  messages: [],
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
  },
});

export const { setMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
