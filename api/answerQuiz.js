const express   = require('express');
const router    = express.Router();
const cors      = require('cors');

const Quiz  = require('../modules/Quiz');
const Question  = require('../modules/Question');
const UserQuiz  = require('../modules/userQuiz');
const User      = require('../modules/user');

router.use(express.json());
router.use(cors());

// ===========================
// GET ALL USER QUIZ ANSWERS (optional admin)
// ===========================
router.get('/', async (req, res) => {
  try {
    const userQuizzes = await UserQuiz.find()
      .populate('userId', 'username email')
      .populate('quizId', 'name maxPoint');

    res.status(200).json(userQuizzes);
  } catch (err) {
    console.error('GET /answerQuiz error:', err);
    res.status(500).json({ message: 'Gagal mengambil data jawaban quiz' });
  }
});

// ===========================
// USER ANSWER QUIZ
// ===========================
/**
 * Body: {
 *   userId: "userId",
 *   quizId: "quizId",
 *   answers: [
 *     { questionId: "qId", answer: "userAnswer" },
 *     ...
 *   ]
 * }
 */
router.post('/answer', async (req, res) => {
  const { userId, quizId, answers } = req.body;

  if (!userId || !quizId || !Array.isArray(answers)) {
    return res.status(400).json({ message: 'Isi semua formulir dengan benar' });
  }

  try {
    const alreadyAnswered = await UserQuiz.findOne({ userId, quizId });
    if (alreadyAnswered) {
      return res.status(409).json({
        message: 'Anda sudah menjawab quiz ini'
      });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz tidak ditemukan' });
    }

    let totalCorrect = 0;

    for (const a of answers) {
      const question = await Question.findById(a.questionId);
      if (!question) continue;

      if (a.answer === question.correctAnswer) {
        totalCorrect++;
      }
    }

    const totalQuestions = await Question.countDocuments({ quizId });
    const pointPerQuestion = quiz.maxPoint / totalQuestions;
    const earnedPoint = Math.round(totalCorrect * pointPerQuestion);

    const userQuiz = await UserQuiz.create({
      userId,
      quizId,
      correctAnswer: totalCorrect,
      earnedPoint
    });

    await User.findByIdAndUpdate(
      userId,
      { $inc: { totalPoint: earnedPoint } }
    );

    res.status(201).json({
      message: 'Jawaban berhasil disimpan',
      data: {
        totalQuestions,
        totalCorrect,
        earnedPoint
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Terjadi kesalahan saat menyimpan jawaban',
      error: err.message // 🔥 biar kebaca
    });
  }
});

module.exports = router;
