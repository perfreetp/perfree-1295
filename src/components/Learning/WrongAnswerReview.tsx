import { ArrowLeft, CheckCircle, XCircle, BookOpen } from "lucide-react";
import type { LearningTask } from "@/data/learning";
import { cn } from "@/lib/utils";

interface WrongQuiz {
  index: number;
  question: string;
  options: string[];
  correctIndex: number;
  userAnswerIndex: number;
  explanation: string;
}

interface WrongAnswerReviewProps {
  task: LearningTask;
  userAnswers: Record<string, number>;
  onBack: () => void;
}

export default function WrongAnswerReview({ task, userAnswers, onBack }: WrongAnswerReviewProps) {
  const wrongQuizzes: WrongQuiz[] = task.quizzes
    .map((quiz, idx) => {
      const key = `${task.id}_${idx}`;
      const userAnswer = userAnswers[key];
      if (userAnswer === undefined || userAnswer === quiz.correctIndex) return null;
      return {
        index: idx,
        question: quiz.question,
        options: quiz.options,
        correctIndex: quiz.correctIndex,
        userAnswerIndex: userAnswer,
        explanation: quiz.explanation,
      };
    })
    .filter((q): q is WrongQuiz => q !== null);

  const totalQuizzes = task.quizzes.length;
  const correctCount = totalQuizzes - wrongQuizzes.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-cream/80 py-8 animate-fade-in">
      <div className="container mx-auto px-4 max-w-3xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-ink/70 hover:text-ink transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>返回</span>
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="text-gold" size={24} />
            <h2 className="font-serif text-xl font-bold text-ink">{task.title}</h2>
          </div>
          <p className="text-gray-500 text-sm mb-4">
            共 {totalQuizzes} 题，答对 {correctCount} 题，答错 {wrongQuizzes.length} 题
          </p>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-sm">
              <CheckCircle size={16} />
              答对 {correctCount}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm">
              <XCircle size={16} />
              答错 {wrongQuizzes.length}
            </div>
          </div>
        </div>

        {wrongQuizzes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <h3 className="font-serif text-xl font-bold text-ink mb-2">全部答对！</h3>
            <p className="text-gray-500">太棒了，本次测验没有错题。</p>
          </div>
        ) : (
          <div className="space-y-4">
            {wrongQuizzes.map((quiz, displayIdx) => (
              <div
                key={quiz.index}
                className="bg-white rounded-xl shadow-md overflow-hidden animate-fade-in"
                style={{ animationDelay: `${displayIdx * 80}ms` }}
              >
                <div className="p-5 md:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">
                      {quiz.index + 1}
                    </span>
                    <span className="px-2.5 py-0.5 bg-red-100 text-red-600 rounded text-xs font-medium">
                      答错
                    </span>
                  </div>

                  <p className="text-ink font-medium mb-4 leading-relaxed">{quiz.question}</p>

                  <div className="space-y-2 mb-5">
                    {quiz.options.map((option, optIdx) => {
                      const isCorrect = optIdx === quiz.correctIndex;
                      const isUserAnswer = optIdx === quiz.userAnswerIndex;
                      return (
                        <div
                          key={optIdx}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors",
                            isCorrect
                              ? "bg-green-50 border-green-200"
                              : isUserAnswer
                              ? "bg-red-50 border-red-200"
                              : "bg-gray-50 border-gray-100"
                          )}
                        >
                          <span
                            className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                              isCorrect
                                ? "bg-green-500 text-white"
                                : isUserAnswer
                                ? "bg-red-500 text-white"
                                : "bg-gray-200 text-gray-500"
                            )}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span
                            className={cn(
                              "flex-1 text-sm",
                              isCorrect ? "text-green-700 font-medium" : isUserAnswer ? "text-red-700" : "text-gray-600"
                            )}
                          >
                            {option}
                          </span>
                          {isCorrect && <CheckCircle size={16} className="text-green-500 flex-shrink-0" />}
                          {isUserAnswer && !isCorrect && <XCircle size={16} className="text-red-500 flex-shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-gold/5 border border-gold/20 rounded-lg p-4">
                    <p className="text-sm font-medium text-gold mb-1">解析</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{quiz.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
