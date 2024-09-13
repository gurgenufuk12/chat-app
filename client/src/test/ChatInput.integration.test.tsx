import { render, screen, fireEvent } from "@testing-library/react";
import ChatInput from "../components/InputBox";
import { useAuth } from "../contexts/AuthContext";
import useImagePlaceholder from "../hooks/useImage";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "../redux/chatSlice";
import { addDoc, Timestamp } from "firebase/firestore";
import { collection } from "firebase/firestore";
import "@testing-library/jest-dom/extend-expect";

jest.mock("../contexts/AuthContext");
jest.mock("../hooks/useImage");
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  Timestamp: { fromDate: jest.fn() },
}));

const store = configureStore({ reducer: { chat: chatReducer } });

describe("ChatInput Component Integration", () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: { email: "test@example.com" },
    });
    (useImagePlaceholder as jest.Mock).mockReturnValue({
      imagePlaceholder: null,
      generateImagePlaceholder: jest.fn(),
      clearPlaceholder: jest.fn(),
    });
  });

  test("should send message when Send button is clicked", async () => {
    const mockAddDoc = addDoc as jest.Mock;
    mockAddDoc.mockResolvedValueOnce({});

    render(
      <Provider store={store}>
        <ChatInput />
      </Provider>
    );

    const inputElement = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(inputElement, { target: { value: "Hello" } });
    fireEvent.click(screen.getByRole("button"));

    expect(mockAddDoc).toHaveBeenCalledWith(expect.anything(), {
      content: "Hello",
      sender: "test@example.com",
      createdAt: expect.anything(),
    });
  });
});
