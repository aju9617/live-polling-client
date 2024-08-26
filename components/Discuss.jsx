import React, { useEffect, useState, useRef } from "react";

import { useSocketContext } from "../context/socketContext";
import moment from "moment";
import { useChatContext } from "../context/chatContext";

let userName = "anomonus";
function Discuss() {
  const [fullViewMode, setFullViewMode] = useState(false);
  const socketContext = useSocketContext();
  const chatContext = useChatContext();
  const endOfMessagesRef = useRef(null);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (newMessageCount > 0) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500); // Reset shake after animation
      return () => clearTimeout(timer);
    }
  }, [newMessageCount]);

  const handleMessageInput = (event) => {
    if (event.key === "Enter") {
      handleSendMessage(text);
    }
  };

  const handleSendMessage = (message) => {
    if (socketContext.socket && message.length) {
      setText("");
      setMessages((e) => [
        ...e,
        {
          type: "SENT",
          name: userName,
          text: message,
          created: moment().toDate(),
        },
      ]);
      socketContext.socket.emit("message", {
        message,
        name: userName,
        from: socketContext.socketId,
      });
    }
  };

  const toggleFullViewMode = () => {
    setFullViewMode((e) => !e);
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setFullViewMode(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    if (endOfMessagesRef.current)
      endOfMessagesRef.current.scrollTop =
        endOfMessagesRef?.current?.scrollHeight;

    if (fullViewMode) {
      setNewMessageCount(0);
      chatContext.resetMessageNotification();
    }
  }, [messages, fullViewMode]);

  useEffect(() => {
    userName = sessionStorage.getItem("name") ?? "Teacher";

    if (socketContext.socket) {
      socketContext.socket.on("message", (data) => {
        setNewMessageCount((e) => e + 1);
        setMessages((e) => [
          ...e,
          {
            type: "RECEIVED",
            text: data.message,
            from: data.from,
            name: data.name,
            created: moment().toDate(),
          },
        ]);
      });
    }

    return () => {
      if (socketContext.socket) socketContext.socket.off("message");
    };
  }, [socketContext.socket]);

  if (!fullViewMode) {
    return (
      <div
        onClick={toggleFullViewMode}
        className={`${shake ? "shake" : ""} bg-white ${
          newMessageCount ? " border border-red-500" : " border border-gray-200"
        } z-10 cursor-pointer  fixed right-5 bottom-10 w-10 h-10 rounded-full shadow-md text-xl grid place-content-center `}
      >
        <span className="bg-red-500 shadow-md absolute -top-2 -right-1 rounded-full  w-6 h-6 text-xs grid place-content-center text-white text-center">
          {newMessageCount}
        </span>
        📩
      </div>
    );
  }

  return (
    <div className="rounded z-10 fixed right-5 bottom-10 border border-gray-300 w-96 p-3 flex flex-col shadow-md h-[400px] bg-white">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold ">Discuss</span>
        <span onClick={toggleFullViewMode} className="cursor-pointer ">
          ╳
        </span>
      </div>
      <div
        ref={endOfMessagesRef}
        className=" pb-[40px] flex-grow overflow-y-scroll scrollbar-hide"
      >
        {messages.map((each, ind) => {
          if (each.type === "SENT") {
            return (
              <div key={ind} className="mb-2 w-90 ml-auto ">
                <p className="text-sm text-right break-words ">{each.text}</p>
                <p className="text-xs text-gray-500 text-right">
                  {moment(each.created).fromNow()}{" "}
                </p>
              </div>
            );
          } else {
            return (
              <div key={ind} className=" mb-2  break-words ">
                <p className="text-sm max-w-[80%] break-normal">{each.text}</p>
                <p className="text-xs text-gray-500">
                  {each.name} ⊚ {moment(each.created).fromNow()}
                </p>
              </div>
            );
          }
        })}
      </div>
      <div className="flex absolute bottom-0 left-0 right-0 p-3 ">
        <input
          autoFocus
          type="text"
          className="rounded flex-grow border border-gray-400 p-4 py-2 mr-2 text-sm focus:ring-0"
          placeholder="enter message"
          onKeyDown={(e) => handleMessageInput(e)}
          onChange={(e) => setText(e.target.value)}
          value={text}
        />{" "}
        <button
          onClick={(e) => handleSendMessage(text)}
          className="rounded p-4 py-2 bg-gray-600 text-white"
        >
          send
        </button>
      </div>
    </div>
  );
}

export default Discuss;
