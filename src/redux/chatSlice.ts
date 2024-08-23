import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  messages: Array<{ id: string; content: string; sender: string }>;
}

const initialState: ChatState = {
  messages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages: (
      state,
      action: PayloadAction<
        Array<{ id: string; content: string; sender: string }>
      >
    ) => {
      state.messages = action.payload;
    },
    addMessage: (
      state,
      action: PayloadAction<{ id: string; content: string; sender: string }>
    ) => {
      state.messages.push(action.payload);
    },
  },
});

export const { setMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
