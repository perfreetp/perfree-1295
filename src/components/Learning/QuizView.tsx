import { ArrowLeft, ArrowRight, Check, X, CheckCircle } from "lucide-react";
import { useLearningStore } from "@/stores/useLearningStore";
import { cn } from "@/lib/utils";

interface QuizViewProps {
  onComplete: () => void;
  onBack: () => void;
}

const optionLabels = ["A", "B", "C", "D"];

export default function QuizView({ onComplete, onBack }: QuizViewProps) {
  const {
    currentTask,
    currentQuizIndex,
    userAnswers,
    selectAnswer,
    nextQuiz,
  } = useLearningStore();

  if (!currentTask) return null;

  const currentQuiz = currentTask.quizzes[currentQuizIndex];
  const answerKey = `${currentTask.id}_${currentQuizIndex}`;
  const selectedOption = userAnswers[answerKey];
  const hasAnswered = selectedOption !== undefined;
  const isCorrect = hasAnswered && selectedOption === currentQuiz.correctIndex;
  const isLastQuiz = currentQuizIndex === currentTask.quizzes.length - 1;

  const handleOptionClick = (optionIndex: number) => {
    if (hasAnswered) return;
    selectAnswer(currentQuizIndex, optionIndex);
  };

  const handleNext = () => {
    if (isLastQuiz) {
      onComplete();
    } else {
      nextQuiz();
    }
  };

  const handlePrev = () => {
    if (currentQuizIndex > 0) {
      useLearningStore.setState({ currentQuizIndex: currentQuizIndex - 1 });
    } else {
      onBack();
    }
  };

  const progress = ((currentQuizIndex + 1) / currentTask.quizzes.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-cream/80 py-8 animate-fade-in">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-ink/70 hover:text-ink transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>返回任务列表</span>
          </button>

          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-2xl font-bold text-ink">
              {currentTask.title}
            </h2>
            <span className="text-ink/60 font-medium">
              第 {currentQuizIndex + 1} / {currentTask.quizzes.length} 题
            </span>
          </div>

          <div className="h-2 bg-ink/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-gold rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div
          className="bg-white rounded-2xl shadow-lg p-8 md:p-10 animate-scale-in"
          key={currentQuizIndex}
        >
          <div className="mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
                <span className="text-white font-bold font-serif">
                  {currentQuizIndex + 1}
                </span>
              </div>
              <h3 className="font-serif text-xl md:text-2xl text-ink leading-relaxed pt-1.5">
                {currentQuiz.question}
              </h3>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {currentQuiz.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrectOption = index === currentQuiz.correctIndex;
              let borderStyle = "border-ink/10 hover:border-gold/50";
              let bgStyle = "bg-cream/30 hover:bg-gold/5";

              if (hasAnswered) {
                if (isCorrectOption) {
                  borderStyle = "border-teal bg-teal/5";
                  bgStyle = "";
                } else if (isSelected && !isCorrectOption) {
                  borderStyle = "border-red-500 bg-red-50";
                  bgStyle = "";
                } else {
                  borderStyle = "border-ink/10 opacity-60";
                  bgStyle = "";
                }
              } else if (isSelected) {
                borderStyle = "border-gold bg-gold/10";
                bgStyle = "";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  disabled={hasAnswered}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 text-left group",
                    borderStyle,
                    bgStyle,
                    !hasAnswered && "cursor-pointer",
                    hasAnswered && "cursor-default"
                  )}
                >
                  <div
                    className={cn(
                      "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors duration-300",
                      hasAnswered && isCorrectOption && "bg-teal text-white",
                      hasAnswered && isSelected && !isCorrectOption && "bg-red-500 text-white",
                      !hasAnswered && isSelected && "bg-gold text-white",
                      !hasAnswered && !isSelected && "bg-ink/10 text-ink group-hover:bg-gold/20"
                    )}
                  >
                    {optionLabels[index]}
                  </div>
                  <span
                    className={cn(
                      "flex-1 text-base md:text-lg",
                      hasAnswered && isCorrectOption && "text-teal font-medium",
                      hasAnswered && isSelected && !isCorrectOption && "text-red-600",
                      !hasAnswered && "text-ink"
                    )}
                  >
                    {option}
                  </span>
                  {hasAnswered && isCorrectOption && (
                    <Check className="text-teal" size={24} />
                  )}
                  {hasAnswered && isSelected && !isCorrectOption && (
                    <X className="text-red-500" size={24} />
                  )}
                </button>
              );
            })}
          </div>

          {hasAnswered && (
            <div
              className={cn(
                "p-5 rounded-xl mt-6 animate-slide-up",
                isCorrect ? "bg-teal/10 border border-teal/20" : "bg-red-50 border border-red-200"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <>
                    <CheckCircle className="text-teal" size={20} />
                    <span className="font-bold text-teal">回答正确！</span>
                  </>
                ) : (
                  <>
                    <X className="text-red-500" size={20} />
                    <span className="font-bold text-red-600">回答错误</span>
                    <span className="text-ink/60 ml-2">
                      正确答案：{optionLabels[currentQuiz.correctIndex]}
                    </span>
                  </>
                )}
              </div>
              <p className="text-ink/80 leading-relaxed">
                <span className="font-medium">解析：</span>
                {currentQuiz.explanation}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handlePrev}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-ink/20 text-ink hover:bg-ink/5 transition-colors font-medium"
          >
            <ArrowLeft size={18} />
            <span>{currentQuizIndex > 0 ? "上一题" : "返回"}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!hasAnswered}
            className={cn(
              "flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-300",
              hasAnswered
                ? "bg-gradient-gold text-white hover:shadow-lg hover:shadow-gold/30"
                : "bg-ink/10 text-ink/40 cursor-not-allowed"
            )}
          >
            <span>{isLastQuiz ? "提交并查看成绩" : "下一题"}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
