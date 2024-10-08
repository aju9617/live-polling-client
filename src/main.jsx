import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider as SocketProvider } from "../context/socketContext.jsx";
import { Provider as ChatProvider } from "../context/chatContext.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ChatProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </ChatProvider>
    </BrowserRouter>
  </StrictMode>
);
