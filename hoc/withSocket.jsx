import React, { useContext, useEffect, useState } from "react";
import socketio from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { useSocketContext } from "../context/socketContext";
let userId = sessionStorage.getItem("userId");

function withSocket(Children) {
  const socketContext = useSocketContext();

  if (!userId) {
    userId = uuidv4();
    sessionStorage.setItem("userId", userId);
  }

  useEffect(() => {
    console.log("initializing socket connection");
    const Endpoint = import.meta.env.VITE_API_URL;

    let socket = socketio(Endpoint, {
      autoConnect: false,
      withCredentials: true,
    });

    socketContext.setSocketConnection({ socket, socketId: userId });

    socket.auth = { userId };
    socket.connect();

    socket.emit("new-student-joined", {
      userName: sessionStorage.getItem("name"),
      userId,
    });
    socket.on("message", ({ message, media }) => {
      setMessages((e) => [
        ...e,
        {
          type: "RECEIVED",
          photo: user.profile,
          createdAt: new Date(),
          message: message,
          media: media,
          name: user.username,
        },
      ]);
    });

    socket.on("typing-start", () => {
      setTypingAcknowledge(true);
    });

    socket.on("typing-end", () => {
      setTypingAcknowledge(false);
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });

    socket.on("connect_error", (err) => {
      console.log(err.message);
    });

    return function () {
      if (socket) {
        socket.off();
        socket.disconnect();
      }
    };
  }, [userId]);

  return <Children />;
}

export default withSocket;
