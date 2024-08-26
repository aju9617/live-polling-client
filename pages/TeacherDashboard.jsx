import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Formik, Form, Field, FieldArray } from "formik";
import { useSocketContext } from "../context/socketContext";
import QuizCard from "../components/QuizCard";
import { v4 as uuidv4 } from "uuid";
import StudentsList from "../components/StudentsList";
import Discuss from "../components/Discuss";

function QuizForm({ handleSubmitQuestion }) {
  return (
    <div className=" bg-white rounded p-4 w-[540px]">
      <p className="font-bold">Quiz Form</p>
      <Formik
        initialValues={{
          duration: 30,
          question: "",
          options: [{ text: "", isCorrect: false }],
        }}
        onSubmit={handleSubmitQuestion}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="flex flex-col space-y-2 ">
            <label className="text-sm" htmlFor="question">
              Enter duration (in sec)
            </label>
            <Field
              className="border  px-4 py-2 rounded"
              type="number"
              placeholder="enter duration"
              name="duration"
            />
            <label className="text-sm" htmlFor="question">
              Enter question
            </label>
            <Field
              className="border  px-4 py-2 rounded"
              type="textarea"
              placeholder="enter question"
              name="question"
            />

            <FieldArray name="options">
              {({ push, remove }) => (
                <div>
                  <table className="table-auto w-full border-spacing-2 border-separate  ">
                    <thead>
                      <tr>
                        <th className="font-semibold  text-xs    text-left">
                          Sno.
                        </th>
                        <th className="font-semibold  text-xs    text-left">
                          Options
                        </th>
                        <th className="font-semibold  text-xs    text-left">
                          Is correct ?
                        </th>
                        <th className="font-semibold  text-xs    text-left">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {values.options.map((each, index) => (
                        <tr key={index} className="">
                          <td className="text-sm">{index + 1}.</td>
                          <td>
                            {" "}
                            <Field
                              name={`options[${index}].text`}
                              placeholder="Enter option"
                              className="border p-2 w-full text-sm rounded"
                            />
                          </td>
                          <td>
                            <Field
                              name={`options[${index}].isCorrect`}
                              type="checkbox"
                              className="h-4 w-4 mr-2 rounded"
                              onChange={() => {
                                setFieldValue(
                                  `options`,
                                  values.options.map((opt, idx) => ({
                                    ...opt,
                                    isCorrect: idx === index,
                                  }))
                                );
                              }}
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="mx-auto text-red-500"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {values.options.length < 6 && (
                    <button
                      type="button"
                      onClick={() => push({ text: "", isCorrect: false })}
                      className="text-xs px-2 py-1 bg-yellow-600 text-white mr-4"
                    >
                      Add another option +
                    </button>
                  )}
                </div>
              )}
            </FieldArray>

            <div>
              <button
                type="submit"
                className="text-sm px-4 py-2 bg-gray-800 text-white ml-auto block"
              >
                Ask Question →
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

function TeacherDashboard() {
  const socketContext = useSocketContext();
  const [showPollResult, setShowPollResult] = useState(false);
  const [question, setQuestion] = useState(null);
  const [questionList, setQuestionList] = useState([]);
  const [isAddQuestionCtaDisabled, setIsAddQuestionCtaDisabled] =
    useState(false);

  const handleSubmitQuestion = (values) => {
    let currentQuestion = {
      id: uuidv4(),
      duration: values.duration,
      title: values.question,
      options: values.options
        .filter((e) => e.text.length)
        .map((each, ind) => ({
          text: each.text,
          isCorrect: each.isCorrect,
          id: ind + 1,
          poll: 0,
        })),
    };

    let isCorrectOptionSelected = currentQuestion.options.find(
      (e) => e.isCorrect == true
    );

    if (!isCorrectOptionSelected) {
      toast.error("please select the correct option");
      return;
    }

    if (currentQuestion.options.length <= 1) {
      toast.error("please add atleast 2 options");
      return;
    }

    socketContext.socket.emit(
      "new-question-published",
      currentQuestion,
      socketContext.socketId
    );
    setIsAddQuestionCtaDisabled(true);
    setQuestion(currentQuestion);
    setShowPollResult(true);
  };

  const updatePollResult = (options) => {
    setQuestion((e) => ({ ...e, options }));
  };

  useEffect(() => {
    socketContext?.socket?.on("load-questions", (data) => {
      setQuestionList(data);
    });
  }, [socketContext?.socket]);

  return (
    <div className="h-[100vh] bg-blue-500  p-4 flex gap-4 ">
      <Discuss />
      <div className="flex flex-col h-full w-[540px] ">
        <div className="h-max">
          {showPollResult ? (
            <QuizCard
              question={question}
              showPollResult={showPollResult}
              ctaText={
                isAddQuestionCtaDisabled
                  ? "Waiting for students to submit"
                  : "Ask another question"
              }
              updatePollResult={updatePollResult}
              setShowPollResult={setShowPollResult}
              onSubmit={() => {
                setShowPollResult(false);
              }}
              isAdminView
              isCtaDisabled={isAddQuestionCtaDisabled}
              className="px-4 "
            />
          ) : (
            <QuizForm handleSubmitQuestion={handleSubmitQuestion} />
          )}
        </div>
        <div className="mt-4 p-4 bg-white  rounded overflow-y-scroll  scrollbar-hide ">
          <p className="font-bold">Previously asked questions</p>
          {!Boolean(questionList.length) && (
            <p className="p-10 text-gray-500 text-sm text-center">
              No questions posted
            </p>
          )}
          {questionList.map((each) => {
            return (
              <div key={each.id} className="mb-4">
                <QuizCard
                  question={each}
                  showPollResult={true}
                  ctaText="Ask another question"
                  isCtaDisabled={true}
                  showCta={false}
                  showTimer={false}
                  removeShadow
                  isAdminView
                  setShowPollResult={setShowPollResult}
                  onSubmit={() => {}}
                  isViewOnly
                />
              </div>
            );
          })}
        </div>
      </div>
      <StudentsList />
    </div>
  );
}

export default TeacherDashboard;
