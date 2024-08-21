import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useSocketContext } from "../context/socketContext";
import QuizCard from "../components/QuizCard";

function Dashboard() {
  const socketContext = useSocketContext();
  const [showPollResult, setShowPollResult] = useState(false);
  const [question, setQuestion] = useState(null);
  const [timer, setTimer] = useState(0);
  let timerRef = null;

  const handleSubmitAnswer = (selectedOption) => {
    socketContext?.socket?.emit("answer-submitted", {
      answerId: selectedOption,
      questionId: question.id,
    });
    setTimer(0);
    setShowPollResult(true);
    clearInterval(timerRef);
  };

  const updatePollResult = (options) => {
    setQuestion((e) => ({ ...e, options }));
  };

  useEffect(() => {
    socketContext?.socket?.on("question-posted", (data) => {
      setQuestion(data);
      setTimer(0);
      setShowPollResult(false);
    });
  }, [socketContext?.socket]);

  useEffect(() => {
    if (question) {
      timerRef = setInterval(() => {
        setTimer((e) => {
          if (e >= question.duration) {
            setShowPollResult(true);
            clearInterval(timerRef);
            return e;
          } else {
            return e + 1;
          }
        });
      }, 1000);
    }

    return function () {
      clearInterval(timerRef);
    };
  }, [question]);

  if (!question) {
    return (
      <Layout>
        <div className="min-h-[60vh] grid place-content-center">
          <p className="text-center  ">
            waiting for teacher to ask question...
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      showTitle={true}
      title="Select correct option and submit"
      rightSection={
        <div className="h-[80px] w-[80px] rounded-full text-xs flex justify-center items-center flex-col text-center   bg-blue-200">
          <span className="font-bold mb-0 ">
            {" "}
            {timer} / {question.duration}
          </span>
          seconds remaining
        </div>
      }
    >
      <QuizCard
        question={question}
        ctaText={showPollResult ? "waiting for new answers" : "submit"}
        onSubmit={handleSubmitAnswer}
        showPollResult={showPollResult}
        updatePollResult={updatePollResult}
      />
    </Layout>
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
    <Layout>
      <div className="flex flex-col space-y-4 min-h-[60vh] items-center justify-center">
        <input
          type="text"
          placeholder="enter your name"
          className="p-2 px-4 block border border-gray-700 w-[420px]"
          onChange={(e) => setUserName(e.target.value)}
        />
        <button
          onClick={handleUserName}
          className="bg-gray-800 text-white px-4 py-2 w-52   mx-auto"
        >
          Submit
        </button>
      </div>
    </Layout>
  );
}
export default RegisterStudent;
