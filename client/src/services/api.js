import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api";

// Create a new interview
export const createInterview = async (role, difficulty) => {
  const response = await axios.post(`${API_URL}/interviews`, {
    role,
    difficulty,
  });

  return response.data;
};

// Get interview
export const getInterview = async (interviewId) => {
  const response = await axios.get(
    `${API_URL}/interviews/${interviewId}`
  );

  return response.data;
};

// Submit answer
export const submitAnswer = async (
  interviewId,
  questionIndex,
  answer
) => {
  const response = await axios.post(
    `${API_URL}/interviews/${interviewId}/answer`,
    {
      question_index: questionIndex,
      answer: answer,
    }
  );

  return response.data;
};

// Submit feedback
export const submitFeedback = async (
  rating,
  comment
) => {
  const response = await axios.post(
    `${API_URL}/feedback`,
    {
      rating,
      comment,
    }
  );

  return response.data;
};

// Get analytics
export const getAnalytics = async () => {
  const response = await axios.get(
    `${API_URL}/analytics`
  );

  return response.data;
};