import React, { useState, useEffect, useRef } from "react";
import { useSocketContext } from "../context/socketContext";

function QuizCard({
  question,
  onSubmit,
  updatePollResult,
  showCta = true,
  showTimer = true,
  removeShadow = false,
  showPollResult,
  className = "",
  isViewOnly = false,
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [timer, setTimer] = useState(0);

  let timerRef = useRef(null);
  const socketContext = useSocketContext();
  let totalVotes = question?.options?.reduce((acc, e) => acc + e.poll, 0);

  let questionId = question?.id;
  useEffect(() => {
    let func = (data) => {
      if (data.questionId === question.id && updatePollResult) {
        updatePollResult(data.options);
      }
    };
    socketContext?.socket?.on("poll-result", func);

    return () => {
      socketContext?.socket?.off("poll-result", func);
    };
  }, [socketContext?.socket, question, updatePollResult]);

  useEffect(() => {
    setSelectedOption(null);
    setTimer(0);
  }, [questionId]);

  useEffect(() => {
    if (question && !isViewOnly) {
      timerRef.current = setInterval(() => {
        setTimer((e) => {
          if (e >= question.duration) {
            onSubmit(selectedOption);
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

  return (
    <div
      className={`${className} ${
        removeShadow ? "" : "shadow-lg"
      }  bg-white  rounded`}
    >
      {showTimer && (
        <div className="border-b border-gray-100 py-2 flex items-center justify-between">
          <p>Answer</p>
          <div className="text-sm text-blue-500 bg-blue-100 p-2  rounded-sm ">
            Time left{" "}
            <span className="bg-gray-600 text-white p-1 rounded-sm">
              {(question?.duration ?? 0) - timer}
            </span>
          </div>
        </div>
      )}
      <div className="">
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
                  ? "bg-green-200 border-green-500"
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
      {showCta && (
        <div className="py-2">
          <button
            disabled={showPollResult}
            onClick={() => {
              onSubmit(selectedOption);
              clearInterval(timerRef.current);
            }}
            className={`p-2 px-4 rounded-sm text-sm text-white  block ml-auto ${
              showPollResult ? "bg-gray-400" : "bg-gray-600"
            }`}
          >
            {showPollResult ? "waiting for new answers" : "submit"}
          </button>
        </div>
      )}
    </div>
  );
}

export default QuizCard;
