import axios from "axios";
import toast from "react-hot-toast";

let API_ENDPOINT = "http://localhost:4040";

const registerStudent = async () => {
  try {
    const { data } = await axios.post(`${API_ENDPOINT}/v1/add-student`);
    return data;
  } catch (error) {
    toast.error(error.message ?? "something went wrong");
  }
};

const registerTeacher = async () => {
  try {
    const { data } = await axios.post(`${API_ENDPOINT}/v1/add-teacher`);
    return data;
  } catch (error) {
    toast.error(error.message ?? "something went wrong");
  }
};

const addQuestion = async ({ teacherId, question, options, timeLimit }) => {
  try {
    const { data } = await axios.post(`${API_ENDPOINT}/v1/add-question`, {
      teacherId,
      question,
      options,
      timeLimit,
    });
    return data;
  } catch (error) {
    toast.error(error.message ?? "something went wrong");
  }
};

const submitAnswer = async ({ questionId, answer }) => {
  try {
    const { data } = await axios.post(`${API_ENDPOINT}/v1/submit-answer`, {
      questionId,
      answer,
    });
    return data;
  } catch (error) {
    toast.error(error.message ?? "something went wrong");
  }
};

export { registerStudent, registerTeacher, addQuestion, submitAnswer };
