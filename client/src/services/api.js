import axios from "axios";

// Deployed Flask backend
const API_URL = "https://interview-mate-ai.onrender.com/api";

// --------------------------------------------------
// Create Interview
// --------------------------------------------------

export const createInterview = async (role, difficulty) => {
  try {
    const response = await axios.post(
      `${API_URL}/interviews`,
      {
        role,
        difficulty,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Create interview error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// --------------------------------------------------
// Get Interview
// --------------------------------------------------

export const getInterview = async (interviewId) => {
  try {
    const response = await axios.get(
      `${API_URL}/interviews/${interviewId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Get interview error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// --------------------------------------------------
// Submit Answer
// --------------------------------------------------

export const submitAnswer = async (
  interviewId,
  questionIndex,
  answer
) => {
  try {
    const response = await axios.post(
      `${API_URL}/interviews/${interviewId}/answer`,
      {
        question_index: questionIndex,
        answer: answer,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Submit answer error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// --------------------------------------------------
// Submit Feedback
// --------------------------------------------------

export const submitFeedback = async (rating, comment) => {
  try {
    const response = await axios.post(
      `${API_URL}/feedback`,
      {
        rating,
        comment,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Submit feedback error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// --------------------------------------------------
// Get Analytics
// --------------------------------------------------

export const getAnalytics = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/analytics`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Analytics error:",
      error.response?.data || error.message
    );

    throw error;
  }
};