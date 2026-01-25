const Question = require("../modules/Question");
const Quiz = require("../modules/Quiz");
const express = require("express");
const router = express.Router();
const cors = require("cors");

router.use(express.json());
router.use(cors());

// ===========================
// GET QUESTIONS
// ===========================
router.get("/", async (req, res) => {
  try {
    const { quizId } = req.query;
    const filter = quizId ? { quizId } : {};

    // Ambil semua question
    const questions = await Question.find(filter).sort({ createdAt: 1 });

    // Ambil semua quiz yang terkait
    const quizIds = [...new Set(questions.map(q => q.quizId.toString()))];
    const quizzes = await Quiz.find({ _id: { $in: quizIds } });

    // Group questions per quizId
    const grouped = {};
    questions.forEach(q => {
      const key = q.quizId.toString();
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(q);
    });

    // Gabungkan dengan info quiz
    const result = quizIds.map(id => {
      const quiz = quizzes.find(q => q._id.toString() === id);
      return {
        quizId: id,
        name: quiz?.name || "",
        maxPoint: quiz?.maxPoint || 50,
        totalQuestions: grouped[id]?.length || 0,
        questions: grouped[id] || []
      };
    });

    res.status(200).json({
      totalQuiz: result.length,
      data: result
    });

  } catch (err) {
    console.error("GET /question error:", err);
    res.status(500).json({ message: "Gagal mengambil data question" });
  }
});


// ===========================
// CREATE QUIZ + QUESTIONS (1 REQUEST)
// ===========================
router.post("/add", async (req, res) => {
  try {
    const { name, questions, maxPoint } = req.body; 

    if (!name || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Isi semua formulir dengan benar" });
    }

    // Buat Quiz baru
    const quiz = new Quiz({
      name: name.trim(),
      totalQuestions: questions.length, 
      maxPoint: maxPoint || 50          
    });
    await quiz.save();

    // Buat semua Question
    const savedQuestions = [];
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      if (!q.question || !q.options || !q.correctAnswer) {
        return res.status(400).json({ message: `Formulir question ke-${i + 1} belum lengkap` });
      }
      if (!Array.isArray(q.options) || q.options.length < 2) {
        return res.status(400).json({ message: `Options minimal 2 untuk question ke-${i + 1}` });
      }
      if (!q.options.includes(q.correctAnswer)) {
        return res.status(400).json({ message: `Correct answer harus ada di options question ke-${i + 1}` });
      }

      const questionDoc = new Question({
        quizId: quiz._id,
        question: q.question.trim(),
        options: q.options,
        correctAnswer: q.correctAnswer
      });
      await questionDoc.save();
      savedQuestions.push(questionDoc);
    }

    res.status(201).json({
      message: "Quiz dan questions berhasil dibuat",
      data: {
        quiz,
        questions: savedQuestions
      }
    });
  } catch (err) {
    console.error("POST /add error:", err);
    res.status(500).json({ message: "Gagal membuat quiz dan questions" });
  }
});

// ===========================
// UPDATE QUESTION
// ===========================
router.post("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, maxPoint, questions } = req.body;

  try {
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Questions harus diisi minimal 1" });
    }

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz tidak ditemukan" });
    }

    if (name) quiz.name = name.trim();
    if (maxPoint !== undefined) quiz.maxPoint = maxPoint;
    await quiz.save();

    const oldQuestions = await Question.find({ quizId: quiz._id });
    const oldIds = oldQuestions.map(q => q._id.toString());

    const payloadIds = questions.filter(q => q._id).map(q => q._id);

    const toDelete = oldIds.filter(id => !payloadIds.includes(id));
    await Question.deleteMany({ _id: { $in: toDelete } });

    const savedQuestions = [];

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      if (!q.question || !q.options || !q.correctAnswer) {
        return res.status(400).json({ message: `Question ke-${i + 1} belum lengkap` });
      }
      if (!Array.isArray(q.options) || q.options.length < 2) {
        return res.status(400).json({ message: `Options minimal 2 untuk question ke-${i + 1}` });
      }
      if (!q.options.includes(q.correctAnswer)) {
        return res.status(400).json({ message: `Correct answer harus ada di options question ke-${i + 1}` });
      }

      if (q._id) {
        const updatedQ = await Question.findByIdAndUpdate(
          q._id,
          {
            question: q.question.trim(),
            options: q.options,
            correctAnswer: q.correctAnswer
          },
          { new: true }
        );
        if (updatedQ) savedQuestions.push(updatedQ);
      } else {
        const newQ = new Question({
          quizId: quiz._id,
          question: q.question.trim(),
          options: q.options,
          correctAnswer: q.correctAnswer
        });
        await newQ.save();
        savedQuestions.push(newQ);
      }
    }

    quiz.totalQuestions = await Question.countDocuments({ quizId: quiz._id });
    await quiz.save();

    res.status(200).json({
      message: "Quiz dan questions berhasil diperbarui",
      data: {
        quiz,
        questions: savedQuestions
      }
    });

  } catch (err) {
    console.error("POST /update-quiz/:id error:", err);
    res.status(500).json({ message: "Gagal memperbarui quiz dan questions" });
  }
});

// ===========================
// DELETE QUESTION
// ===========================
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Question.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Question tidak ditemukan" });
    }

    res.status(200).json({
      message: "Question berhasil dihapus"
    });
  } catch (err) {
    console.error("DELETE /question error:", err);
    res.status(500).json({ message: "Gagal menghapus question" });
  }
});

module.exports = router;
