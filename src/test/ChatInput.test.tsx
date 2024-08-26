"use strict";

import { render, screen, fireEvent } from "@testing-library/react";
import ChatInput from "../components/InputBox";
import { useAuth } from "../contexts/AuthContext";
import useImagePlaceholder from "../hooks/useImage";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "../redux/chatSlice";
import "@testing-library/jest-dom/extend-expect";

jest.mock("../contexts/AuthContext");
jest.mock("../hooks/useImage");

const store = configureStore({ reducer: { chat: chatReducer } });

describe("ChatInput Component", () => {
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

  test("should update the message state on input change", () => {
    render(
      <Provider store={store}>
        <ChatInput />
      </Provider>
    );

    const inputElement = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(inputElement, { target: { value: "Hello" } });

    expect(inputElement).toHaveValue("Hello");
  });

  test("should show suggestions when typing in the input", () => {
    render(
      <Provider store={store}>
        <ChatInput />
      </Provider>
    );

    const inputElement = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(inputElement, { target: { value: "Hello" } });

    expect(screen.getByText("Hello!")).toBeInTheDocument();
  });
});
