import React, { useState, useEffect } from "react";
import { useSocketContext } from "../context/socketContext";

function QuizCard({
  question,
  ctaText,
  showPollResult,
  isCtaDisabled = false,
  onSubmit,
  updatePollResult,
  showCta = true,
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const socketContext = useSocketContext();
  let totalVotes = question?.options?.reduce((acc, e) => acc + e.poll, 0);

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
  }, [question]);

  return (
    <div>
      <h2 className="mb-4  flex justify-between">
        <span className="text-lg font-bold">{question?.title}</span>{" "}
        <span>{totalVotes} students voted</span>
      </h2>
      <div>
        {question?.options.map((each, ind) => {
          return (
            <span
              key={ind + 1}
              className="relative w-full border border-gray-500 block p-2 px-4 mb-4 "
            >
              {showPollResult && (
                <div
                  className={`w-[${each.pollPercentage}%] h-full  ${
                    each.isCorrect ? "bg-green-500" : "bg-gray-500"
                  } opacity-30 absolute top-0 left-0  bottom-0 text-right pointer-events-none`}
                  style={{ width: `${each.pollPercentage}%` }}
                ></div>
              )}

              <label
                htmlFor={`${question?.id}-${each.id}`}
                className="flex items-center justify-between space-x-3 cursor-pointer "
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="questionId"
                    className={`h-4 w-4 ${showPollResult ? "hidden" : ""}`}
                    id={`${question?.id}-${each.id}`}
                    checked={selectedOption === ind}
                    onChange={(e) => {
                      setSelectedOption(ind);
                    }}
                  />
                  <span>{each.text}</span>
                </div>
                {showPollResult && (
                  <span className="font-bold text-sm ">
                    {each.pollPercentage ?? 0} %
                  </span>
                )}
              </label>
            </span>
          );
        })}
      </div>
      {showCta && (
        <button
          disabled={isCtaDisabled}
          onClick={() => onSubmit(selectedOption)}
          className={` p-4 py-2 w-max ${
            isCtaDisabled
              ? "bg-gray-200 text-gray-600"
              : "bg-gray-800 text-white"
          }`}
        >
          {ctaText}
        </button>
      )}
    </div>
  );
}

export default QuizCard;
