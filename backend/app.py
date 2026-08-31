from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import uuid
import os

app = Flask(__name__)
CORS(app)

# --------------------------------------------------
# In-memory storage
# --------------------------------------------------

interviews = {}
feedback_list = []

# --------------------------------------------------
# Interview questions
# --------------------------------------------------

QUESTION_BANK = {
    "Software Engineer": [
        "Tell me about yourself and your technical background.",
        "Explain one software project you have worked on.",
        "What is the difference between an array and a linked list?",
        "How would you debug a program that is producing unexpected results?",
        "Why should we hire you for this software engineering role?"
    ],

    "Data Scientist": [
        "Tell me about yourself and your data science background.",
        "Explain a machine learning project you have worked on.",
        "What is the difference between supervised and unsupervised learning?",
        "How do you handle missing values in a dataset?",
        "Why should we hire you for this data science role?"
    ],

    "Frontend Developer": [
        "Tell me about yourself and your frontend development experience.",
        "Explain a React project you have worked on.",
        "What is the difference between state and props in React?",
        "How do you improve the performance of a web application?",
        "Why should we hire you for this frontend developer role?"
    ]
}


# --------------------------------------------------
# Simple AI evaluation
# --------------------------------------------------

def evaluate_answer(answer, question):
    """
    Simple rule-based AI evaluation.
    No external API or API key required.
    """

    answer = answer.strip()

    if not answer:
        return {
            "score": 0,
            "communication": 0,
            "technical": 0,
            "relevance": 0,
            "feedback": "Please provide an answer before submitting."
        }

    words = answer.split()
    word_count = len(words)

    # Basic score based on answer depth
    if word_count < 15:
        base_score = 45
    elif word_count < 30:
        base_score = 60
    elif word_count < 60:
        base_score = 75
    elif word_count < 100:
        base_score = 85
    else:
        base_score = 90

    # Detect useful interview keywords
    keywords = [
        "project",
        "experience",
        "problem",
        "solution",
        "result",
        "team",
        "learned",
        "technology",
        "implemented",
        "improved",
        "because",
        "example"
    ]

    keyword_hits = sum(
        1 for keyword in keywords
        if keyword.lower() in answer.lower()
    )

    bonus = min(keyword_hits * 2, 10)

    score = min(base_score + bonus, 100)

    communication = min(score + 2, 100)
    technical = max(score - 3, 0)
    relevance = min(score + 1, 100)

    if score >= 85:
        feedback = (
            "Strong answer. You provided useful detail and showed "
            "good communication. Try adding one measurable result "
            "or specific example to make the answer even stronger."
        )

    elif score >= 70:
        feedback = (
            "Good answer. Your response is relevant, but you can "
            "improve it by explaining the specific actions you took "
            "and the result you achieved."
        )

    elif score >= 50:
        feedback = (
            "Your answer has a good starting point, but it needs "
            "more detail. Try using a real example and explain "
            "the problem, your action, and the outcome."
        )

    else:
        feedback = (
            "Your answer is too short. Try giving a structured "
            "response with an example, your approach, and the result."
        )

    return {
        "score": score,
        "communication": communication,
        "technical": technical,
        "relevance": relevance,
        "feedback": feedback
    }


# --------------------------------------------------
# Health check
# --------------------------------------------------

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "InterviewMate AI Flask backend is running",
        "status": "success"
    })


# --------------------------------------------------
# Create interview
# --------------------------------------------------

@app.route("/api/interviews", methods=["POST"])
def create_interview():

    data = request.get_json() or {}

    role = data.get("role", "Software Engineer")
    difficulty = data.get("difficulty", "Beginner")

    interview_id = str(uuid.uuid4())

    questions = QUESTION_BANK.get(
        role,
        QUESTION_BANK["Software Engineer"]
    )

    interviews[interview_id] = {
        "id": interview_id,
        "role": role,
        "difficulty": difficulty,
        "questions": questions,
        "answers": [],
        "completed": False,
        "created_at": datetime.now().isoformat()
    }

    return jsonify({
        "success": True,
        "interview": interviews[interview_id]
    })


# --------------------------------------------------
# Get interview
# --------------------------------------------------

@app.route("/api/interviews/<interview_id>", methods=["GET"])
def get_interview(interview_id):

    interview = interviews.get(interview_id)

    if not interview:
        return jsonify({
            "success": False,
            "message": "Interview not found"
        }), 404

    return jsonify({
        "success": True,
        "interview": interview
    })


# --------------------------------------------------
# Submit answer
# --------------------------------------------------

@app.route("/api/interviews/<interview_id>/answer", methods=["POST"])
def submit_answer(interview_id):

    interview = interviews.get(interview_id)

    if not interview:
        return jsonify({
            "success": False,
            "message": "Interview not found"
        }), 404

    data = request.get_json() or {}

    answer = data.get("answer", "")
    question_index = int(data.get("question_index", 0))

    questions = interview["questions"]

    if question_index >= len(questions):
        return jsonify({
            "success": False,
            "message": "Invalid question"
        }), 400

    question = questions[question_index]

    evaluation = evaluate_answer(
        answer,
        question
    )

    result = {
        "question": question,
        "answer": answer,
        "question_index": question_index,
        **evaluation
    }

    interview["answers"].append(result)

    # Mark completed
    if question_index == len(questions) - 1:
        interview["completed"] = True

    return jsonify({
        "success": True,
        "evaluation": evaluation,
        "completed": interview["completed"]
    })


# --------------------------------------------------
# Submit user feedback
# --------------------------------------------------

@app.route("/api/feedback", methods=["POST"])
def submit_feedback():

    data = request.get_json() or {}

    feedback = {
        "rating": data.get("rating", 0),
        "comment": data.get("comment", ""),
        "created_at": datetime.now().isoformat()
    }

    feedback_list.append(feedback)

    return jsonify({
        "success": True,
        "message": "Thank you for your feedback!"
    })


# --------------------------------------------------
# Analytics
# --------------------------------------------------

@app.route("/api/analytics", methods=["GET"])
def analytics():

    total_interviews = len(interviews)

    completed_interviews = sum(
        1 for interview in interviews.values()
        if interview["completed"]
    )

    total_answers = sum(
        len(interview["answers"])
        for interview in interviews.values()
    )

    scores = []

    for interview in interviews.values():
        for answer in interview["answers"]:
            scores.append(answer["score"])

    average_score = (
        round(sum(scores) / len(scores), 1)
        if scores
        else 0
    )

    completion_rate = (
        round(
            completed_interviews / total_interviews * 100,
            1
        )
        if total_interviews
        else 0
    )

    return jsonify({
        "success": True,
        "analytics": {
            "total_interviews": total_interviews,
            "completed_interviews": completed_interviews,
            "total_answers": total_answers,
            "average_score": average_score,
            "completion_rate": completion_rate,
            "feedback_count": len(feedback_list)
        }
    })


# --------------------------------------------------
# Run server
# --------------------------------------------------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )