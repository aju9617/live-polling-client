import React, { useState, useEffect } from "react";
import { useSocketContext } from "../context/socketContext";
import moment from "moment";

function StudentsList() {
  const [studentList, setStudentList] = useState([]);
  const socketContext = useSocketContext();

  const kickOutStudent = (id) => {
    socketContext?.socket.emit("kick-out", id);
  };

  useEffect(() => {
    let func = (data) => {
      setStudentList(data);
    };
    socketContext?.socket?.on("load-students", func);

    return () => {
      socketContext?.socket?.off("load-students", func);
    };
  }, [socketContext?.socket]);

  return (
    <div className="mt-4">
      <p className="font-bold mb-4">Students list</p>
      {!Boolean(studentList.length) && (
        <p className="p-4 text-gray-500 text-sm text-center">
          No student joined yet
        </p>
      )}
      {studentList.map((each) => (
        <div
          key={each.userId}
          className="mb-2 inline-block p-2 bg-gray-300 mr-2 min-w-40"
        >
          <p className="text-sm font-semibold">{each.userName}</p>
          <p className="text-xs">joined {moment(each.joinedAt).fromNow()}</p>
          <button
            className="bg-red-500 text-white text-xs p-2 px-3 mt-2"
            onClick={() => kickOutStudent(each.userId)}
          >
            kick out
          </button>
        </div>
      ))}
    </div>
  );
}

export default StudentsList;
