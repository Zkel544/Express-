const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  maxPoint: {
    type: Number,
    default: 50 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Quiz", quizSchema);
