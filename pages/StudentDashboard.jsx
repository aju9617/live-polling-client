import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import { useSocketContext } from "../context/socketContext";
import QuizCard from "../components/QuizCard";
import Discuss from "../components/Discuss";

function Dashboard() {
  const socketContext = useSocketContext();
  const [showPollResult, setShowPollResult] = useState(false);
  const [question, setQuestion] = useState(null);
  const [timer, setTimer] = useState(0);
  let timerRef = useRef(null);

  let questionId = question?.id ?? "";
  const handleSubmitAnswer = (selectedOption) => {
    socketContext?.socket?.emit("answer-submitted", {
      answerId: selectedOption,
      questionId: question.id,
    });
    setShowPollResult(true);
    clearInterval(timerRef.current);
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
      timerRef.current = setInterval(() => {
        setTimer((e) => {
          if (e >= question.duration) {
            setShowPollResult(true);
            clearInterval(timerRef.current);
            return e;
          } else {
            return e + 1;
          }
        });
      }, 1000);
    }

    return function () {
      clearInterval(timerRef.current);
    };
  }, [questionId]);

  useEffect(() => {}, []);

  return (
    <Layout
      showTitle={true}
      title="Snap Quiz"
      rightSection={
        question ? (
          <div className="h-[80px] w-[80px] rounded-full text-xs flex justify-center items-center flex-col text-center   bg-blue-200">
            <span className="font-bold mb-0 ">
              {" "}
              {timer} / {question.duration}
            </span>
            seconds remaining
          </div>
        ) : (
          <></>
        )
      }
    >
      <div className="relative min-h-[60vh]">
        <Discuss />
        {question ? (
          <QuizCard
            question={question}
            ctaText={showPollResult ? "waiting for new answers" : "submit"}
            onSubmit={handleSubmitAnswer}
            showPollResult={showPollResult}
            updatePollResult={updatePollResult}
            isCtaDisabled={showPollResult}
          />
        ) : (
          <p className="text-center  ">
            waiting for teacher to ask question...
          </p>
        )}
      </div>
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
