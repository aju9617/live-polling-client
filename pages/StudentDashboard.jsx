import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import { useSocketContext } from "../context/socketContext";
import QuizCard from "../components/QuizCard";
import Discuss from "../components/Discuss";

function Dashboard() {
  const socketContext = useSocketContext();
  const [showPollResult, setShowPollResult] = useState(false);
  const [question, setQuestion] = useState(null);

  const handleSubmitAnswer = (selectedOption) => {
    if (!selectedOption && selectedOption !== 0) {
      return;
    }
    socketContext?.socket?.emit("answer-submitted", {
      answerId: selectedOption,
      questionId: question.id,
    });
    setShowPollResult(true);
  };

  const updatePollResult = (options) => {
    setQuestion((e) => ({ ...e, options }));
  };

  useEffect(() => {
    socketContext?.socket?.on("question-posted", (data) => {
      setQuestion(data);
      setShowPollResult(false);
    });

    let func = (data) => {
      if (data.questionId === question.id && updatePollResult) {
        updatePollResult(data.options);
      }
    };
    socketContext?.socket?.on("poll-result", func);

    return () => {
      socketContext?.socket?.off("poll-result", func);
    };
  }, [socketContext?.socket, question]);

  return (
    <div className="bg-blue-500 min-h-[100vh] flex justify-center items-center ">
      <Discuss />
      {question ? (
        <div className="w-[540px]">
          <QuizCard
            question={question}
            ctaText={
              showPollResult ? "Waiting for students to submit" : "Submit"
            }
            updatePollResult={updatePollResult}
            onSubmit={handleSubmitAnswer}
            isCtaDisabled={showPollResult}
            showPollResult={showPollResult}
            setShowPollResult={setShowPollResult}
            className="px-4 "
          />
        </div>
      ) : (
        <div className="shadow-lg min-h-[350px] grid place-content-center bg-white w-[540px] rounded">
          {" "}
          <p className="text-center  ">
            waiting for teacher to ask question...
          </p>
        </div>
      )}
      {/* {question ? (
        <div className="shadow-lg  bg-white w-[540px] rounded">
          <div className="border-b border-gray-100 p-4 py-2 flex items-center justify-between">
            <p>Answer</p>
            <div className="text-sm text-blue-500 bg-blue-100 p-2  rounded-sm ">
              Time left{" "}
              <span className="bg-gray-600 text-white p-1 rounded-sm">
                {(question?.duration ?? 0) - timer}
              </span>
            </div>
          </div>
          <div className="px-4">
            <h1 className="my-4 font-bold ">{question?.title}</h1>
            {question?.options?.map((each, ind) => {
              return (
                <p
                  onClick={() => {
                    setSelectedOption(ind);
                  }}
                  key={ind + 1}
                  className={`hover:bg-blue-100 rounded cursor-pointer mb-1 p-2 px-4 text-sm border flex justify-between items-center ${
                    each.isCorrect && showPollResult
                      ? "bg-green-400 border-green-500"
                      : ""
                  } ${
                    selectedOption === ind && !showPollResult
                      ? " border-blue-500"
                      : ""
                  } ${selectedOption === ind ? " bg-blue-200" : ""}`}
                >
                  <span>{each.text}</span>

                  {showPollResult && (
                    <span className="font-bold text-sm ">
                      {each.pollPercentage ?? 0} %
                    </span>
                  )}
                </p>
              );
            })}
          </div>
          <div className="px-4 py-2">
            <button
              disabled={showPollResult}
              onClick={() => handleSubmitAnswer(selectedOption)}
              className={`p-2 px-4 rounded-sm text-sm text-white  block ml-auto ${
                showPollResult ? "bg-gray-400" : "bg-gray-600"
              }`}
            >
              {showPollResult ? "waiting for new answers" : "submit"}
            </button>
          </div>
        </div>
      ) : (
        <div className="shadow-lg min-h-[350px] grid place-content-center bg-white w-[540px] rounded">
          {" "}
          <p className="text-center  ">
            waiting for teacher to ask question...
          </p>
        </div>
      )} */}
    </div>
  );
}

function RegisterStudent() {
  const socketContext = useSocketContext();
  let isUserRegistered = sessionStorage.getItem("name");

  const [userName, setUserName] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  if (isUserRegistered) {
    return <Dashboard />;
  }

  const handleUserName = () => {
    if (userName) {
      sessionStorage.setItem("name", userName);
      sessionStorage.setItem("type", "student");
      socketContext?.socket?.emit("new-student-joined", {
        userName,
        userId: socketContext.socketId,
      });
      setRefreshKey((e) => e + 1);
    }
  };

  return (
    <div className="bg-blue-500 min-h-[100vh] flex justify-center items-center ">
      <div className="shadow-lg  bg-white w-[540px] rounded">
        <div className="border-b border-gray-100 p-4 py-2 flex items-center justify-between">
          <p>Welcome Student</p>
        </div>
        <div className="flex flex-col space-y-4 items-center justify-center p-4">
          <label htmlFor="registerName" className="text-sm block w-full">
            Enter your name
          </label>
          <input
            id="registerName"
            type="text"
            autoFocus
            placeholder="Raghav Singh"
            className="p-2 px-4 block border border-gray-700 w-full rounded"
            onChange={(e) => setUserName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleUserName();
              }
            }}
          />
        </div>
        <div className="px-4 py-2">
          <button
            onClick={handleUserName}
            className={`p-2 px-4 rounded-sm text-sm text-white  block ml-auto  bg-gray-600`}
          >
            submit
          </button>
        </div>
      </div>
    </div>
  );
}
export default RegisterStudent;
