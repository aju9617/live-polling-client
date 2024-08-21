import React, { useState } from "react";
import Layout from "../components/Layout";
import { Formik, Form, Field, FieldArray } from "formik";
import { useSocketContext } from "../context/socketContext";
import QuizCard from "../components/QuizCard";
import slugify from "slugify";

function TeacherDashboard() {
  const socketContext = useSocketContext();
  const [showPollResult, setShowPollResult] = useState(false);
  const [question, setQuestion] = useState(null);

  const handleSubmitQuestion = (values) => {
    console.log(values, socketContext);
    let currentQuestion = {
      id: slugify(values.question),
      duration: values.duration,
      title: values.question,
      options: values.options.map((each, ind) => ({
        text: each.text,
        isCorrect: each.isCorrect,
        id: ind + 1,
        poll: 0,
      })),
    };
    socketContext.socket.emit(
      "new-question-published",
      currentQuestion,
      socketContext.socketId
    );
    setQuestion(currentQuestion);
    setShowPollResult(true);
  };

  const updatePollResult = (options) => {
    let totalVotes = options.reduce((acc, e) => e.poll + acc, 0);
    console.log({ totalVotes });
    let updatedPollPercentages = options.map((each) => {
      each.pollPercentage =
        totalVotes > 0 ? Math.ceil((each.poll / totalVotes) * 100) : 0;
      return each;
    });
    setQuestion((e) => ({ ...e, options: updatedPollPercentages }));
  };

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
      <div className="min-h-[60vh] ">
        {showPollResult ? (
          <QuizCard
            question={question}
            showPollResult={showPollResult}
            ctaText="Ask another question"
            // isCtaDisabled={true}
            updatePollResult={updatePollResult}
            onSubmit={() => setShowPollResult(false)}
          />
        ) : (
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
                <label htmlFor="question">Enter duration</label>
                <Field
                  className="border border-gray-500 px-4 py-2"
                  type="number"
                  placeholder="enter duration"
                  name="duration"
                />
                <label htmlFor="question">Enter question</label>
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
                        <p className="w-96">Options</p>
                        <p className="">is correct ?</p>
                        <p className="w-10">Action</p>
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
                        className="text-sm px-4 py-2 bg-yellow-600 text-white mr-4"
                      >
                        Add another option +
                      </button>
                    </div>
                  )}
                </FieldArray>

                <div>
                  <button
                    type="submit"
                    className="text-sm px-4 py-2 bg-gray-800 text-white mr-4"
                  >
                    Ask Question →
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </Layout>
  );
}

export default TeacherDashboard;
