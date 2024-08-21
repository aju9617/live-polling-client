import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import withSocket from "../hoc/withSocket";
import StudentDashboard from "../pages/StudentDashboard";
import TeacherDashboard from "../pages/TeacherDashboard";
import Home from "../pages/Home";
import { useSocketContext } from "../context/socketContext";

function App() {
  const socketContext = useSocketContext();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/student",
      element: <StudentDashboard />,
    },
    {
      path: "/teacher",
      element: <TeacherDashboard />,
    },
  ]);
  return (
    <div>
      <Toaster />
      <RouterProvider router={router} />
    </div>
  );
}

const AppWithSocket = () => {
  return withSocket(App);
};

export default AppWithSocket;
