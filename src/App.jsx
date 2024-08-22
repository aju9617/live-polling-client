import { Toaster } from "react-hot-toast";
import socketio from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import StudentDashboard from "../pages/StudentDashboard";
import TeacherDashboard from "../pages/TeacherDashboard";
import Home from "../pages/Home";
import { useSocketContext } from "../context/socketContext";
import { useChatContext } from "../context/chatContext";
import KickOut from "../pages/KickOut";

let userId = sessionStorage.getItem("userId");

function App() {
  return (
    <div>
      <Toaster />
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<StudentDashboard />} path="/student" />
        <Route element={<TeacherDashboard />} path="/teacher" />
        <Route element={<KickOut />} path="/kick-out" />
      </Routes>
    </div>
  );
}

const AppWithSocket = () => {
  const socketContext = useSocketContext();
  const chatContext = useChatContext();
  const navigate = useNavigate();

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

    socket.on("disconnect", (e) => {
      navigate("/kick-out");
      console.log("disconnected", e);
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
  return <App />;
};

export default AppWithSocket;
