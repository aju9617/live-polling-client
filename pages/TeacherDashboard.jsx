import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import toast from "react-hot-toast";
import { Formik, Form, Field, FieldArray } from "formik";
import { useSocketContext } from "../context/socketContext";
import QuizCard from "../components/QuizCard";
import { v4 as uuidv4 } from "uuid";
import StudentsList from "../components/StudentsList";

function TeacherDashboard() {
  const socketContext = useSocketContext();
  const [showPollResult, setShowPollResult] = useState(false);
  const [question, setQuestion] = useState(null);
  const [questionList, setQuestionList] = useState([]);

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
    setQuestion(currentQuestion);
    setShowPollResult(true);
  };

  const updatePollResult = (options) => {
    setQuestion((e) => ({ ...e, options }));
  };

  useEffect(() => {
    socketContext?.socket?.on("load-questions", (data) => {
      console.log(data);
      setQuestionList(data);
    });
  }, [socketContext?.socket]);

  return (
    <Layout
      title="Ask Question and Options"
      showTitle
      rightSection={
        <>
          <p>Hello {sessionStorage.getItem("name")}</p>
        </>
      }
    >
      <div className="min-h-[60vh]">
        {showPollResult ? (
          <QuizCard
            question={question}
            showPollResult={showPollResult}
            ctaText="Ask another question"
            updatePollResult={updatePollResult}
            onSubmit={() => setShowPollResult(false)}
          />
        ) : (
          <div className="mb-4">
            <p className="font-bold">Form</p>
            <Formik
              initialValues={{
                duration: 60,
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
                    className="border border-gray-500 px-4 py-2"
                    type="number"
                    placeholder="enter duration"
                    name="duration"
                  />
                  <label className="text-sm" htmlFor="question">
                    Enter question
                  </label>
                  <Field
                    className="border border-gray-500 px-4 py-2"
                    type="textarea"
                    placeholder="enter question"
                    name="question"
                  />

                  <FieldArray name="options">
                    {({ push, remove }) => (
                      <div>
                        <div className="mb-4 flex items-center space-x-4">
                          <p className="w-96 text-sm">Options</p>
                          <p className=" text-sm">is correct ?</p>
                          <p className="w-10 text-sm">Action</p>
                        </div>
                        {values.options.map((each, index) => (
                          <div
                            key={index}
                            className="mb-4 flex items-center space-x-4"
                          >
                            <Field
                              name={`options[${index}].text`}
                              placeholder="Enter option"
                              className="border p-2 w-96"
                            />
                            <div className="w-[82px]">
                              <Field
                                name={`options[${index}].isCorrect`}
                                type="checkbox"
                                className="h-4 w-4 mr-2"
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
                            </div>

                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="ml-2 text-red-500"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push({ text: "", isCorrect: false })}
                          className="text-xs px-2 py-1 bg-yellow-600 text-white mr-4"
                        >
                          Add another option +
                        </button>
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
        )}
        <StudentsList />
        <div className="mt-4">
          <p className="font-bold">Previously asked questions</p>
          {!Boolean(questionList.length) && (
            <p className="p-4 text-gray-500 text-sm text-center">
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
                  onSubmit={() => setShowPollResult(false)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

export default TeacherDashboard;
